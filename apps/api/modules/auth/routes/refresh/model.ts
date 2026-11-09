import { prisma } from '../../../../prisma/prisma-client.ts';
import type { Prisma } from '../../../../generated/prisma/client.ts';
import { unauthorizedError } from '../../shared/errors.ts';
import type { AuthSessionResult, SessionUser } from '../../shared/session.ts';
import {
  generateRefreshToken,
  parseRefreshToken,
  refreshTokenMatches,
  signAccessToken,
  type GeneratedRefreshToken,
  type RefreshTokenParts,
} from '../../shared/tokens.ts';

class RefreshTokenRotationConflictError extends Error {}

interface RefreshSessionResult {
  user: SessionUser;
  sessionId: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

type StoredRefreshToken = Prisma.refresh_tokensGetPayload<{
  include: { users: true };
}>;

const parsePresentedRefreshToken = (
  refreshTokenValue: string | undefined
): RefreshTokenParts => {
  const presentedRefreshToken = parseRefreshToken(refreshTokenValue);

  if (presentedRefreshToken === null) {
    throw unauthorizedError();
  }

  return presentedRefreshToken;
};

const revokeActiveRefreshTokensForSession = async (
  transaction: Prisma.TransactionClient,
  sessionId: string,
  revokedAt: Date
) => {
  await transaction.refresh_tokens.updateMany({
    where: {
      session_id: sessionId,
      revoked_at: null,
    },
    data: { revoked_at: revokedAt },
  });
};

const createAndStoreNextRefreshToken = async (
  transaction: Prisma.TransactionClient,
  storedRefreshToken: StoredRefreshToken
): Promise<GeneratedRefreshToken> => {
  const nextRefreshToken = generateRefreshToken();

  await transaction.refresh_tokens.create({
    data: {
      id: nextRefreshToken.id,
      session_id: storedRefreshToken.session_id,
      user_id: storedRefreshToken.user_id,
      token_hash: nextRefreshToken.hash,
      expires_at: storedRefreshToken.expires_at,
    },
  });

  return nextRefreshToken;
};

const claimRefreshTokenRotation = async (
  transaction: Prisma.TransactionClient,
  storedRefreshToken: StoredRefreshToken,
  nextRefreshTokenId: string,
  rotatedAt: Date
) => {
  const rotationClaimResult = await transaction.refresh_tokens.updateMany({
    where: {
      id: storedRefreshToken.id,
      used_at: null,
      revoked_at: null,
      expires_at: { gt: rotatedAt },
    },
    data: {
      used_at: rotatedAt,
      replaced_by_id: nextRefreshTokenId,
    },
  });

  if (rotationClaimResult.count !== 1) {
    throw new RefreshTokenRotationConflictError();
  }
};

const rotateRefreshToken = async (
  transaction: Prisma.TransactionClient,
  presentedRefreshToken: RefreshTokenParts
): Promise<RefreshSessionResult | null> => {
  const storedRefreshToken = await transaction.refresh_tokens.findUnique({
    where: { id: presentedRefreshToken.id },
    include: { users: true },
  });

  if (
    storedRefreshToken === null ||
    !refreshTokenMatches(
      presentedRefreshToken.secret,
      storedRefreshToken.token_hash
    )
  ) {
    return null;
  }

  const rotatedAt = new Date();

  if (storedRefreshToken.used_at !== null) {
    await revokeActiveRefreshTokensForSession(
      transaction,
      storedRefreshToken.session_id,
      rotatedAt
    );

    return null;
  }

  if (
    storedRefreshToken.revoked_at !== null ||
    storedRefreshToken.expires_at <= rotatedAt
  ) {
    return null;
  }

  const nextRefreshToken = await createAndStoreNextRefreshToken(
    transaction,
    storedRefreshToken
  );

  await claimRefreshTokenRotation(
    transaction,
    storedRefreshToken,
    nextRefreshToken.id,
    rotatedAt
  );

  return {
    user: storedRefreshToken.users,
    sessionId: storedRefreshToken.session_id,
    refreshToken: nextRefreshToken.value,
    refreshExpiresAt: storedRefreshToken.expires_at,
  };
};

const revokeSessionAfterRefreshTokenReplay = async (
  refreshTokenId: string,
  refreshTokenSecret: string
) => {
  const storedRefreshToken = await prisma.refresh_tokens.findUnique({
    where: { id: refreshTokenId },
    select: {
      token_hash: true,
      session_id: true,
      used_at: true,
    },
  });

  if (
    storedRefreshToken !== null &&
    storedRefreshToken.used_at !== null &&
    refreshTokenMatches(refreshTokenSecret, storedRefreshToken.token_hash)
  ) {
    await prisma.refresh_tokens.updateMany({
      where: {
        session_id: storedRefreshToken.session_id,
        revoked_at: null,
      },
      data: { revoked_at: new Date() },
    });
  }
};

const createAuthSessionResult = async (
  refreshedSession: RefreshSessionResult
): Promise<AuthSessionResult> => {
  if (refreshedSession.user.role !== 'user') {
    throw unauthorizedError();
  }

  const accessToken = await signAccessToken(
    refreshedSession.user.id,
    'user',
    refreshedSession.sessionId
  );

  return {
    user: refreshedSession.user,
    accessToken: accessToken.token,
    accessExpiresAt: accessToken.expiresAt,
    refreshToken: refreshedSession.refreshToken,
    refreshExpiresAt: refreshedSession.refreshExpiresAt,
  };
};

const refreshSession = async (
  refreshTokenValue: string | undefined
): Promise<AuthSessionResult> => {
  const presentedRefreshToken = parsePresentedRefreshToken(refreshTokenValue);

  let refreshedSession: RefreshSessionResult | null;

  try {
    refreshedSession = await prisma.$transaction((transaction) =>
      rotateRefreshToken(transaction, presentedRefreshToken)
    );
  } catch (error) {
    if (error instanceof RefreshTokenRotationConflictError) {
      await revokeSessionAfterRefreshTokenReplay(
        presentedRefreshToken.id,
        presentedRefreshToken.secret
      );
      throw unauthorizedError();
    }

    throw error;
  }

  if (refreshedSession === null) {
    throw unauthorizedError();
  }

  return createAuthSessionResult(refreshedSession);
};

export default refreshSession;

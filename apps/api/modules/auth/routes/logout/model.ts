import { prisma } from '../../../../prisma/prisma-client.ts';
import { parseRefreshToken, refreshTokenMatches } from '../../shared/tokens.ts';

const logout = async (value: string | undefined) => {
  const parsedToken = parseRefreshToken(value);

  if (parsedToken === null) {
    return;
  }

  const token = await prisma.refresh_tokens.findUnique({
    where: { id: parsedToken.id },
    select: { token_hash: true, session_id: true },
  });

  if (
    token === null ||
    !refreshTokenMatches(parsedToken.secret, token.token_hash)
  ) {
    return;
  }

  await prisma.refresh_tokens.updateMany({
    where: {
      session_id: token.session_id,
      revoked_at: null,
    },
    data: { revoked_at: new Date() },
  });
};

export default logout;

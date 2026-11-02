import { decodeJwt } from 'jose';

export function getJwtExpiresAt(token: string): string {
  try {
    const payload = decodeJwt(token);

    if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) {
      throw new Error();
    }

    return new Date(payload.exp * 1000).toISOString();
  } catch {
    throw new Error('JWT регистрации не содержит корректного срока действия');
  }
}

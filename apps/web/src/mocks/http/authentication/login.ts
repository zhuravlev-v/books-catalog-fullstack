import type { LoginRequest } from '@/api/generated/models';

export async function parseLoginRequest(request: Request): Promise<LoginRequest | undefined> {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== 'object' ||
      body === null ||
      !('username' in body) ||
      !('password' in body) ||
      typeof body.username !== 'string' ||
      typeof body.password !== 'string' ||
      body.username.length === 0 ||
      body.password.length === 0
    ) {
      return undefined;
    }

    return {
      username: body.username,
      password: body.password,
    };
  } catch {
    return undefined;
  }
}

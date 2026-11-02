import type { LoginResponseData, LoginResponseDataUser } from '@/api/generated/models';

type LoginUser = NonNullable<LoginResponseDataUser>;

export type AuthUser = Required<Pick<LoginUser, 'id' | 'username' | 'email' | 'role'>>;

export interface AuthSession {
  token: NonNullable<LoginResponseData['token']>;
  user: AuthUser;
  expiresAt: LoginResponseData['expires_at'];
}

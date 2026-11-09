import type { AuthUser as AuthUserDto } from '@books/api-contract/models';

export type AuthUser = AuthUserDto;

export interface AuthSession {
  user: AuthUser;
  expiresAt: string;
}

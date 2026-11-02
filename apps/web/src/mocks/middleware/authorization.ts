import { HttpResponse } from 'msw';

import { authenticateRequest, type AuthenticationContext } from '@/mocks/middleware/authentication';

export type UserAuthorizationContext = AuthenticationContext & {
  role: 'user';
};

function forbidden(): never {
  throw new HttpResponse(null, { status: 403 });
}

export function authorizeUser(authentication: AuthenticationContext): UserAuthorizationContext {
  if (authentication.role !== 'user') {
    return forbidden();
  }

  return {
    ...authentication,
    role: authentication.role,
  };
}

export async function requireUser(request: Request): Promise<UserAuthorizationContext> {
  const authentication = await authenticateRequest(request);

  return authorizeUser(authentication);
}

import { getPostAuthRegisterMockHandler } from '@/api/generated/endpoints/authentication/authentication.msw';
import { registerResolver } from '@/mocks/resolvers/authentication/register';

export const registerHandler = getPostAuthRegisterMockHandler(registerResolver);

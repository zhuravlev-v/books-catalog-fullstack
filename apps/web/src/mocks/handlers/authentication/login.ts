import { getPostAuthLoginMockHandler } from '@/api/generated/endpoints/authentication/authentication.msw';
import { loginResolver } from '@/mocks/resolvers/authentication/login';

export const loginHandler = getPostAuthLoginMockHandler(loginResolver);

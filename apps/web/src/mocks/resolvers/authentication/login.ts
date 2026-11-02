import { HttpResponse } from 'msw';

import type { Error as ApiError, LoginResponse } from '@/api/generated/models';
import { parseLoginRequest } from '@/mocks/http/authentication/login';
import { usersRepository } from '@/mocks/repositories/authentication/login';
import { createLoginResponse, hasValidPassword } from '@/mocks/services/authentication/login';

interface LoginRequestInfo {
  request: Request;
}

function unauthorized(): never {
  throw HttpResponse.json<ApiError>(
    {
      success: false,
      errors: [{ message: 'Неверный логин или пароль' }],
    },
    { status: 401 }
  );
}

export async function loginResolver({ request }: LoginRequestInfo): Promise<LoginResponse> {
  const credentials = await parseLoginRequest(request);

  if (credentials === undefined) {
    return unauthorized();
  }

  const user = await usersRepository.findByUsername(credentials.username);

  if (!hasValidPassword(user, credentials.password)) {
    return unauthorized();
  }

  return createLoginResponse(user);
}

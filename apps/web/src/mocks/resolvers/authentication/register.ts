import { HttpResponse } from 'msw';

import type { Error as ApiError, ErrorItem, RegisterResponse } from '@/api/generated/models';
import { parseRegisterRequest } from '@/mocks/http/authentication/register';
import {
  registerUsersRepository,
  type RegistrationConflictField,
} from '@/mocks/repositories/authentication/register';
import { createRegisterResponse } from '@/mocks/services/authentication/register';

interface RegisterRequestInfo {
  request: Request;
}

const CONFLICT_MESSAGES: Record<RegistrationConflictField, string> = {
  username: 'Пользователь с таким логином уже зарегистрирован',
  email: 'Пользователь с таким email уже зарегистрирован',
};

function unprocessable(errors: ErrorItem[]): never {
  throw HttpResponse.json<ApiError>({ success: false, errors }, { status: 422 });
}

function conflict(fields: RegistrationConflictField[]): never {
  throw HttpResponse.json<ApiError>(
    {
      success: false,
      errors: fields.map((field) => ({ field, message: CONFLICT_MESSAGES[field] })),
    },
    { status: 409 }
  );
}

export async function registerResolver({ request }: RegisterRequestInfo): Promise<RegisterResponse> {
  const parsedRequest = await parseRegisterRequest(request);

  if (parsedRequest.errors !== undefined) {
    return unprocessable(parsedRequest.errors);
  }

  const result = await registerUsersRepository.create(parsedRequest.data);

  if (result.conflicts !== undefined) {
    return conflict(result.conflicts);
  }

  return createRegisterResponse(result.user);
}

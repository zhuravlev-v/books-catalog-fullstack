import type { ErrorItem } from '@/api/generated/models';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export type ParseRegisterRequestResult =
  | { data: RegisterInput; errors?: never }
  | { data?: never; errors: ErrorItem[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function parseRegisterRequest(
  request: Request
): Promise<ParseRegisterRequestResult> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { errors: [{ message: 'Тело запроса должно быть в формате JSON' }] };
  }

  if (!isObject(body)) {
    return { errors: [{ message: 'Тело запроса должно быть JSON-объектом' }] };
  }

  const errors: ErrorItem[] = [];
  const { username, email, password } = body;

  if (typeof username !== 'string') {
    errors.push({ field: 'username', message: 'Логин должен быть строкой' });
  } else if (
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
    errors.push({ field: 'username', message: 'Логин должен содержать от 3 до 30 символов' });
  }

  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : undefined;

  if (normalizedEmail === undefined) {
    errors.push({ field: 'email', message: 'Email должен быть строкой' });
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    errors.push({ field: 'email', message: 'Укажите корректный email' });
  }

  if (typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Пароль должен быть строкой' });
  } else if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    errors.push({ field: 'password', message: 'Пароль должен содержать от 8 до 100 символов' });
  }

  if (
    errors.length > 0 ||
    typeof username !== 'string' ||
    normalizedEmail === undefined ||
    typeof password !== 'string'
  ) {
    return { errors };
  }

  return {
    data: {
      username,
      email: normalizedEmail,
      password,
    },
  };
}

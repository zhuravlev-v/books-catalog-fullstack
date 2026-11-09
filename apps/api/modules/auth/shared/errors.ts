import { HttpError } from '../../../http/errors.ts';

export const unauthorizedError = () =>
  new HttpError(401, [
    {
      message: 'Сессия отсутствует или недействительна',
    },
  ]);

export const invalidCredentialsError = () =>
  new HttpError(401, [
    {
      message: 'Неверное имя пользователя или пароль',
    },
  ]);

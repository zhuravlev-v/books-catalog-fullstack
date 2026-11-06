import type { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';

import { HttpError, isHttpError } from '../http/errors.ts';

function getMulterHttpError(error: MulterError): HttpError {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return new HttpError(413, [
      {
        field: error.field,
        message: 'Размер файла превышает допустимый предел',
      },
    ]);
  }

  return new HttpError(422, [
    {
      field: error.field,
      message: `Некорректные multipart-данные: ${error.message}`,
    },
  ]);
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof MulterError) {
    const httpError = getMulterHttpError(error);

    res.status(httpError.status).json(httpError.toResponse());
    return;
  }

  if (isHttpError(error)) {
    res.status(error.status).json(error.toResponse());
    return;
  }

  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || 500);
  res.send('error');
};

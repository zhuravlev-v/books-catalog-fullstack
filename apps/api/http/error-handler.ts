import type { ErrorRequestHandler } from 'express';
import { isHttpError } from './errors.ts';

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (isHttpError(error)) {
    res.status(error.status).json(error.toResponse());
    return;
  }

  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || 500);
  res.send('error');
};

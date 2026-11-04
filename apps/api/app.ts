import express, { type ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import indexRouter from './modules/index.ts';
import booksRouter from './modules/books/routes.ts';
import { isHttpError } from './http/errors.ts';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

const basePathApi = process.env.API_BASE_PATH ?? '/api/v1'; 

app.use(basePathApi, indexRouter);
app.use(basePathApi, booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send('Not Found');
});

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    res.status(err.status).json(err.toResponse());
    return;
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send('error');
};
app.use(errorHandler);

const port = Number(process.env.API_PORT ?? 3001);
app.listen(port, '0.0.0.0');

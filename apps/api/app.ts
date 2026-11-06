import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import indexRouter from './modules/index.ts';
import booksRouter from './modules/books/routes.ts';
import { errorHandler } from './middleware/error-handler.ts';
import { env } from './config/env.ts';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

const basePathApi = env.API_BASE_PATH;

app.use(basePathApi, indexRouter);
app.use(basePathApi, booksRouter);

// catch 404 and forward to error handler
app.use(function (_, res) {
  res.status(404).send('Not Found');
});

app.use(errorHandler);

const port = env.API_PORT;
app.listen(port, '0.0.0.0');

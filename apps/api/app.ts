import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import indexRouter from './modules/index.ts';
import booksRouter from './modules/books/routes.ts';
import { errorHandler } from './http/error-handler.ts';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

const basePathApi = process.env.API_BASE_PATH ?? '/api/v1'; 

app.use(basePathApi, indexRouter);
app.use(basePathApi, booksRouter);

// catch 404 and forward to error handler
app.use(function(_, res) {
  res.status(404).send('Not Found');
});

app.use(errorHandler);

const port = Number(process.env.API_PORT ?? 3001);
app.listen(port, '0.0.0.0');

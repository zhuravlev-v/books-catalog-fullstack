import express from 'express';
import cookieParser from 'cookie-parser';

import indexRouter from './modules/index.ts';
import booksRouter from './modules/books/routes/routes.ts';
import authRouter from './modules/auth/routes/routes.ts';
import authorsRouter from './modules/authors/routes/routes.ts';
import { errorHandler } from './middleware/error-handler.ts';
import { env } from './config/env.ts';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const basePathApi = env.API_BASE_PATH;

app.use(basePathApi, indexRouter);
app.use(basePathApi, booksRouter);
app.use(`${basePathApi}/auth`, authRouter);
app.use(`${basePathApi}/authors`, authorsRouter);

// catch 404 and forward to error handler
app.use(function (_, res) {
  res.status(404).send('Not Found');
});

app.use(errorHandler);

const port = env.API_PORT;
app.listen(port, '0.0.0.0');

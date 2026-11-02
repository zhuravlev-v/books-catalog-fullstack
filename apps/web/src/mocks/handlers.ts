import { loginHandler } from './handlers/authentication/login';
import { registerHandler } from './handlers/authentication/register';
import { deleteAuthorsIdHandler } from './handlers/authors/deleteAuthorsId';
import { getAuthorsHandler } from './handlers/authors/getAuthors';
import { getAuthorsIdHandler } from './handlers/authors/getAuthorsId';
import { postAuthorsHandler } from './handlers/authors/postAuthors';
import { putAuthorsIdHandler } from './handlers/authors/putAuthorsId';
import { deleteBooksIdHandler } from './handlers/books/deleteBooksId';
import { getBooksHandler } from './handlers/books/getBooks';
import { getBooksIdHandler } from './handlers/books/getBooksId';
import { patchBooksIdHandler } from './handlers/books/patchBooksId';
import { postBooksHandler } from './handlers/books/postBooks';
import { putBooksIdHandler } from './handlers/books/putBooksId';
import { getReportsTopAuthorsHandler } from './handlers/reports/getReportsTopAuthors';

export const handlers = [
  registerHandler,
  loginHandler,
  getAuthorsHandler,
  getAuthorsIdHandler,
  postAuthorsHandler,
  putAuthorsIdHandler,
  deleteAuthorsIdHandler,
  getBooksHandler,
  getBooksIdHandler,
  postBooksHandler,
  putBooksIdHandler,
  patchBooksIdHandler,
  deleteBooksIdHandler,
  getReportsTopAuthorsHandler,
];

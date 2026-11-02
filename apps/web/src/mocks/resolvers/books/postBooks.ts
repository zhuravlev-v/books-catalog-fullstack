import type { BookResponse } from '@/api/generated/models';
import { parsePostBooksRequest } from '@/mocks/http/books/postBooks';
import { requireUser } from '@/mocks/middleware/authorization';
import { postBooksRepository } from '@/mocks/repositories/books/postBooks';
import {
  UnknownBookAuthorsError,
  unprocessableBookMutation,
  unprocessableUnknownBookAuthors,
} from '@/mocks/shared/books/mutation';

interface PostBooksRequestInfo {
  request: Request;
}

export async function postBooksResolver({ request }: PostBooksRequestInfo): Promise<BookResponse> {
  await requireUser(request);

  const parsedRequest = await parsePostBooksRequest(request);

  if (parsedRequest.errors !== undefined) {
    return unprocessableBookMutation(parsedRequest.errors);
  }

  try {
    const book = await postBooksRepository.create(parsedRequest.data);

    return { success: true, data: book };
  } catch (error) {
    if (error instanceof UnknownBookAuthorsError) {
      return unprocessableUnknownBookAuthors(error);
    }

    throw error;
  }
}

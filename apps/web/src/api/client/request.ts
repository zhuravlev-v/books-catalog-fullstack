import {
  ApiError,
  getApiErrorMessage,
  getApiFieldErrors,
} from './api-error';

type ResponseData<T> = T extends { data: infer Data } ? Data : T;

export type ErrorType<T> = ApiError<ResponseData<T>>;
export type BodyType<T> = T;

interface ApiClientConfiguration {
  getAccessToken?: () => string | null | undefined;
  onUnauthorized?: (error: ApiError, url: string) => void | Promise<void>;
}

let configuration: ApiClientConfiguration = {};

export function configureApiClient(nextConfiguration: ApiClientConfiguration) {
  configuration = { ...nextConfiguration };
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  const headers = new Headers(options.headers);
  const accessToken = configuration.getAccessToken?.();

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(url, { ...options, headers });
  } catch (cause) {
    throw new ApiError('Нет соединения с сервером', {
      status: 0,
      cause,
    });
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const error = new ApiError(getApiErrorMessage(data, response.statusText), {
      status: response.status,
      data,
      errors: getApiFieldErrors(data),
    });

    if (response.status === 401) {
      await configuration.onUnauthorized?.(error, url);
    }

    throw error;
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if ([204, 205, 304].includes(response.status)) {
    return undefined;
  }

  const body = await response.text();

  if (!body) {
    return undefined;
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('json')) {
    try {
      return JSON.parse(body) as unknown;
    } catch (cause) {
      throw new ApiError('Сервер вернул некорректный JSON', {
        status: response.status,
        data: body,
        cause,
      });
    }
  }

  return body;
}

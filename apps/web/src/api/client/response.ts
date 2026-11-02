export interface GeneratedResponse<T> {
  data: T;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

export function unwrapGeneratedResponse<T>(response: GeneratedResponse<T>): T {
  return response.data;
}

export function unwrapApiResponse<T>(response: GeneratedResponse<ApiResponse<T>>): T | undefined {
  return response.data.data;
}

import { defineConfig } from 'orval';
import { loadEnv } from 'vite';

const { VITE_API_URL } = loadEnv('development', process.cwd(), '');

if (!VITE_API_URL) {
  throw new Error('VITE_API_URL is required');
}

export default defineConfig({
  bookCatalog: {
    input: {
      target: './book.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/endpoints',
      schemas: './src/api/generated/models',
      baseUrl: VITE_API_URL,
      client: 'vue-query',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './src/api/client/request.ts',
          name: 'apiRequest',
        },
        fetch: {
          includeHttpResponseReturnType: true,
          forceSuccessResponse: true,
        },
      },
      clean: true,
      formatter: 'prettier',
      mock: {
        indexMockFiles: true,
        generators: [
          {
            type: 'msw',
            baseUrl: VITE_API_URL,
            delay: 200,
          },
          {
            type: 'faker',
            locale: 'ru',
          },
        ],
      },
    },
  },
  bookCatalogZod: {
    input: {
      target: './book.yaml',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: './src/api/generated/schemas',
      clean: true,
      formatter: 'prettier',
      override: {
        zod: {
          version: 4,
          variant: 'classic',
        },
      },
    },
  },
});

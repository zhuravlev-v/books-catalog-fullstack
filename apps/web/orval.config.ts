import { defineConfig } from 'orval';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';

const rootEnvDir = fileURLToPath(new URL('../..', import.meta.url));
const { API_BASE_PATH } = loadEnv('development', rootEnvDir, '');

if (!API_BASE_PATH) {
  throw new Error('API_BASE_PATH is required');
}

export default defineConfig({
  bookCatalog: {
    input: {
      target: '../../packages/api-contract/openapi/book.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/endpoints',
      schemas: './src/api/generated/models',
      baseUrl: API_BASE_PATH,
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
            baseUrl: API_BASE_PATH,
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
      target: '../../packages/api-contract/openapi/book.yaml',
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

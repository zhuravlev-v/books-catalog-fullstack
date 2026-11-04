import { defineConfig } from 'orval';

const specification = './openapi/book.yaml';

export default defineConfig({
  models: {
    input: {
      target: specification,
    },
    output: {
      mode: 'single',
      target: './src/generated/http-client.ts',
      schemas: {
        path: './src/generated/models.ts',
        mode: 'single',
        type: 'typescript',
      },
      client: 'fetch',
      clean: ['./src/generated/http-client.ts', './src/generated/models.ts'],
      formatter: 'prettier',
    },
  },
  schemas: {
    input: {
      target: specification,
    },
    output: {
      mode: 'single',
      client: 'zod',
      target: './src/generated/schemas/index.ts',
      clean: true,
      formatter: 'prettier',
      override: {
        zod: {
          version: 4,
          variant: 'classic',
          strict: {
            param: true,
            query: true,
            body: true,
            response: true,
          },
          coerce: {
            param: true,
            query: true,
          },
          generateReusableSchemas: true,
        },
      },
    },
  },
});

import { defineConfig } from 'orval';

const specification = './openapi/book.yaml';

export default defineConfig({
  models: {
    input: {
      target: specification,
    },
    output: {
      schemas: {
        path: './src/generated/models/index.ts',
        mode: 'single',
        type: 'typescript',
      },
      clean: true,
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
        },
      },
    },
  },
});

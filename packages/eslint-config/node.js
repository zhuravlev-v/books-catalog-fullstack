import skipFormatting from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { baseConfig } from './base.js';

export default tseslint.config(
  ...baseConfig,
  {
    name: 'books/node',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  skipFormatting
);

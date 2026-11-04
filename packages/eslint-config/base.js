import { globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export const baseConfig = tseslint.config(
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/generated/**']),
  ...tseslint.configs.recommended
);

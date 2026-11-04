import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript';
import skipFormatting from 'eslint-config-prettier/flat';
import { globalIgnores } from 'eslint/config';
import pluginOxlint from 'eslint-plugin-oxlint';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default defineConfigWithVueTs(
  {
    name: 'books/vue-files',
    files: ['**/*.{vue,ts,mts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/generated/**',
  ]),
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    name: 'books/vue-rules',
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  skipFormatting
);

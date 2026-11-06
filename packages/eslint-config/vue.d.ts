import type { defineConfigWithVueTs } from '@vue/eslint-config-typescript';

declare const vueConfig: ReturnType<typeof defineConfigWithVueTs>;

export default vueConfig;

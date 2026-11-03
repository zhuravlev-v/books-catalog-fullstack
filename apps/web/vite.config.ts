import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
const rootEnvDir = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootEnvDir, '');

  return {
    base: '/',
    envDir: rootEnvDir,
    envPrefix: ['VITE_', 'API_BASE_PATH'],
    plugins: [vue(), vueDevTools(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: Number(env.WEB_PORT),
      strictPort: true,
      proxy: {
        [env.API_BASE_PATH]: {
          target: `http://localhost:${env.API_PORT}`,
          changeOrigin: true,
        },
      },
    },
  };
});

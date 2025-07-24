import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  server: {
    host: true,
    port: 8080,
    open: true,
    cors: false,
    proxy: {
      '/api': {
        target: 'http://192.168.170.153:6666',
        changeOrigin: true,
        // rewrite: (path) => path,
        rewrite: (path) => path.replace(/^\/api\/?(api)?/, ''),
      },
    },
  },
});

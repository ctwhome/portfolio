import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import Icons from 'unplugin-icons/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    svelte(),
    Icons({
      compiler: 'svelte',
      autoInstall: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'CTWKit',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'svelte',
        /^~icons\/.*/  // Treat all icon imports as external
      ],
      output: {
        globals: {
          svelte: 'Svelte'
        }
      }
    }
  }
});

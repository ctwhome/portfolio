import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import Icons from 'unplugin-icons/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
      autoInstall: true
    })
  ],
  optimizeDeps: {
    exclude: ['@iconify/json', 'vanilla-tilt']
  },
  resolve: {
    alias: {
      $lib: resolve(__dirname, './src/lib')
    }
  }
});

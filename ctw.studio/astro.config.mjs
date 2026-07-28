import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ctw.studio',
  output: 'static',
  outDir: './dist',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()]
  }
});

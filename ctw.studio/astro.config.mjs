import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  site: 'https://ctw.studio',
  output: 'static',
  outDir: './dist',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss(), Icons({ compiler: 'astro' })]
  }
});

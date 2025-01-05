import path from 'path';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from "mdsvex";
import mdsvexConfig from './mdsvex.config.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			...mdsvexConfig,
			extension: ['.svelte', '.svx', '.md'],
		}),
	],
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	kit: {
		adapter: adapter({
			fallback: '200.html',
			runtime: 'edge'
		}),
		alias: {
			$api: path.resolve('./src/api'),
			$components: path.resolve('./src/lib/components'),
			$assets: path.resolve('./src/assets'),
			$content: path.resolve('./src/content')
		}
	}
};

export default config;

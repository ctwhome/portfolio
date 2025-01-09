import path from 'path';
// import adapter from '@sveltejs/adapter-node';
import adapter from '@sveltejs/svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from "mdsvex";
import mdsvexConfig from './mdsvex.config.js'


/** @type {import('@sveltejs/kit').Config} */
const config = {

	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig),
	],
	// extensions: ['.svelte', '.md', '.svx'],
	extensions: [
		'.svelte',
		...mdsvexConfig.extensions
	],
	kit: {
		// https://kit.svelte.dev/docs/adapter-static
		// adapter: adapter({
		// 	// runtime: 'edge',
		// 	fallback: '200.html' // may differ from host to host
		// }),

		alias: {
			// these are the aliases and paths to them
			$api: path.resolve('./src/api'),
			$components: path.resolve('./src/lib/components'),
			$assets: path.resolve('./src/assets'),
			$content: path.resolve('./src/lib/content')
		}
	}
};

export default config;

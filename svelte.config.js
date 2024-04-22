// import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import { fileURLToPath } from 'url';
// Convert URL to path for current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));


import adapter from '@sveltejs/adapter-vercel';

// import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { importAssets } from 'svelte-preprocess-import-assets';
import { mdsvex } from "mdsvex";
import mdsvexConfig from './mdsvex.config.js'


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		importAssets(),
		mdsvex(mdsvexConfig),
		// mdsvex({
		// 	extensions: ['.md', '.svx'],
		// 	layout: {
		// 		_: "/src/layouts/default.svelte", // Default layout for markdown files
		// 		blog: "/src/layouts/blog.svelte",
		// 		project: "/src/layouts/project.svelte",


		// 		// project: "./path/to/article/layout.svelte",
		// 		// _: "./path/to/fallback/layout.svelte"
		// 	},
		// 	remarkPlugins: [relativeImages],
		// }),
	],
	// extensions: ['.svelte', '.md', '.svx'],
	extensions: [
		'.svelte',
		...mdsvexConfig.extensions
	],
	kit: {
		// https://kit.svelte.dev/docs/adapter-static
		adapter: adapter(
			{
				fallback: '200.html' // may differ from host to host
			}
		),

		alias: {
			// these are the aliases and paths to them
			$api: path.resolve(__dirname, 'src/api'),
			$components: path.resolve(__dirname, 'src/lib/components'),
			$assets: path.resolve(__dirname, 'src/assets'),
			$content: path.resolve(__dirname, 'src/content')
		}
	}
};

export default config;

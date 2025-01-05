import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import Icons from 'unplugin-icons/vite'

import VitePluginRestart from 'vite-plugin-restart';
import { viteStaticCopy } from 'vite-plugin-static-copy'


export default defineConfig({
	plugins: [
		enhancedImages(),

		VitePluginRestart({ restart: ['./content/**'] }),
		viteStaticCopy({ targets: [{ src: './src/content/*', dest: './content/' }] }),

		sveltekit(),
		Icons({
			compiler: 'svelte',
			autoInstall: true,
		}),
	],
	// optimizeDeps: {
	// 	disabled: true,
	// },
});

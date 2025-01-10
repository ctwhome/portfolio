import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import Icons from 'unplugin-icons/vite'
import VitePluginRestart from 'vite-plugin-restart';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path';

// @ts-ignore
export default defineConfig(({ mode }) => ({
	resolve: {
		alias: {
			'ctw-kit': mode === 'development'
				? path.resolve(__dirname, '../ctw-kit/src/lib')
				: 'ctw-kit'
		}
	},
	plugins: [
		enhancedImages(),

		VitePluginRestart({
			restart: [
				'./content/**',
				'../ctw-kit/src/lib/**/*.svelte'
			]
		}),
		viteStaticCopy({ targets: [{ src: './src/content/*', dest: './content/' }] }),

		sveltekit(),
		Icons({
			compiler: 'svelte',
			autoInstall: true,
		}),
	],
	server: {
		fs: {
			// Allow serving files from parent directories
			allow: ['..', '../..']
		}
	},
	// optimizeDeps: {
	// 	disabled: true,
	// },
}));

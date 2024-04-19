import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import Icons from 'unplugin-icons/vite'

// import copyImagesPlugin from './vitePlugins/vite-plugin-copy-images';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		Icons({
			compiler: 'svelte',
			autoInstall: true,
		}),
		// copyImagesPlugin()
	],
	// optimizeDeps: {
	// 	disabled: true,
	// },
});

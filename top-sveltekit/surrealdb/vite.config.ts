import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'
import VitePluginRestart from 'vite-plugin-restart';
import { viteStaticCopy } from 'vite-plugin-static-copy'

const config = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
		VitePluginRestart({ restart: ['./content/**'] }) as any,
		viteStaticCopy({ targets: [{ src: './src/lib/content/*', dest: './content/' }] }) as any,
	],
};

export default defineConfig(config);

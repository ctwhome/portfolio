<script lang="ts">
	import { onMount } from 'svelte';
	import { initScene, camera, renderer, setCameraView, cameraControls } from './initScene.ts';

	let canvas: HTMLCanvasElement;
	let cameraNear = 0.01;
	let cameraFar = 10.0;

	onMount(() => {
		initScene(canvas);
	});
</script>

<canvas bind:this={canvas} class="bg-red-400 w-full" />

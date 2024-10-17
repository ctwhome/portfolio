<script>
	import Gallery from '$lib/components/Gallery.svelte';
	import { onMount } from 'svelte';

	let images = [];
	let videos = [];

	onMount(() => {
		// Find all images and videos in the content
		const content = document.querySelector('.prose');
		if (content) {
			images = Array.from(content.querySelectorAll('img')).map((img) => img.src);
			videos = Array.from(content.querySelectorAll('video')).map((video) => video.src);

			// Remove original images and videos
			// content.querySelectorAll('img, video').forEach((el) => el.remove());
		}
	});
</script>

<div class="prose mx-auto w-full overflow-auto break-words px-3 sm:prose-lg">
	<slot />
	{#if images.length > 0 || videos.length > 0}
		<Gallery {images} {videos} />
	{/if}
</div>

<style>
	/* :global(.prose img, .prose video) {
		display: none;
	}*/
</style>

<script>
	import Gallery from '$lib/components/Gallery.svelte';
	import { onMount } from 'svelte';

	let images = /** @type {string[]} */ ([]);
	let videos = /** @type {string[]} */ ([]);
	let galleryComponent = /** @type {Gallery | null} */ (null);

	onMount(() => {
		// Find all images and videos in the content
		const content = document.querySelector('.prose');
		if (content) {
			images = Array.from(content.querySelectorAll('img')).map(
				(img) => /** @type {HTMLImageElement} */ (img).src
			);
			videos = Array.from(content.querySelectorAll('video')).map(
				(video) => /** @type {HTMLVideoElement} */ (video).src
			);

			// Add click event listeners to images
			content.querySelectorAll('img').forEach((img, index) => {
				/** @type {HTMLImageElement} */ (img).style.cursor = 'pointer';
				img.addEventListener('click', (e) => {
					e.preventDefault();
					if (galleryComponent) galleryComponent.openGallery(index);
				});
			});

			// Add click event listeners to videos
			content.querySelectorAll('video').forEach((video, index) => {
				/** @type {HTMLVideoElement} */ (video).style.cursor = 'pointer';
				video.addEventListener('click', (e) => {
					e.preventDefault();
					if (galleryComponent) galleryComponent.openGallery(images.length + index);
				});
			});
		}
	});
</script>

<div class="prose mx-auto w-full overflow-auto break-words px-3 sm:prose-lg">
	<slot />
</div>

{#if images.length > 0 || videos.length > 0}
	<Gallery bind:this={galleryComponent} {images} {videos} />
{/if}

<style>
	:global(.prose img, .prose video) {
		display: inline-block;
		max-width: 100%;
		height: auto;
	}
</style>

<script lang="ts">
	import Gallery from '$lib/components/Gallery.svelte';
	import { onMount } from 'svelte';

	let images: string[] = [];
	let videos: string[] = [];
	let galleryComponent: Gallery;

	onMount(() => {
		// Find all images and videos in the content
		const content = document.querySelector('.prose');
		if (content) {
			images = Array.from(content.querySelectorAll('img')).map((img) => img.src);
			videos = Array.from(content.querySelectorAll('video')).map((video) => video.src);

			// Add click event listeners to images
			content.querySelectorAll('img').forEach((img, index) => {
				img.style.cursor = 'pointer';
				img.addEventListener('click', (e) => {
					e.preventDefault();
					galleryComponent.openGallery(index);
				});
			});

			// Add click event listeners to videos
			content.querySelectorAll('video').forEach((video, index) => {
				video.style.cursor = 'pointer';
				video.addEventListener('click', (e) => {
					e.preventDefault();
					galleryComponent.openGallery(images.length + index);
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

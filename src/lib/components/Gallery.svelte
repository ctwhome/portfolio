<script lang="ts">
	import { onMount } from 'svelte';

	export let images: string[] = [];
	export let videos: string[] = [];

	let currentIndex = 0;
	let isOpen = false;
	let mediaElements: HTMLElement[];
	let touchStartX = 0;
	let touchEndX = 0;

	$: currentMedia = [...images, ...videos][currentIndex];
	$: isImage = currentIndex < images.length;

	export function openGallery(index: number) {
		currentIndex = index;
		isOpen = true;
	}

	function closeGallery() {
		isOpen = false;
	}

	function next() {
		currentIndex = (currentIndex + 1) % (images.length + videos.length);
	}

	function prev() {
		currentIndex =
			(currentIndex - 1 + images.length + videos.length) % (images.length + videos.length);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen) return;
		if (event.key === 'ArrowRight') next();
		if (event.key === 'ArrowLeft') prev();
		if (event.key === 'Escape') closeGallery();
	}

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
	}

	function handleTouchMove(event: TouchEvent) {
		touchEndX = event.touches[0].clientX;
	}

	function handleTouchEnd() {
		if (touchStartX - touchEndX > 50) {
			next();
		} else if (touchEndX - touchStartX > 50) {
			prev();
		}
		touchStartX = 0;
		touchEndX = 0;
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="gallery">
	{#each images as image, index}
		<img src={image} alt="Gallery image" on:click={() => openGallery(index)} class="gallery-item" />
	{/each}
	{#each videos as video, index}
		<video src={video} on:click={() => openGallery(images.length + index)} class="gallery-item" />
	{/each}
</div>

{#if isOpen}
	<div class="fullscreen-gallery" on:click={closeGallery}>
		<button class="nav-button prev" on:click|stopPropagation={prev}>&#8592;</button>
		<button class="nav-button next" on:click|stopPropagation={next}>&#8594;</button>
		<div
			class="media-container"
			on:click|stopPropagation
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:touchend={handleTouchEnd}
		>
			{#if isImage}
				<img src={currentMedia} alt="Fullscreen image" />
			{:else}
				<video src={currentMedia} controls />
			{/if}
		</div>
		<div class="thumbnails" on:click|stopPropagation>
			{#each [...images, ...videos] as media, index}
				<div
					class="thumbnail"
					class:active={index === currentIndex}
					on:click={() => (currentIndex = index)}
				>
					{#if index < images.length}
						<img src={media} alt="Thumbnail" />
					{:else}
						<video src={media} />
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.gallery {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 20px;
	}

	.gallery-item {
		width: 100px;
		height: 100px;
		object-fit: cover;
		cursor: pointer;
	}

	.fullscreen-gallery {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.9);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.media-container {
		max-width: 90%;
		max-height: 80%;
		margin-bottom: 20px;
		touch-action: pan-y;
	}

	.media-container img,
	.media-container video {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.thumbnails {
		display: flex;
		gap: 10px;
		overflow-x: auto;
		max-width: 90%;
		padding: 10px;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 5px;
	}

	.thumbnail {
		width: 60px;
		height: 60px;
		flex-shrink: 0;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}

	.thumbnail:hover,
	.thumbnail.active {
		opacity: 1;
	}

	.thumbnail img,
	.thumbnail video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.nav-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(255, 255, 255, 0.5);
		border: none;
		font-size: 24px;
		padding: 10px;
		cursor: pointer;
	}

	.prev {
		left: 20px;
	}

	.next {
		right: 20px;
	}

	@media (max-width: 768px) {
		.nav-button {
			display: none;
		}
	}
</style>

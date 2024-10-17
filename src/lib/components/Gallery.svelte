<script lang="ts">
  import { onMount } from 'svelte';

  export let images: string[] = [];
  export let videos: string[] = [];

  let currentIndex = 0;
  let isOpen = false;
  let mediaElements: HTMLElement[];

  $: currentMedia = [...images, ...videos][currentIndex];
  $: isImage = currentIndex < images.length;

  function openGallery(index: number) {
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
    currentIndex = (currentIndex - 1 + images.length + videos.length) % (images.length + videos.length);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen) return;
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') prev();
    if (event.key === 'Escape') closeGallery();
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
    <img
      src={image}
      alt="Gallery image"
      on:click={() => openGallery(index)}
      class="gallery-item"
    />
  {/each}
  {#each videos as video, index}
    <video
      src={video}
      on:click={() => openGallery(images.length + index)}
      class="gallery-item"
    />
  {/each}
</div>

{#if isOpen}
  <div class="fullscreen-gallery" on:click={closeGallery}>
    <button class="nav-button prev" on:click|stopPropagation={prev}>&#8592;</button>
    <button class="nav-button next" on:click|stopPropagation={next}>&#8594;</button>
    <div class="media-container" on:click|stopPropagation>
      {#if isImage}
        <img src={currentMedia} alt="Fullscreen image" />
      {:else}
        <video src={currentMedia} controls />
      {/if}
    </div>
  </div>
{/if}

<style>
  .gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .gallery-item {
    width: 150px;
    height: 150px;
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
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .media-container {
    max-width: 90%;
    max-height: 90%;
  }

  .media-container img,
  .media-container video {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
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
</style>

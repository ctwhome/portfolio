<script>
	import VanillaTilt from 'vanilla-tilt';
	import { onMount, onDestroy } from 'svelte';
	import ctwhomeProfile from '$lib/assets/images/ctwhome-profile.webp';

	export let data;
	const { post, media, date, tags, categories, next_prev, yoast_head } = data;

	let large = media?.media_details?.sizes?.large?.source_url || media?.source_url;
	let title = post?.title?.rendered;
	let content = post?.content?.rendered;

	let tiltCover;
	onMount(async () => {
		const tiltOtions = {
			max: 25,
			perspective: 1000,
			scale: 1.05,
			speed: 2000,
			transition: true,
			axis: null,
			reset: true,
			easing: 'cubic-bezier(.03,.98,.52,.99)',
			glare: false,
			'max-glare': 0.5,
			'glare-prerender': false
		};
		VanillaTilt.init(tiltCover, tiltOtions);

		// Get all image elements on the page
		const allImages = document.querySelectorAll('img');

		// Loop through each image and prevent dragging
		allImages.forEach((img) => {
			img.addEventListener('dragstart', function (event) {
				event.preventDefault();
			});
		});
	});

	onDestroy(() => {
		// Cleanup if needed
		// VanillaTilt.destroy(tiltElement);
	});
</script>

<svelte:head>
	{#if yoast_head}
		{@html yoast_head}
	{/if}
</svelte:head>
<div class="prose mx-auto mt-6 px-4 sm:px-0">
	{#if post}
		<h1 class="mb-0">{@html title}</h1>

		<p class="text-sm">
			{#each categories as category}
				<span class="mx-1">{category.name}</span>
			{/each}
			-
			{date}

			{#if tags.length > 0}
				|
			{/if}

			{#each tags as tag}
				<span class="mx-1">{tag.name}</span>
			{/each}
		</p>
		<!-- Profile picture -->
		<a
			href="/about"
			class="flex items-center gap-3 decoration-transparent hover:decoration-primary"
		>
			<img
				width="60"
				height="60"
				class="mask mask-hexagon my-2"
				src={ctwhomeProfile}
				alt="J. Gonzalez Ctwhome profile picture"
			/>
			<div>
				<div class="font-bold">J. Gonzalez - Ctw</div>
				<div>Product Designer & Research Software Engineer</div>
			</div>
		</a>

		{#if media}
			<img
				src={large}
				alt={title}
				bind:this={tiltCover}
				class="w-full aspect-[5/3] object-cover rounded sm:rounded-lg mb-10"
			/>
		{/if}

		{@html content}
	{/if}
</div>
{#if next_prev}
	<div
		class="grid grid-cols-2 gap-6 sm:gap-6 w-full container mx-auto mt-24 mb-10 min-h-52 p-4 items-center bg-base-200 bg-opacity-30 rounded-lg"
	>
		{#if next_prev.next}
			<div>
				<!-- <pre>{JSON.stringify(next_prev.next, null, 2)}</pre> -->
				<a
					data-sveltekit-preload-data=""
					data-sveltekit-reload
					href={`/${next_prev.next.categories[0]}/${next_prev.next.slug}`}
				>
					<div class="text-2xl">Prev</div>
					<img
						width="300"
						height=""
						class="aspect-[5/3] object-cover rounded"
						src={next_prev.next.thumbnail}
						alt=""
					/>
					<div class="font-bold mt-4 block max-w-[300px]">{next_prev.next.title}</div>
				</a>
			</div>
		{/if}

		{#if next_prev.prev}
			<div>
				<!-- <pre>{JSON.stringify(next_prev.prev, null, 2)}</pre> -->
				<a
					data-sveltekit-preload-data=""
					data-sveltekit-reload
					href={`/${next_prev.prev.categories[0]}/${next_prev.prev.slug}`}
				>
					<div class="text-2xl">Next</div>
					<img
						width="300"
						height="180"
						class="aspect-[5/3] object-cover rounded"
						src={next_prev.prev.thumbnail}
						alt=""
					/>
					<div class="font-bold mt-4 block">{next_prev.prev.title}</div>
				</a>
			</div>
		{/if}
	</div>
{/if}

<script>
	import VanillaTilt from 'vanilla-tilt';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';

	export let data;
	const { post, media, date, tags, categories, nextPost, previousPost, excerpt } = data;

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

{excerpt}
<pre>{JSON.stringify(excerpt, null, 2)}</pre>
<svelte:head>
	{#if post}
		<!-- HTML Meta Tags -->
		<title>{title}</title>
		<meta name="description" content={excerpt} />

		<!-- Facebook Meta Tags -->
		<meta property="og:url" content={$page.url.toString()} />
		<meta property="og:type" content="website" />
		<meta property="og:title" content={title} />
		<meta property="og:description" content={excerpt} />
		<meta property="og:image" content={large} />

		<!-- Twitter Meta Tags -->
		<meta name="twitter:card" content={large} />
		<meta property="twitter:domain" content="ctwhome.com" />
		<meta property="twitter:url" content={$page.url.toString()} />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={excerpt} />
		<meta name="twitter:image" content={large} />

		<!-- other meta tags -->
	{/if}
</svelte:head>

<div class="prose mx-auto mt-6 px-4 sm:px-0">
	{#if post}
		<h1>{@html title}</h1>
		<p class="text-sm">
			{date} -
			{#each categories as category}
				<span class="mx-1">{category.name}</span>
			{/each}

			{#if tags.length > 0}
				|
			{/if}

			{#each tags as tag}
				<span class="mx-1">{tag.name}</span>
			{/each}
		</p>
		<!-- each categories show catory.name -->

		{#if media}
			<img
				src={large}
				alt={title}
				bind:this={tiltCover}
				class="w-full aspect-[5/3] object-cover rounded sm:rounded-lg"
			/>
		{/if}
		{@html content}
	{/if}

	<div class="grid grid-cols-2 gap-4 w-full">
		<div class="">
			{#if previousPost}
				<a
					data-sveltekit-preload-data="hover"
					data-sveltekit-reload
					href={`/work/${previousPost.slug}`}
				>
					←
					{previousPost.title.rendered}</a
				>
			{/if}
		</div>

		{#if nextPost}
			<a data-sveltekit-preload-data="hover" data-sveltekit-reload href={`/work/${nextPost.slug}`}
				>→ {nextPost.title.rendered} {nextPost.slug}</a
			>
		{/if}
	</div>
</div>

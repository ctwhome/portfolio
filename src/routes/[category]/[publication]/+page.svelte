<script>
	import VanillaTilt from 'vanilla-tilt';
	import { onMount, onDestroy } from 'svelte';

	export let data;
	const { post, media, date, tags, categories, nextPost, previousPost } = data;

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
	{#if post}
		<title>{post.title.rendered}</title>
		<meta name="description" content={post.excerpt.rendered} />
		<meta property="og:title" content={title} />
		<meta property="og:description" content={post.excerpt.rendered} />
		<meta property="og:image" content={large} />
		<meta property="og:url" content={window.location.href} />
		<meta property="og:type" content="article" />
		<meta property="og:site_name" content={title} />
		<meta property="article:published_time" content={date} />
		<meta property="article:modified_time" content={date} />
		<meta property="article:section" content={categories[0].name} />
		<meta property="article:tag" content={tags[0].name} />
		<meta property="article:tag" content={tags[1].name} />
		<meta property="article:tag" content={tags[2].name} />
		<meta property="article:tag" content={tags[3].name} />
		<meta property="article:tag" content={tags[4].name} />
		<!-- other meta tags -->
	{/if}
</svelte:head>
<!-- <pre>{JSON.stringify(nextPost, null, 2)}</pre> -->
<div class="prose mx-auto mt-6 px-4 sm:px-0">
	{#if post}
		<h1>{@html title}</h1>
		<p class="text-sm opacity-60">
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

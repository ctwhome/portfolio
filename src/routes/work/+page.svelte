<script>
	// import { lazyLoad } from '$lib/actions/lazy-load.js';
	import { onMount } from 'svelte';
	export let data;
	const { posts, count } = data;

	onMount(() => {
		// Get all image elements on the page
		const allImages = document.querySelectorAll('img');

		// Loop through each image and prevent dragging
		allImages.forEach((img) => {
			img.addEventListener('dragstart', function (event) {
				event.preventDefault();
			});
		});
	});
</script>

<!-- <pre>{JSON.stringify(posts, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(posts[3].post, null, 2)}</pre> -->
<main class="mx-auto max-w-[900px] px-4">
	<h1 class="text-2xl sm:text-4xl font-bold">
		Latest Work ({count})
	</h1>
	{#if !data}
		<p>Loading...</p>
	{:else}
		{#each Object.keys(posts).sort().reverse() as year}
			<h2 class="text-xl font-bold mt-8 opacity-80">{year}</h2>
			<ul class="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-5 mt-10">
				{#each posts[year] as post}
					<a
						data-sveltekit-preload-data="hover"
						href={'/' + post.categories[0].slug + '/' + post.slug}
						class="flex flex-col sm:flex-row gap-4 rounded hover:bg-base-200 transition bg-base-200 sm:bg-inherit sm:p-4"
					>
						<div class="flex-none">
							{#if post.media_url}
								<img
									class="w-full sm:w-[150px] aspect-[5/3] object-cover rounded rounded-b-none sm:rounded-b-md"
									src={post.media_url}
									alt={post.post_title}
								/>
							{/if}
						</div>
						<div class="px-3 pb-3">
							<h2 class="text-ld line-clamp-3 sm:text-2xl font-bold">{post.post_title}</h2>

							<div class="prose line-clamp-3 mt-2 leading-5 sm:leading-auto text-sm">
								{@html post.excerpt}
							</div>

							<div class="flex gap-3 mt-2 opacity-40 text-sm">
								<div class="flex flex-wrap gap-3">
									{#each post.categories as categorie}
										<div>{categorie.name}</div>
									{/each}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</ul>
		{/each}
	{/if}
</main>
<!--
<style>
	img {
		opacity: 0;
		transition: opacity 0.1s ease;
	}
</style> -->

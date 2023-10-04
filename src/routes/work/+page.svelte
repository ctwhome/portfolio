<script>
	// import { lazyLoad } from '$lib/actions/lazy-load.js';
	import { onMount } from 'svelte';
	export let data;
	const { posts } = data;

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

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(posts[3].post, null, 2)}</pre> -->

<main class="mx-auto max-w-[900px] px-4">
	<h1 class="text-2xl sm:text-4xl font-bold px-2">Latest Work ({data?.posts?.length})</h1>

	{#if data?.posts?.length === 0}
		<p>Loading...</p>
	{:else if data?.posts?.length > 0}
		<ul class="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-5 mt-10">
			{#each data.posts as { post }}
				<a
					data-sveltekit-preload-data="hover"
					href={'/' + post.categories[0].name + '/' + post.slug}
					class="flex flex-col sm:flex-row gap-4 rounded hover:bg-base-200 transition bg-base-200 sm:bg-inherit sm:p-4"
				>
					<div class="flex-none">
						{#if post.media_url}
							<img
								class="w-full sm:w-[150px] aspect-[5/3] object-cover rounded rounded-b-none sm:rounded-b-md"
								src={post.media_url}
								alt={post.post_title}
							/>
							<!-- use:lazyLoad={post.media_url} -->
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
							<!-- |
							<div class="flex flex-wrap gap-3">
								{#each post.tags as tag}
									<div>{tag.name}</div>
								{/each}
							</div> -->
						</div>
						<!-- <button class="btn btn-ghost hover:btn-primary">View Post</button> -->
					</div>
				</a>
			{/each}
		</ul>
	{/if}
</main>
<!--
<style>
	img {
		opacity: 0;
		transition: opacity 0.1s ease;
	}
</style> -->

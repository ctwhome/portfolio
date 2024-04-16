<script lang="ts">
	// import { lazyLoad } from '$lib/actions/lazy-load.js';
	import { SvelteComponent, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type Glob = { default: SvelteComponent; metadata: Record<string, any> };
	// Gets the metadata of the mdfile directly
	const posts = Object.values(import.meta.glob<Glob>('$lib/content/**/*.md', { eager: true }));

	// Merge and remove duplicates and empty tags
	let tags: { name: string; count: number }[] = [];
	posts.map((post) => {
		post?.metadata?.tags.forEach((tag) => {
			const index = tags.findIndex((t) => t.name === tag);
			if (index === -1) {
				tags.push({ name: tag, count: 1 });
			} else {
				tags[index].count++;
			}
		});
	});

	let categories: { name: string; count: number }[] = [];
	posts.map((post) => {
		if (!post?.metadata?.type) return;
		const index = categories.findIndex((t) => t.name === post?.metadata?.type);
		if (index === -1) {
			categories.push({ name: post?.metadata?.type, count: 1 });
		} else {
			categories[index].count++;
		}
	});

	const filteredPosts = writable(posts); // initialize with all posts
	let hasFilters = false;

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

	function clearFilters() {
		hasFilters = false;
		filteredPosts.set(posts);
	}

	function filterByCategory(categoryName) {
		hasFilters = true;
		const filtered = posts.filter((post) => post.metadata.type === categoryName);
		filteredPosts.set(filtered);
	}

	function filterByTag(tagName) {
		hasFilters = true;
		const filtered = posts.filter((post) => post.metadata.tags.includes(tagName));
		filteredPosts.set(filtered);
	}
</script>

<main class="mx-auto max-w-[900px] px-4">
	<div class="flex justify-between">
		<h1 class="text-2xl sm:text-4xl font-bold">Latest Work ({$filteredPosts.length})</h1>
		{#if hasFilters}
			<button on:click={clearFilters} class="btn btn-sm btn-primary">Clear Filers</button>
		{/if}
	</div>

	<!-- FILTERS PANEL -->
	<div class="grid sm:grid-cols-2 mt-10 bg-base-300 bg-opacity-20 p-4 gap-4 rounded-lg">
		<div>
			<div class="text-sm mb-2">Categories</div>
			<div class="flex flex-wrap gap-2">
				{#each categories as { name, count }}
					<!-- daisyui chips -->
					<button on:click={() => filterByCategory(name)} class="btn btn-sm capitalize">
						{name}
						<div class="badge">{count}</div>
					</button>
				{/each}
			</div>
		</div>
		<div>
			<div class="text-sm mb-2">Tags</div>
			<div class="flex flex-wrap gap-2">
				{#each tags as { id, name, count }}
					<!-- daisyui chips -->
					<button on:click={() => filterByTag(name)} class="capitalize btn btn-xs">
						{name}
						<div class="badge">{count}</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
	{#each $filteredPosts as post}
		<svelte:component this={post.default} />
	{/each}
	<div>
		{#each $filteredPosts as { metadata: { title, slug, media_url, description, excerpt, date, tags, type } }}
			<div>
				<a
					data-sveltekit-preload-data="hover"
					href={'/' + type + 's/' + slug}
					class="flex flex-col sm:flex-row gap-4 rounded hover:bg-base-200 transition bg-base-200 sm:bg-inherit sm:p-4"
				>
					<div class="flex-none">
						<!-- {#if media_url} -->
						<img
							class="w-full sm:w-[150px] aspect-[5/3] object-cover rounded rounded-b-none sm:rounded-b-md"
							src={media_url ||
								`https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`}
							alt={title}
						/>
						<!-- {/if} -->
					</div>
					<div class="px-3 pb-3">
						<h2 class="text-ld line-clamp-3 sm:text-2xl font-bold">{@html title}</h2>

						<div class="prose line-clamp-3 mt-2 leading-5 sm:leading-auto text-sm">
							{@html excerpt}
						</div>

						<div class="flex gap-3 mt-2 opacity-40 text-sm">
							<div class="flex flex-wrap gap-3">
								<!-- {#each categories as categorie} -->
								<div class="capitalize">{type}</div>
								<!-- {/each} -->
							</div>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</main>

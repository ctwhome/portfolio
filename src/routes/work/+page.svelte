<script lang="ts">
	import { page } from '$app/stores';
	import { content, posts } from '$content/content';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	// import { lazyLoad } from '$lib/actions/lazy-load.js';

	const filteredPosts = writable(posts); // initialize with all projects

	let hasFilters = false;

	//
	// Merge and remove duplicates and empty tags
	//
	let globalTags: { name: string; count: number }[] = [];
	let globalCategories: { name: string; count: number }[] = [];

	function updateCounters() {
		globalTags = [];
		globalCategories = [];

		$filteredPosts.map((post) => {
			post.metadata?.tags?.forEach((tag) => {
				let index = globalTags.findIndex((t) => t.name === tag);
				index === -1 ? globalTags.push({ name: tag, count: 1 }) : globalTags[index].count++;
			});

			post.metadata?.categories?.forEach((category) => {
				let index = globalCategories.findIndex((t) => t.name === category);
				index === -1
					? globalCategories.push({ name: category, count: 1 })
					: globalCategories[index].count++;
			});
		});
	}

	// if any searchParmas change, update the filters
	$: if (!$page.url.searchParams.get('category')) {
		setFilters();
	}
	$: if ($page.url.searchParams.get('category')) {
		setFilters();
	}
	onMount(() => {
		setFilters();
		// Get all image elements on the page
		const allImages = document.querySelectorAll('img');
		// Loop through each image and prevent dragging
		allImages.forEach((img) => {
			img.addEventListener('dragstart', function (event) {
				event.preventDefault();
			});
		});
	});

	function setFilters() {
		$filteredPosts = posts;

		hasFilters = false;
		if ($page.url.searchParams.get('category')) {
			filterByCategory($page.url.searchParams.get('category'));
		} else if ($page.url.searchParams.get('tag')) {
			filterByTag($page.url.searchParams.get('tag'));
		}
		updateCounters();
	}

	// TODO: Fix this
	function clearFilters() {
		goto('/work');
		hasFilters = false;
		filteredPosts.set(posts);
	}
	function filterByCategory(categoryName) {
		hasFilters = true;
		// set url params to category
		goto(`?category=${encodeURIComponent(categoryName)}`);
		const filtered = posts.filter(({ metadata }) => metadata?.categories?.includes(categoryName));
		filteredPosts.set(filtered);
	}

	function filterByTag(tagName) {
		hasFilters = true;
		// set url params to tag
		goto(`?tag=${encodeURIComponent(tagName)}`);
		const filtered = posts.filter(({ metadata }) => metadata?.tags?.includes(tagName));
		filteredPosts.set(filtered);
	}
</script>

<main class="mx-auto max-w-[900px] px-4">
	<div class="flex justify-between">
		<h1 class="text-2xl sm:text-4xl font-bold">
			{#if $page.url.searchParams.get('category') === 'Blog'}
				Blog Posts
			{:else if $page.url.searchParams.get('category')}
				Work Projects
			{:else if $page.url.searchParams.get('tag')}
				{$page.url.searchParams.get('tag')}
			{:else}
				All Work
			{/if}
			({$filteredPosts.length})
		</h1>
		{#if hasFilters}
			<button on:click={clearFilters} class="btn btn-sm btn-primary"
				>Clear Filers ({$filteredPosts.length})</button
			>
		{/if}
	</div>

	<!-- FILTERS PANEL -->
	<div class="grid sm:grid-cols-2 mt-10 bg-base-300 bg-opacity-20 p-4 gap-4 rounded-lg">
		<div>
			<div class="text-sm mb-2">Categories</div>
			<div class="flex flex-wrap gap-2">
				{#each globalCategories as { name, count }}
					<!-- daisyui chips -->
					<button
						on:click={() => filterByCategory(name)}
						class="btn btn-xs"
						class:btn-primary={$page.url.searchParams.get('category') === name}
					>
						{name}
						<div class="badge">{count}</div>
					</button>
				{/each}
			</div>
		</div>
		<div>
			<div class="text-sm mb-2">Tags</div>
			<div class="flex flex-wrap gap-2">
				{#each globalTags as { name, count }}
					<!-- daisyui chips -->
					<button
						on:click={() => filterByTag(name)}
						class="btn btn-xs"
						class:btn-primary={$page.url.searchParams.get('tag') === name}
					>
						{name}
						<div class="badge">{count}</div>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="mt-10">
		<!-- {#each posts as [path, { metadata: { title, description, cover, categories, type, tags } }]} -->
		{#each $filteredPosts as post}
			<div>
				<a
					data-sveltekit-preload-data="hover"
					href={'/work/' + post.slug + '?category=' + post.metadata.categories[0]}
					class="flex flex-col sm:flex-row gap-4 rounded hover:bg-base-200 transition bg-base-200 sm:bg-inherit sm:p-4"
				>
					<div class="flex-none">
						{#if post.metadata.coverImage}
							<img
								class="w-20 h-20 object-cover rounded"
								src={post.metadata.coverImage &&
									`/content/${post.slug}/${post.metadata.coverImage}`}
								alt={post.slug}
							/>
						{:else}
							<div class="w-20 h-20 bg-base-200"></div>
						{/if}
					</div>
					<div class="px-3 pb-3">
						<h2 class="text-ld line-clamp-3 sm:text-2xl font-bold">
							{@html post.metadata.title}
						</h2>

						{#if post.metadata.description}
							<div class="prose line-clamp-3 mt-2 leading-5 sm:leading-auto text-sm">
								{@html post.metadata.description}
							</div>
						{/if}

						<div class="flex gap-3 mt-2 opacity-40 text-sm">
							<div class="flex flex-wrap gap-3">
								{#if post.metadata.categories}
									{#each post.metadata.categories as category}
										<div class="">{category}</div>
									{/each}
								{/if}
								{#if post.metadata.tags}
									{#each post.metadata.tags as tag}
										<div class="">{tag}</div>
									{/each}
								{/if}
							</div>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</main>

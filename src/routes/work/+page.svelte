<script lang="ts">
	import { page } from '$app/stores';
	import { posts } from '$content/content';
	import { onMount } from 'svelte';
	import { derived, get, writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const filteredPosts = writable(posts); // Store for displaying posts, changes based on filters
	// let activeCategory: '' | null = null;
	// let activeTag: '' | null = null;
	const activeCategory = writable('' || null);
	const activeTag = writable('' || null);

	// Derived store to group posts by year based on filtered posts
	const postsByYear = derived(filteredPosts, ($filteredPosts) => {
		return $filteredPosts.reduce((acc, post) => {
			const year = new Date(post.metadata.date).getFullYear();
			if (!acc[year]) acc[year] = [];
			acc[year].push(post);
			return acc;
		}, {});
	});

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
	// Reactive statement that runs only in the browser
	$: {
		if (browser) {
			$activeCategory = $page.url.searchParams.get('category');
			$activeTag = $page.url.searchParams.get('tag');
			setFilters();
		}
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
		hasFilters = false;

		if ($activeCategory) {
			filterByCategory($activeCategory);
		} else if ($activeTag) {
			filterByTag($activeTag);
		} else {
			filteredPosts.set(posts);
		}
		updateCounters();
	}

	// TODO: Fix this
	function clearFilters() {
		goto('/work');
		hasFilters = false;
		filteredPosts.set(posts);
		$activeCategory = '';
		$activeTag = '';
	}
	function filterByCategory(categoryName) {
		if (hasFilters && $activeCategory === categoryName) {
			clearFilters();
			return;
		}
		hasFilters = true;
		// set active category
		$activeCategory = categoryName;
		// set url params to category
		goto(`?category=${encodeURIComponent(categoryName)}`);
		const filtered = posts.filter(({ metadata }) => metadata?.categories?.includes(categoryName));
		filteredPosts.set(filtered);
	}

	function filterByTag(tagName) {
		if (hasFilters && $activeTag === tagName) {
			clearFilters();
			return;
		}
		$activeTag = tagName;
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
			{#if $activeCategory === 'Blog'}
				Blog Posts
			{:else if $activeCategory}
				Work Projects
			{:else if $activeTag}
				{$activeTag}
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
		<!-- <div class="text-sm mb-2">Categories</div> -->
		<div class="flex flex-wrap gap-2 items-center">
			{#each globalCategories as { name, count }}
				<!-- daisyui chips -->
				<button
					on:click={() => filterByCategory(name)}
					class="btn btn-xs"
					class:btn-primary={$activeCategory === name}
				>
					{name}
					<div class="badge">{count}</div>
				</button>
			{/each}
		</div>

		<div>
			<!-- <div class="text-sm mb-2">Tags</div> -->
			{#if globalTags.length > 0}
				<div class="flex flex-wrap gap-2">
					<div class="dropdown">
						<div tabindex="0" role="button" class="btn btn-xs m-1" class:btn-primary={!!$activeTag}>
							{$activeTag || 'Tags'}
							<div class="badge">
								{globalTags[globalTags.findIndex((t) => t.name === $activeTag)]?.count ||
									globalTags.length}
							</div>
						</div>
						<ul
							tabindex="0"
							class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							{#each globalTags as { name, count }}
								<li>
									<a on:click={() => filterByTag(name)} class:active={$activeTag === name}
										>{name}
										<div class="badge">{count}</div></a
									>
								</li>
							{/each}
						</ul>
					</div>
					<!-- {#each globalTags as { name, count }}
						daisyui chips
						<button
							on:click={() => filterByTag(name)}
							class="btn btn-xs"
							class:btn-primary={$activeTag === name}
						>
							{name}
							<div class="badge">{count}</div>
						</button>
					{/each} -->
				</div>
			{/if}
		</div>
	</div>

	{#each Object.keys($postsByYear).reverse() as year}
		<h2 class="text-xl font-bold mt-8 opacity-60">
			{year}
		</h2>
		<div class="grid grid-cols-2 sm:grid-cols-1 gap-7 mt-10">
			{#each $postsByYear[year] as post}
				<a
					data-sveltekit-preload-data="hover"
					href={'/work/' + post.slug + '?category=' + post.metadata.categories[0]}
					class="flex flex-col sm:flex-row gap-4 rounded hover:bg-base-200 transition bg-base-200 bg-opacity-50 sm:bg-inherit sm:p-4"
				>
					<div class="flex-none">
						{#if post.metadata.coverImage}
							<img
								class="w-full sm:w-[150px] aspect-[5/3] object-cover rounded rounded-b-none sm:rounded-b-md"
								src={post.metadata.coverImage &&
									`/content/${post.slug}/${post.metadata.coverImage}`}
								alt={post.slug}
							/>
						{/if}
					</div>
					<div class="px-3 pb-3">
						<h2 class="text-ld line-clamp-3 sm:text-2xl font-bold">{@html post.metadata.title}</h2>

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
			{/each}
		</div>
	{/each}
</main>

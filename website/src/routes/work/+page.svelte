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
	// Track displayed years
	let displayedYears = new Set();

	function shouldDisplayYear(year: number) {
		if (!displayedYears.has(year)) {
			displayedYears.add(year);
			return true;
		}
		return false;
	}

	const postsByYear = derived(filteredPosts, ($filteredPosts) => {
		// Reset displayed years when posts are filtered
		displayedYears = new Set();
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
		<h1 class="text-2xl font-bold sm:text-4xl">
			{#if $activeCategory === 'Blog'}
				Engineering Blog
			{:else if $activeCategory === 'Project'}
				Work Projects
			{:else if $activeCategory === 'Digital Garden'}
				🌱 Digital Garden
			{:else if $activeTag}
				{$activeTag}
			{:else}
				All Work
			{/if}
			<sup class="-top-[1.1rem] text-sm opacity-80">({$filteredPosts.length})</sup>
		</h1>
		{#if hasFilters}
			<button on:click={clearFilters} class="btn btn-sm btn-primary">
				Clear Filers ({$filteredPosts.length})
			</button>
		{/if}
	</div>

	<!-- FILTERS PANEL -->
	<div class="bg-base-300 mt-10 grid gap-4 rounded-lg bg-opacity-20 p-4 sm:grid-cols-2">
		<!-- <div class="text-sm mb-2">Categories</div> -->
		<div class="flex flex-wrap items-center gap-2">
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
							class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
						>
							{#each globalTags as { name, count }}
								<li>
									<a on:click={() => filterByTag(name)} class:active={$activeTag === name}>
										{name}
										<div class="badge">{count}</div>
									</a>
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

	<div class="grid grid-cols-2 gap-7 sm:grid-cols-3">
		{#each Object.keys($postsByYear).reverse() as year}
			{#each $postsByYear[year] as post}
				<div class="grid grid-rows-[3.5rem_1fr]">
					<h2 class="mb-10 mt-8 text-xl font-bold opacity-60">
						{#if shouldDisplayYear(parseInt(year))}
							{year}
						{/if}
					</h2>
					<a
						data-sveltekit-preload-data="hover"
						href={'/work/' + post.slug + '?category=' + post.metadata.categories[0]}
						class="hover:bg-base-200 bg-base-200 my-4 flex flex-col gap-4 rounded-lg bg-opacity-50 transition hover:bg-opacity-70"
					>
						<div class="flex-none">
							{#if post.metadata.coverImage}
								<img
									draggable="false"
									class="aspect-[5/3] rounded-lg rounded-b-none object-cover"
									src={post.metadata.coverImage &&
										`/content/${post.slug}/${post.metadata.coverImage}`}
									alt={post.slug}
								/>
							{/if}
						</div>
						<div class="px-3 pb-3">
							<h2 class="text-ld line-clamp-3 font-bold sm:text-2xl">
								{@html post.metadata.title}
							</h2>
							{#if post.metadata.description}
								<div class="prose sm:leading-auto mt-2 line-clamp-3 text-sm leading-5">
									{@html post.metadata.description}
								</div>
							{/if}

							<div class="mt-2 flex gap-3 text-sm opacity-40">
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
		{/each}
	</div>
</main>

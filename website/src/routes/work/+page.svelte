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
	const activeCategories = writable<string[]>([]);
	const activeTags = writable<string[]>([]);

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

	interface PostsByYear {
		[key: string]: typeof posts;
	}

	const postsByYear = derived(filteredPosts, ($filteredPosts) => {
		// Reset displayed years when posts are filtered
		displayedYears = new Set();
		return $filteredPosts.reduce<PostsByYear>((acc, post) => {
			const year = new Date(post.metadata.date).getFullYear().toString();
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

	// Initialize all available categories and tags with their total counts
	const initializeFilters = () => {
		const categoryCountMap = new Map<string, number>();
		const tagCountMap = new Map<string, number>();

		posts.forEach((post) => {
			// Count categories
			post.metadata?.categories?.forEach((category: string) => {
				categoryCountMap.set(category, (categoryCountMap.get(category) || 0) + 1);
			});
			// Count tags
			post.metadata?.tags?.forEach((tag: string) => {
				tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
			});
		});

		globalCategories = Array.from(categoryCountMap.entries()).map(([name, count]) => ({
			name,
			count
		}));
		globalTags = Array.from(tagCountMap.entries()).map(([name, count]) => ({
			name,
			count
		}));
	};

	// No need for updateCounters anymore since we're keeping static counts

	// Reactive statement that runs only in the browser
	$: {
		if (browser) {
			const categoryParam = $page.url.searchParams.get('category');
			const tagParam = $page.url.searchParams.get('tag');

			$activeCategories = categoryParam ? categoryParam.split(',') : [];
			$activeTags = tagParam ? tagParam.split(',') : [];
			setFilters();
		}
	}

	onMount(() => {
		initializeFilters();
		setFilters();
	});

	function setFilters() {
		hasFilters = false;

		if ($activeCategories.length > 0 || $activeTags.length > 0) {
			applyFilters();
		} else {
			filteredPosts.set(posts);
		}
	}

	// TODO: Fix this
	function clearFilters() {
		goto('/work', { replaceState: true });
		hasFilters = false;
		filteredPosts.set(posts);
		$activeCategories = [];
		$activeTags = [];
	}

	function toggleCategory(categoryName: string): void {
		const index = $activeCategories.indexOf(categoryName);
		if (index === -1) {
			$activeCategories = [...$activeCategories, categoryName];
		} else {
			$activeCategories = $activeCategories.filter((c) => c !== categoryName);
		}
		applyFilters();
	}

	function toggleTag(tagName: string): void {
		const index = $activeTags.indexOf(tagName);
		if (index === -1) {
			$activeTags = [...$activeTags, tagName];
		} else {
			$activeTags = $activeTags.filter((t) => t !== tagName);
		}
		applyFilters();
	}

	function applyFilters() {
		hasFilters = $activeCategories.length > 0 || $activeTags.length > 0;

		if (!hasFilters) {
			filteredPosts.set(posts);
			goto('/work', { replaceState: true });
			return;
		}

		let filtered = posts;

		if ($activeCategories.length > 0) {
			filtered = filtered.filter(({ metadata }) =>
				metadata?.categories?.some((category: string) => $activeCategories.includes(category))
			);
		}

		if ($activeTags.length > 0) {
			filtered = filtered.filter(({ metadata }) =>
				metadata?.tags?.some((tag: string) => $activeTags.includes(tag))
			);
		}

		filteredPosts.set(filtered);

		const params = new URLSearchParams();
		if ($activeCategories.length > 0) {
			params.set('category', $activeCategories.join(','));
		}
		if ($activeTags.length > 0) {
			params.set('tag', $activeTags.join(','));
		}
		goto(`?${params.toString()}`, { replaceState: true });
	}
</script>

<main class="container mx-auto px-4">
	<div class="flex justify-between">
		<h1 class="text-2xl font-bold sm:text-4xl">
			{#if $activeCategories.includes('Blog') || $activeTags.includes('Blog')}
				Engineering Blog
			{:else if $activeCategories.includes('Project')}
				Work Projects
			{:else if $activeCategories.includes('Digital Garden')}
				🌱 Digital Garden
			{:else if $activeTags.length > 0}
				{$activeTags.filter((tag) => tag !== 'Blog').join(', ')}
			{:else}
				All Work
			{/if}
			<sup class="-top-[1.1rem] text-sm opacity-80">({$filteredPosts.length})</sup>
		</h1>
		{#if hasFilters}
			<button on:click={clearFilters} class="btn btn-primary btn-sm">
				Clear Filers ({$filteredPosts.length})
			</button>
		{/if}
	</div>

	<!-- FILTERS PANEL -->
	<div class="mt-10 grid gap-4 rounded-lg bg-base-300 bg-opacity-20 p-4 sm:grid-cols-2">
		<div class="flex flex-wrap items-center gap-2">
			{#each globalCategories as { name, count }}
				<button
					on:click={() => toggleCategory(name)}
					class="btn btn-xs"
					class:btn-primary={$activeCategories.includes(name)}
				>
					{name === 'Blog' ? 'Engineering Blog' : name}
					<div class="badge">{count}</div>
				</button>
			{/each}
		</div>

		<div class="dropdown">
			<div
				tabindex="0"
				role="button"
				class="btn btn-xs m-1"
				class:btn-primary={$activeTags.length > 0}
			>
				{$activeTags.length ? `${$activeTags.length} selected` : 'Tags'}
				<div class="badge">{globalTags.length}</div>
			</div>
			<ul tabindex="0" class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
				{#each globalTags as { name, count }}
					<li>
						<button
							class="flex justify-between hover:bg-base-200"
							class:bg-primary={$activeTags.includes(name)}
							class:text-primary-content={$activeTags.includes(name)}
							on:click={() => toggleTag(name)}
						>
							{name}
							<div class="badge">{count}</div>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-7 md:grid-cols-3 lg:grid-cols-4">
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
						href={'/work/' + post.slug}
						class="my-4 flex flex-col gap-4 rounded-lg bg-base-200 bg-opacity-50 transition hover:bg-base-200 hover:bg-opacity-70"
					>
						<div class="flex-none">
							{#if post.metadata.coverImage}
								<img
									draggable="false"
									class="aspect-[5/3] rounded-lg rounded-b-none object-cover"
									src={post.metadata.coverImage}
									alt={post.slug}
								/>
							{/if}
						</div>
						<div class="px-3 pb-3">
							<h2 class="text-ld line-clamp-3 font-bold sm:text-2xl">
								{@html post.metadata.title}
							</h2>
							{#if post.metadata.description}
								<div class="sm:leading-auto prose mt-2 line-clamp-3 text-sm leading-5">
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

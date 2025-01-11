<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { workStore } from './stores/workStore';
	import FiltersPanel from './components/FiltersPanel.svelte';
	import PostsGrid from './components/PostsGrid.svelte';

	export let data;

	// Initialize store with prerendered posts
	workStore.setPosts(data.posts);

	const activeCategories = workStore.activeCategories;
	const activeTags = workStore.activeTags;
	const filteredPosts = workStore.filteredPosts;
	const hasFilters = workStore.hasFilters;

	// Update filters when URL changes
	$: {
		const categoryParam = $page.url.searchParams.get('category');
		const tagParam = $page.url.searchParams.get('tag');
		workStore.setFilters(categoryParam?.split(',') || [], tagParam?.split(',') || []);
	}

	// Update URL when filters change (client-side only)
	$: if (browser) {
		const searchParams = workStore.getSearchParams($activeCategories, $activeTags);
		const currentUrl = $page.url.pathname + $page.url.search;
		const newUrl = `/work${searchParams}`;

		if (currentUrl !== newUrl) {
			goto(newUrl, { replaceState: true });
		}
	}

	function clearFilters() {
		workStore.clearFilters();
		if (browser) {
			goto('/work', { replaceState: true });
		}
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
		{#if $hasFilters}
			<button on:click={clearFilters} class="btn btn-primary btn-sm">
				Clear Filters ({$filteredPosts.length})
			</button>
		{/if}
	</div>

	<FiltersPanel />
	<PostsGrid />
</main>

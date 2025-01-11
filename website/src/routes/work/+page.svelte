<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { workStore } from './stores/workStore';
	import FiltersPanel from './components/FiltersPanel.svelte';
	import PostsGrid from './components/PostsGrid.svelte';

	const activeCategories = workStore.activeCategories;
	const activeTags = workStore.activeTags;
	const filteredPosts = workStore.filteredPosts;
	const hasFilters = workStore.hasFilters;

	// Handle URL parameters
	$: if (browser) {
		const categoryParam = $page.url.searchParams.get('category');
		const tagParam = $page.url.searchParams.get('tag');
		workStore.setFiltersFromParams(categoryParam, tagParam);
	}

	function clearFilters() {
		workStore.clearFilters();
		goto('/work', { replaceState: true });
	}

	// Update URL when filters change
	$: if (browser && ($activeCategories.length > 0 || $activeTags.length > 0)) {
		const params = workStore.getUrlParams();
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
		{#if $hasFilters}
			<button on:click={clearFilters} class="btn btn-primary btn-sm">
				Clear Filters ({$filteredPosts.length})
			</button>
		{/if}
	</div>

	<FiltersPanel />
	<PostsGrid />
</main>

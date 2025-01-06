<script>
	// import { lazyLoad } from '$lib/actions/lazy-load.js';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let data;
	const { posts, count, tags, categories } = data;
	const filteredPosts = writable({ ...posts }); // initialize with all posts
	let hasFilters = false;

	let filteredCategories = categories;
	let filteredTags = tags;

	function updateFilteredCategoriesAndTags(filteredPosts) {
		const allCategories = new Set();
		const allTags = new Set();

		for (let year in filteredPosts) {
			for (let post of filteredPosts[year]) {
				post.categories.forEach((category) => allCategories.add(category.id));
				if (post.tags) {
					post.tags.forEach((tag) => allTags.add(tag.id));
				}
			}
		}

		filteredCategories = categories.filter((category) => allCategories.has(category.id));
		filteredTags = tags.filter((tag) => allTags.has(tag.id));
	}
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
		filteredPosts.set({ ...posts }); // reset posts filter
		filteredCategories = categories; // reset category filter
		filteredTags = tags; // reset tags filter
		hasFilters = false; // update the hasFilters flag
	}

	function filterByCategory(categoryId) {
		// reset the store to the original posts
		clearFilters();
		hasFilters = true;
		const newFilteredPosts = {};
		for (let year in $filteredPosts) {
			newFilteredPosts[year] = $filteredPosts[year].filter((post) =>
				post.categories.some((category) => category.id === categoryId)
			);
		}
		filteredPosts.set(newFilteredPosts); // update the store
		updateFilteredCategoriesAndTags(newFilteredPosts);
	}

	function filterByTag(tagId) {
		// reset the store to the original posts
		clearFilters();
		hasFilters = true;
		const newFilteredPosts = {};
		for (let year in $filteredPosts) {
			newFilteredPosts[year] = $filteredPosts[year].filter(
				(post) => post.tags && post.tags.some((tag) => tag.id === tagId)
			);
		}
		filteredPosts.set(newFilteredPosts); // update the store
		updateFilteredCategoriesAndTags(newFilteredPosts);
	}
</script>

<main class="mx-auto max-w-[900px] px-4">
	<div class="flex justify-between">
		<h1 class="text-2xl font-bold sm:text-4xl">
			Latest Work ({count})
		</h1>
		{#if hasFilters}
			<button on:click={clearFilters} class="btn btn-sm btn-primary">Clear Filers</button>
		{/if}
	</div>

	{#if !data}
		<p>Loading...</p>
	{:else}
		<div class="bg-base-300 mt-10 grid gap-4 rounded-lg bg-opacity-20 p-4 sm:grid-cols-2">
			<div>
				<div class="mb-2 text-sm">Categories</div>
				<div class="flex flex-wrap gap-2">
					{#each filteredCategories as category}
						<!-- daisyui chips -->
						<button on:click={() => filterByCategory(category.id)} class="btn btn-sm">
							{category.name}
							<div class="badge">{category.count}</div>
						</button>
					{/each}
				</div>
			</div>
			<div>
				<div class="mb-2 text-sm">Tags</div>
				<div class="flex flex-wrap gap-2">
					{#each filteredTags as tag}
						<!-- daisyui chips -->
						<button on:click={() => filterByTag(tag.id)} class="btn btn-xs">
							{tag.name}
							<div class="badge">{tag.count}</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
		{#each Object.keys($filteredPosts).sort().reverse() as year}
			{#if $filteredPosts[year].length > 0}
				<!-- Check if there are posts for this year -->
				<h2 class="mt-8 text-xl font-bold opacity-80">{year}</h2>
				<ul class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-1 sm:gap-5">
					{#each $filteredPosts[year] as post}
						<a
							data-sveltekit-preload-data="hover"
							href={'/toolkits/wordpress/' + post.categories[0].slug + '/' + post.slug}
							class="hover:bg-base-200 bg-base-200 flex flex-col gap-4 rounded transition sm:flex-row sm:bg-inherit sm:p-4"
						>
							<div class="flex-none">
								{#if post.media_url}
									<img
										class="aspect-[5/3] w-full rounded rounded-b-none object-cover sm:w-[150px] sm:rounded-b-md"
										src={post.media_url}
										alt={post.post_title}
									/>
								{/if}
							</div>
							<div class="px-3 pb-3">
								<h2 class="text-ld line-clamp-3 font-bold sm:text-2xl">{@html post.post_title}</h2>

								<div class="prose sm:leading-auto mt-2 line-clamp-3 text-sm leading-5">
									{@html post.excerpt}
								</div>

								<div class="mt-2 flex gap-3 text-sm opacity-40">
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
			{/if}
		{/each}
	{/if}
</main>

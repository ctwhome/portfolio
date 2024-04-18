<script lang="ts">
	// import { lazyLoad } from '$lib/actions/lazy-load.js';
	import { SvelteComponent, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type Glob = { default: SvelteComponent; metadata: Record<string, any> };

	// Gets the metadata of the mdfile directly
	const projects = Object.entries(import.meta.glob<Glob>('./**/*.md', { eager: true })).filter(
		([path, { metadata }]) => metadata.published
	);
	const filteredPosts = writable(projects); // initialize with all projects

	let hasFilters = false;

	// Get project images
	const imagesArray = Object.values(
		import.meta.glob('/src/routes/work/**/*.{webp,jpg,png,avif,gif}', {
			eager: true
		})
	).map((mod) => mod.default);

	// Merge and remove duplicates and empty tags
	let globalTags: { name: string; count: number }[] = [];
	projects.map((project) => {
		project[1].metadata?.tags.forEach((tag) => {
			const index = globalTags.findIndex((t) => t.name === tag);
			if (index === -1) {
				globalTags.push({ name: tag, count: 1 });
			} else {
				globalTags[index].count++;
			}
		});
	});

	let globalCategories: { name: string; count: number }[] = [];
	projects.map((project) => {
		project[1].metadata?.categories.forEach((category) => {
			const index = globalCategories.findIndex((t) => t.name === category);
			if (index === -1) {
				globalCategories.push({ name: category, count: 1 });
			} else {
				globalCategories[index].count++;
			}
		});
	});

	function getImageIndex(cover: string) {
		return imagesArray.findIndex((url) =>
			new RegExp(`${cover?.split('.')[0]}(\\.[^.]+)?\\.${cover?.split('.')[1]}$`).test(url)
		);
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
		hasFilters = false;
		filteredPosts.set(projects);
	}
	function filterByCategory(categoryName) {
		hasFilters = true;
		const filtered = projects.filter(([path, { metadata }]) =>
			metadata.categories.includes(categoryName)
		);
		filteredPosts.set(filtered);
	}

	function filterByTag(tagName) {
		hasFilters = true;
		const filtered = projects.filter(([path, { metadata }]) => metadata.tags.includes(tagName));
		filteredPosts.set(filtered);
	}
</script>

<main class="mx-auto max-w-[900px] px-4">
	<div class="flex justify-between">
		<h1 class="text-2xl sm:text-4xl font-bold">Blog Posts ({$filteredPosts.length})</h1>
		{#if hasFilters}
			<button on:click={clearFilters} class="btn btn-sm btn-primary">Clear Filers</button>
		{/if}
	</div>

	<!-- FILTERS PANEL -->
	<div class="grid sm:grid-cols-2 mt-10 bg-base-300 bg-opacity-20 p-4 gap-4 rounded-lg">
		<div>
			<div class="text-sm mb-2">Categories</div>
			<div class="flex flex-wrap gap-2">
				{#each globalCategories as { name, count }}
					<!-- daisyui chips -->
					<button on:click={() => filterByCategory(name)} class="btn btn-xs capitalize">
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
					<button on:click={() => filterByTag(name)} class="capitalize btn btn-xs">
						{name}
						<div class="badge">{count}</div>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="mt-10">
		{#each $filteredPosts as [path, { metadata: { title, description, cover, categories, type, tags } }]}
			<div>
				<a
					data-sveltekit-preload-data="hover"
					href={'/work/' + path.split('/')[1]}
					class="flex flex-col sm:flex-row gap-4 rounded hover:bg-base-200 transition bg-base-200 sm:bg-inherit sm:p-4"
				>
					<div class="flex-none">
						<img
							class="w-full sm:w-[150px] aspect-[5/3] object-cover rounded rounded-b-none sm:rounded-b-md"
							src={imagesArray[getImageIndex(cover)] || `https://source.unsplash.com/random/150`}
							alt={title}
						/>
					</div>
					<div class="px-3 pb-3">
						<h2 class="text-ld line-clamp-3 sm:text-2xl font-bold">
							{@html title}
						</h2>

						<div class="prose line-clamp-3 mt-2 leading-5 sm:leading-auto text-sm">
							{@html description}
						</div>

						<div class="flex gap-3 mt-2 opacity-40 text-sm">
							<div class="flex flex-wrap gap-3">
								{#each categories as category}
									<div class="capitalize">{category}</div>
								{/each}
								{#each tags as tag}
									<div class="capitalize">{tag}</div>
								{/each}
							</div>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</main>

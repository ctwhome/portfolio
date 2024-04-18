<script lang="ts">
	// import { lazyLoad } from '$lib/actions/lazy-load.js';
	import { SvelteComponent, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type Glob = { default: SvelteComponent; metadata: Record<string, any> };

	// Gets the metadata of the mdfile directly
	const posts = Object.entries(import.meta.glob<Glob>('./**/*.md', { eager: true })).filter(
		([path, { metadata }]) => metadata?.published
	);
	const filteredPosts = writable(posts); // initialize with all posts

	let hasFilters = false;

	// Get post images
	const imagesArray = Object.values(
		import.meta.glob('/src/routes/posts/**/*.{webp,jpg,png,avif,gif}', {
			eager: true
		})
	).map((mod) => mod.default);

	// Merge and remove duplicates and empty tags
	let globalTags: { name: string; count: number }[] = [];
	posts.map((post) => {
		post[1].metadata?.tags.forEach((tag) => {
			const index = globalTags.findIndex((t) => t.name === tag);
			if (index === -1) {
				globalTags.push({ name: tag, count: 1 });
			} else {
				globalTags[index].count++;
			}
		});
	});

	function getImageIndex(coverImage: string) {
		return imagesArray.findIndex((url) =>
			new RegExp(`${coverImage?.split('.')[1]}(\\.[^.]+)?\\.${coverImage?.split('.')[2]}$`).test(url)
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
		filteredPosts.set(posts);
	}

	function filterByTag(tagName) {
		hasFilters = true;
		const filtered = posts.filter(([path, { metadata }]) => metadata.tags.includes(tagName));
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
		<!-- <div>
			<div class="text-sm mb-2">Categories</div>
			<div class="flex flex-wrap gap-2">
				{#each categories as { name, count }}
					daisyui chips
					<button on:click={() => filterByCategory(name)} class="btn btn-sm capitalize">
						{name}
						<div class="badge">{count}</div>
					</button>
				{/each}
			</div>
		</div> -->
		<div>
			<div class="text-sm mb-2">Tags</div>
			<div class="flex flex-wrap gap-2">
				{#each globalTags as { name, count }}
					<!-- daisyui chips -->
					<button on:click={() => filterByTag(name)} class="btn btn-xs">
						{name}
						<div class="badge">{count}</div>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="mt-10">
		{#each $filteredPosts as [path, { metadata: { title, description, coverImage, type, tags } }]}
			<div>
				<a
					data-sveltekit-preload-data="hover"
					href={'/posts/' + path.split('/')[1]}
					class="flex flex-col sm:flex-row gap-4 rounded hover:bg-base-200 transition bg-base-200 sm:bg-inherit sm:p-4"
				>
					<div class="flex-none">
						<img
							class="w-full sm:w-[150px] aspect-[5/3] object-cover rounded rounded-b-none sm:rounded-b-md"
							src={imagesArray[getImageIndex(coverImage)] ||
								`https://source.unsplash.com/random/150`}
							alt={title}
						/>
					</div>
					<div class="px-3 pb-3">
						<h2 class="text-ld line-clamp-3 sm:text-2xl font-bold">
							{@html title}
						</h2>

						{#if description}
							<div class="prose line-clamp-3 mt-2 leading-5 sm:leading-auto text-sm">
								{@html description}
							</div>
						{/if}

						<div class="flex gap-3 mt-2 opacity-40 text-sm">
							<div class="flex flex-wrap gap-3">
								{#each tags as tag}
									<div class="">{tag}</div>
								{/each}
							</div>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</main>

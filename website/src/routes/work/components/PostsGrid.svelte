<script lang="ts">
	import { workStore } from '../stores/workStore';
	import type { Post } from '$content/content';

	const filteredPosts = workStore.filteredPosts;
	let displayedYears = new Set<number>();

	interface PostsByYear {
		[key: string]: Post[];
	}

	function shouldDisplayYear(year: number) {
		if (!displayedYears.has(year)) {
			displayedYears.add(year);
			return true;
		}
		return false;
	}

	$: if ($filteredPosts) {
		displayedYears = new Set();
	}

	$: postsByYear = $filteredPosts.reduce<PostsByYear>((acc, post) => {
		const year = new Date(post.metadata.date).getFullYear().toString();
		if (!acc[year]) acc[year] = [];
		acc[year].push(post);
		return acc;
	}, {});
</script>

<div class="grid grid-cols-2 gap-7 md:grid-cols-3 lg:grid-cols-4">
	{#each Object.keys(postsByYear).reverse() as year}
		{#each postsByYear[year] as post}
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
					<div class="aspect-[5/3] flex-none overflow-hidden rounded-lg rounded-b-none bg-base-200">
						{#if post.metadata.coverImage}
							<img
								loading="lazy"
								draggable="false"
								class="h-full w-full object-cover"
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

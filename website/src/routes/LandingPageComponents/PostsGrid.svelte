<script lang="ts">
	import type { Post } from '$content/content';
	import { animateOnScroll } from '$lib/actions/animate-on-scroll';
	export let posts: Post[];
	export let shouldDisplayYear: (year: number) => boolean;
</script>

<div
	class="grid grid-cols-2 gap-x-4 gap-y-2 px-4 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-12"
>
	{#each posts as post, i}
		{@const currentYear = new Date(post.metadata?.date || new Date()).getUTCFullYear()}
		<div class="grid grid-rows-[3.5rem_1fr] will-change-transform" use:animateOnScroll>
			<h2 class="mt-8 text-xl font-bold opacity-60">
				{#if shouldDisplayYear(currentYear)}
					{currentYear}
				{/if}
			</h2>
			<a
				data-sveltekit-preload-data="hover"
				href={'/work/' +
					post.slug +
					(post.metadata?.categories?.[0] ? '?category=' + post.metadata.categories[0] : '')}
				class="my-4 flex flex-col gap-4 rounded-lg bg-base-200/30 transition-all duration-300 hover:scale-[1.02] hover:bg-base-200/50 hover:shadow-lg"
			>
				<div class="aspect-[5/3] flex-none overflow-hidden rounded-lg rounded-b-none bg-base-200">
					{#if post.metadata.coverImage}
						<img
							loading="lazy"
							draggable="false"
							class="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
							src={post.metadata.coverImage}
							alt={post.slug}
						/>
					{/if}
				</div>
				<div class="flex h-full flex-col px-3 pb-3">
					<h2 class="text-ld line-clamp-3 flex-1 font-bold sm:text-2xl">
						{@html post.metadata?.title || 'Untitled'}
					</h2>

					<div class="mt-2 flex gap-3 text-sm opacity-40">
						<div class="flex flex-wrap gap-3">
							{#if post.metadata.categories}
								{#each post.metadata.categories as category}
									<div class="">{category}</div>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			</a>
		</div>
	{/each}
</div>

<style>
	/* Smooth image zoom animation */
	.overflow-hidden {
		transition: transform 0.3s ease-in-out;
	}
</style>

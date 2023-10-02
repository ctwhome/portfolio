<script>
	export let data;
	const { post, media, date, tags, categories, nextPost, previousPost } = data;

	let large = media?.media_details?.sizes?.large?.source_url || media?.source_url;
	let title = post?.title?.rendered;
	let content = post?.content?.rendered;
</script>

<div class="prose mx-auto mt-6 px-2 sm:px-0">
	{#if post}
		<h1>{@html title}</h1>
		<p>
			{date} -
			{#each categories as category}
				<span class="mr-3">{category.name}</span>
			{/each}

			-
			{#each tags as tag}
				<span class="mr-3">{tag.name}</span>
			{/each}
		</p>
		<!-- each categories show catory.name -->

		{#if media}
			<img src={large} alt={title} class="w-full aspect-[5/3] object-cover" />
		{/if}
		{@html content}
	{/if}

	<div class="grid grid-cols-2 gap-4 w-full">
		<div class="">
			{#if previousPost}
				<a data-sveltekit-preload-data="hover" href={`/${previousPost.id}`}>
					←
					{previousPost.title.rendered}</a
				>
			{/if}
		</div>

		{#if nextPost}
			<a data-sveltekit-preload-data="hover" href={`/${nextPost.id}`}
				>→ {nextPost.title.rendered} {nextPost.slug}</a
			>
		{/if}
	</div>
</div>

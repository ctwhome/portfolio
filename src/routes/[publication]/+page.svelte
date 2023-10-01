<script>
	export let data;
	const { post, media, date, tags, categories } = data;

	let large = media?.media_details?.sizes?.large?.source_url;
	let fullImage = media?.source_url;
	let title = post.title.rendered;
	let content = post.content.rendered;
</script>

<div class="prose mx-auto mt-6">
	{#if post}
		<h1>{title}</h1>
		<p>{date} - {categories} - {tags}</p>
		{#if media}
			<img src={large} alt={title} class="w-full aspect-[5/3] object-cover" />
		{/if}
		{@html content}
	{/if}
</div>

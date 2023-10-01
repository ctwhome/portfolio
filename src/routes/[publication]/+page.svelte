<script>
	export let data;
	const { post, media, date, tags, categories } = data;

	let thumbnail = media?.media_details?.sizes?.thumbnail?.source_url;
	let fullImage = media?.source_url;
	let title = post.title.rendered;
	let content = post.content.rendered;
</script>

<div class="prose mx-auto mt-6">
	{#if post}
		<h1>{title}</h1>
		<p>{date} - {categories} - {tags}</p>
		{#if media}
			<img src={thumbnail} alt={title} />
			<img src={fullImage} alt={title} />
		{/if}
		{@html content}
	{/if}
</div>

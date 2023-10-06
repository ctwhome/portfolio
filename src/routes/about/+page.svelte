<script>
	export let data;
	const {page, yoast_head} = data;
</script>

<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->

<svelte:head>
	{#if yoast_head}
		{@html yoast_head}
	{/if}
</svelte:head>
<!-- if page show the content and the title -->
<div class="prose mx-auto px-4 sm:px-0">
	{#if page}
		<h1>{page.title?.rendered}</h1>
		<div>{@html page.content?.rendered}</div>
	{/if}
</div>

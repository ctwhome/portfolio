<script>
	export let data;
	const [page] = data.page;
</script>

<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->

<!-- if page show the content and the title -->
<div class="prose mx-auto px-4 sm:px-0">
	{#if page}
		<h1>{page.title?.rendered}</h1>
		<div>{@html page.content?.rendered}</div>
	{/if}
</div>

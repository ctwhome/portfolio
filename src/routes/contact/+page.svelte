<script>
	export let data;
	const [page] = data.page;
</script>

<div class="prose mx-auto">
	{#if page}
		<h1>{page.title?.rendered}</h1>
		<div>{@html page.content?.rendered}</div>
	{/if}
</div>

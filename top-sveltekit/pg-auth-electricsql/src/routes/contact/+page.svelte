<script lang="ts">
	let { data } = $props();
	const [page] = data.page;
</script>

<div class="prose mx-auto px-4 sm:px-0">
	{#if page}
		<h1>{page.title?.rendered}</h1>
		<div>{@html page.content?.rendered}</div>
	{/if}
</div>

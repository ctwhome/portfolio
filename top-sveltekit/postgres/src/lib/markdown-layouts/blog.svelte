<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<!-- DEFAULT Layout 🩻🩻🩻🩻🩻🩻 -->

<div class="mx-auto prose sm:prose-lg px-3 break-words overflow-auto w-full">
	{@render children?.()}
</div>

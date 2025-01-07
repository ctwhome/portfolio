<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<!-- DEFAULT Layout 🩻🩻🩻🩻🩻🩻 -->

<div class="px-3 break-words -mt-20 overflow-auto w-full">
	<div class="mx-auto prose sm:prose-lg py-20">
		{@render children?.()}
	</div>
</div>

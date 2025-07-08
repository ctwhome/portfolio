<script lang="ts">
	import type { ObjectViewerProps } from "./types.js";

	let {
		data,
		className = "",
		copyButtonText = "Copy",
		height = "h-52"
	} = $props() as ObjectViewerProps;

	let preElement: HTMLPreElement;

	function copyToClipboard() {
		if (preElement && navigator.clipboard) {
			const textContent = preElement.textContent;
			if (textContent) {
				navigator.clipboard.writeText(textContent);
			}
		}
	}
</script>

<pre
	bind:this={preElement}
	class="relative {height} w-full overflow-scroll overscroll-contain rounded-lg bg-slate-100 p-1 text-left text-xs {className}"
>
	<button
		class="btn btn-ghost btn-sm tooltip absolute right-0 top-0"
		onclick={copyToClipboard}
		type="button"
	>
		{copyButtonText}
	</button>{JSON.stringify(data, null, 2)}</pre>

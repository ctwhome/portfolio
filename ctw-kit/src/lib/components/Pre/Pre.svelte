<script lang="ts">
	import type { PreProps } from "./types.js";
	import { onMount } from 'svelte';
	import hljs from 'highlight.js/lib/core';
	import json from 'highlight.js/lib/languages/json';
	import 'highlight.js/styles/github.css';

	let {
		data,
		className = "",
		copyButtonText = "Copy",
		height = "h-52",
		title = "JSON Data"
	} = $props() as PreProps;

	let isModalOpen = false;
	let jsonViewerContainer: HTMLDivElement;
	let highlightedCode = '';

	onMount(async () => {
		// Register JSON language for highlight.js
		hljs.registerLanguage('json', json);
		
		// Import and setup json-viewer
		const { JsonViewer } = await import('@textea/json-viewer');
		
		// Clear container and create json viewer
		if (jsonViewerContainer) {
			jsonViewerContainer.innerHTML = '';
			JsonViewer.create(jsonViewerContainer, {
				value: data,
				theme: 'light',
				rootName: false,
				displaySize: true,
				displayArrayIndex: true,
				enableClipboard: true,
				quotesOnKeys: false,
				indentWidth: 2,
				collapseObjectsAfterLength: 10,
				collapseStringsAfterLength: 50
			});
		}

		// Generate highlighted code for preview
		const jsonString = JSON.stringify(data, null, 2);
		const highlighted = hljs.highlight(jsonString, { language: 'json' });
		highlightedCode = highlighted.value;
	});

	function openModal() {
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	function copyToClipboard() {
		const jsonString = JSON.stringify(data, null, 2);
		if (navigator.clipboard) {
			navigator.clipboard.writeText(jsonString);
		}
	}
</script>

<div class="relative {className}">
	<!-- Preview with button to open modal -->
	<div 
		class="relative {height} w-full overflow-hidden rounded-lg bg-slate-100 p-4 cursor-pointer hover:bg-slate-200 transition-colors"
		onclick={openModal}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && openModal()}
	>
		<div class="text-xs text-slate-600 mb-2">{title} - Click to expand</div>
		<pre class="text-xs overflow-hidden"><code class="hljs">{@html highlightedCode}</code></pre>
		<div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-100 pointer-events-none"></div>
	</div>
</div>

<!-- Modal -->
{#if isModalOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick={closeModal}>
		<div class="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] w-full mx-4 overflow-hidden" onclick={(e) => e.stopPropagation()}>
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-semibold">{title}</h3>
				<div class="flex gap-2">
					<button
						class="btn btn-sm btn-outline"
						onclick={copyToClipboard}
						type="button"
					>
						{copyButtonText}
					</button>
					<button
						class="btn btn-sm btn-ghost"
						onclick={closeModal}
						type="button"
					>
						✕
					</button>
				</div>
			</div>
			
			<div class="overflow-auto max-h-[60vh]">
				<div bind:this={jsonViewerContainer}></div>
			</div>
		</div>
	</div>
{/if}

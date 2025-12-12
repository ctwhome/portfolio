<script lang="ts">
	import { workStore } from '../stores/workStore';

	const activeCategories = workStore.activeCategories;

	// Only show when Digital Garden is selected
	import { derived } from 'svelte/store';

	const showLegend = derived(activeCategories, ($activeCategories) =>
		$activeCategories.includes('Digital Garden')
	);
</script>

{#if showLegend}
	<div class="my-6 rounded-lg bg-base-200 bg-opacity-50 p-4">
		<h3 class="mb-3 text-sm font-semibold opacity-80">
			Digital Garden Maturity Stages. My collection of evolving ideas that grow over time.
		</h3>
		<div class="grid gap-2 text-sm sm:grid-cols-3">
			<div class="flex items-center gap-2">
				<span class="text-base">🌱</span>
				<div>
					<span class="font-medium">Seeding</span>
					<p class="text-xs opacity-60">Early thoughts and initial explorations</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-base">🌿</span>
				<div>
					<span class="font-medium">Growing</span>
					<p class="text-xs opacity-60">Developing ideas with more structure</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-base">🌳</span>
				<div>
					<span class="font-medium">Mature</span>
					<p class="text-xs opacity-60">Well-developed, comprehensive content</p>
				</div>
			</div>
		</div>
	</div>
{/if}

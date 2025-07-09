<script lang="ts">
	export let createdDate: string;
	export let updatedDate: string | undefined;
	export let maturity: string | undefined;

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	$: showUpdated = updatedDate && updatedDate !== createdDate;
</script>

<div class="mt-6 rounded-lg bg-base-200 bg-opacity-50 p-4">
	<div class="flex gap-10 text-sm">
		{#if maturity}
			<div class="flex items-center gap-2">
				<span class="opacity-60">Maturity:</span>
				<span class="flex items-center gap-1">
					<span class="text-base">
						{#if maturity === 'seeding'}
							🌱
						{:else if maturity === 'growing'}
							🌿
						{:else if maturity === 'mature'}
							🌳
						{/if}
					</span>
					<span class="capitalize">{maturity}</span>
				</span>
			</div>
		{/if}

		<div class="flex items-center gap-2">
			<span class="opacity-60">Planted:</span>
			<span>{formatDate(createdDate)}</span>
		</div>

		{#if showUpdated}
			<div class="flex items-center gap-2">
				<span class="opacity-60">Last tended:</span>
				<span>{formatDate(updatedDate)}</span>
			</div>
		{/if}
	</div>
</div>

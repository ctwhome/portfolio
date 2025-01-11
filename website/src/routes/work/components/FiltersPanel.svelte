<script lang="ts">
	import { workStore } from '../stores/workStore';

	const activeCategories = workStore.activeCategories;
	const activeTags = workStore.activeTags;
	const globalCategories = workStore.globalCategories;
	const globalTags = workStore.globalTags;
</script>

<div class="mt-10 grid gap-4 rounded-lg bg-base-300 bg-opacity-20 p-4 sm:grid-cols-2">
	<div class="flex flex-wrap items-center gap-2">
		{#each $globalCategories as { name, count }}
			<button
				on:click={() => workStore.toggleCategory(name)}
				class="btn btn-xs"
				class:btn-primary={$activeCategories.includes(name)}
			>
				{name === 'Blog' ? 'Engineering Blog' : name}
				<div class="badge">{count}</div>
			</button>
		{/each}
	</div>

	<div class="dropdown">
		<div
			tabindex="0"
			role="button"
			class="btn btn-xs m-1"
			class:btn-primary={$activeTags.length > 0}
		>
			{$activeTags.length ? `${$activeTags.length} selected` : 'Tags'}
			<div class="badge">{$globalTags.length}</div>
		</div>
		<ul class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
			{#each $globalTags as { name, count }}
				<li>
					<button
						class="flex justify-between hover:bg-base-200"
						class:bg-primary={$activeTags.includes(name)}
						class:text-primary-content={$activeTags.includes(name)}
						on:click={() => workStore.toggleTag(name)}
					>
						{name}
						<div class="badge">{count}</div>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>

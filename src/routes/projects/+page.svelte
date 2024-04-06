<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	type Path = string; // The file path
	type Module = {
		default: SvelteComponent; // The Svelte Component
		metadata: Record<string, any>; // An object containing the frontmatter
	};
	type Writings = [Path, Module][];
	type Glob = { default: SvelteComponent; metadata: Record<string, any> };

	const glob_import = import.meta.glob<Glob>('./*.md', { eager: true });
	const writings = Object.entries(glob_import);
	console.log({ writings });

	// remove repeated tag
	const tags: string[] = Array.from(
		new Set(writings.flatMap(([, module]) => module.metadata.tags))
	);
	console.log(writings.flatMap(([, module]) => module.metadata.tags));
</script>

{tags}
<!-- Display only the title from the metadata -->
<!-- {#each writings as [path, module]}
	{module.metadata.title}
{/each} -->
<!--
<div class="container mx-auto">
	{#each writings as [path, module]}
		<svelte:component this={module.default} />
		{path}
		<pre>{JSON.stringify(module, null, 2)}</pre>
	{/each}
</div> -->

<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	type Path = string; // The file path
	type Module = {
		default: SvelteComponent; // The Svelte Component
		metadata: Record<string, any>; // An object containing the frontmatter
	};
	type content = [Path, Module][];
	type Glob = { default: SvelteComponent; metadata: Record<string, any> };

	const glob_import = import.meta.glob<Glob>('$lib/content/projects/*.md', { eager: true });
	const content = Object.entries(glob_import);
	console.log({ content });

	// remove repeated tag
	const tags: string[] = Array.from(new Set(content.flatMap(([, module]) => module.metadata.tags)));
	console.log(content.flatMap(([, module]) => module.metadata.tags));
</script>

<h1>Projects</h1>

{tags}
<!-- Display only the title from the metadata -->
<!-- {#each content as [path, module]}
	{module.metadata.title}
{/each} -->

<div class="container mx-auto">
	{#each content as [path, module]}
		<svelte:component this={module.default} />
		{path}
		<pre>{JSON.stringify(module, null, 2)}</pre>
	{/each}
</div>

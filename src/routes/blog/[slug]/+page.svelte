<script>
	import { page } from '$app/stores';
	import TiltImage from '$components/TiltImage.svelte';
	import { content } from '$content/content';
	// console.log('🎹 content', content);

	// Find the specific module for the current slug
	const modulePath = Object.keys(content).find(
		(path) => path.split('/').at(-2) === $page.params.slug
	);
	const module = content[modulePath];
</script>

<TiltImage>
	<img
		class="object-cover rounded"
		src={module.metadata.coverImage &&
			`/content/${$page.params.slug}/${module.metadata.coverImage}`}
		alt={module.slug}
	/>
</TiltImage>
<!-- <img src={coverImagePath} alt="Cover Image" /> -->

<!-- <img src={'/' + coverImage} alt="" /> -->
<div>THis is my page</div>
<svelte:component this={module.default} />

<!-- {coverImagePath} -->
<pre>{JSON.stringify(module, null, 2)}</pre>

<script>
	import { page } from '$app/stores';
	import '$lib/assets/css/app.css';
	import Analytics from '$lib/components/Analytics.svelte';

	import TiltImage from '$components/TiltImage.svelte';
	import { content } from '$content/content';
	import ProfilePicture from '$components/ProfilePicture.svelte';

	// Find the specific post for the current slug
	const postPath = Object.keys(content).find(
		(path) => path.split('/').at(-2) === $page.params.slug
	);
	const post = content[postPath];
</script>

<Analytics />

<div class="max-w-3xl mx-auto px-3">
	<h1 class="mt-6 font-bold text-3xl sm:text-5xl">{@html post.metadata.title}</h1>

	<p class="text-sm mt-4 opacity-60">
		{#each post?.metadata?.categories as category}
			<span class="mx-1">{category}</span>
		{/each}
		-
		{new Date(post?.metadata?.date).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}

		{#if post?.metadata?.tags?.length > 0}
			|
			{#each post?.metadata?.tags as tag}
				<span class="mx-1">{tag}</span>
			{/each}
		{/if}
	</p>

	<div class="mt-6 mb-12">
		<ProfilePicture />
	</div>
</div>
<div class="max-w-5xl mx-auto px-3">
	<TiltImage>
		<img
			class="object-cover rounded mx-auto"
			src={post?.metadata?.coverImage &&
				`/content/${$page.params.slug}/${post.metadata.coverImage}`}
			alt={post.slug}
		/>
	</TiltImage>

	<svelte:component this={post.default} />
</div>

<!-- {coverImagePath} -->
<!-- <pre>{JSON.stringify(post, null, 2)}</pre> -->

<script>
	import { page } from '$app/stores';
	import '$lib/assets/css/app.css';
	import Analytics from '$lib/components/Analytics.svelte';

	import TiltImage from '$components/TiltImage.svelte';
	import { content } from '$content/content';
	import ProfilePicture from '$components/ProfilePicture.svelte';
	import SEO from '$components/SEO.svelte';

	// Find the specific post for the current slug
	const postPath = Object.keys(content).find(
		(path) => path.split('/').at(-2) === $page.params.slug
	);
	const post = content[postPath];

	let details =
		post.metadata.categories.map((category) => `${category}`).join(' ') +
		' - ' +
		post.metadata.tags.map((tag) => `${tag}`).join(' ') +
		'  · ' +
		new Date(post?.metadata?.date).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
</script>

<Analytics />
{#if post?.metadata?.displayCover}
	<TiltImage>
		<div class="aspect-[4/3] sm:aspect-[20/5] -mt-10 mb-10 sm:mb-20">
			<img
				class="object-cover h-full w-full mx-auto rounded mb-10"
				src={`/content/${$page.params.slug}/${post.metadata.coverImage}`}
				alt={post.slug}
			/>
		</div>
	</TiltImage>
{/if}

<SEO
	title={post.metadata.title}
	desc={post.metadata.description}
	img={`/content/${$page.params.slug}/${post.metadata.coverImage}`}
/>

<div class="max-w-5xl mx-auto px-3">
	<div class="max-w-3xl mx-auto px-3">
		<h1 class="mt-6 font-bold text-3xl sm:text-5xl">{@html post.metadata.title}</h1>

		{#if post.metadata.description}
			<p class="mt-4 text-lg opacity-80">{post.metadata.description}</p>
		{/if}

		<!-- <p class="text-sm mt-4 opacity-60">
			{#each post?.metadata?.categories as category}
				<span class="mx-1">{category}</span>
			{/each}
			|
			{#each post?.metadata?.tags as tag}
				<span class="mx-1">{tag}</span>
			{/each}
			-
			{new Date(post?.metadata?.date).toLocaleDateString('en-NL', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</p> -->

		<div class="mt-10 mb-12">
			<ProfilePicture subtitle={details} />
		</div>
	</div>

	<svelte:component this={post.default} />

	<a
		target="_blank"
		class="opacity-80 block mt-32 hover:text-primary"
		href={`https://github.com/ctwhome/portfolio/tree/main/src/content/${$page.params.slug}`}
	>
		Edit this page
	</a>
</div>

<!-- {coverImagePath} -->
<!-- <pre>{JSON.stringify(post, null, 2)}</pre> -->

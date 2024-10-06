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

	let categories = post.metadata?.categories.map((category) => `${category}`).join(' ');
	let details =
		// post.metadata?.categories.map((category) => `${category}`).join(' ') +
		// ' - ' +
		post.metadata?.tags.map((tag) => `${tag}`).join(' ') +
		'  · ' +
		new Date(post?.metadata?.date).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
</script>

<Analytics />

<SEO
	title={post?.metadata?.title}
	desc={post?.metadata?.description}
	img={`/content/${$page.params.slug}/${post?.metadata?.coverImage}`}
/>

<div class="max-w-5xl mx-auto px-3 sm:mt-14">
	<div class="max-w-3xl mx-auto px-3">
		<div class=" font-extrabold">
			<span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
				<a href={`/work?category=${categories}`}>
					{#if categories === 'Digital Garden'}
						🌱
					{/if}
					{#if categories === 'Blog'}
						Engineering
					{/if}
					{categories}
				</a>
			</span>
		</div>

		<h1 class="mt-4 font-black text-3xl sm:text-4xl">{@html post.metadata?.title}</h1>

		{#if post?.metadata?.description}
			<p class="mt-4 text-lg opacity-80">
				{@html post?.metadata?.description}
			</p>
		{/if}

		{#if post?.metadata?.displayCover}
			<div class="mt-10 sm:mt-14">
				<TiltImage>
					<div class="aspect-[16/9] sm:scale-110">
						<img
							class="object-cover h-full w-full mx-auto rounded-xl outline-offset-8 outline-base-200 outline mb-10"
							src={`/content/${$page.params.slug}/${post.metadata.coverImage}`}
							alt={post.slug}
						/>
					</div>
				</TiltImage>
			</div>
		{/if}

		<div class="mt-10 sm:mt-20">
			<ProfilePicture subtitle={details} />
		</div>
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
	</div>

	<div class="mt-10"></div>
	<svelte:component this={post.default} />

	<a
		target="_blank"
		class="opacity-80 block mt-32 hover:text-primary text-right"
		href={`https://github.com/ctwhome/portfolio/tree/main/src/content/${$page.params.slug}`}
	>
		Edit this page
	</a>
</div>

<!-- {coverImagePath} -->
<!-- <pre>{JSON.stringify(post, null, 2)}</pre> -->

<style>
	:global(img) {
		@apply rounded-lg;
	}
</style>

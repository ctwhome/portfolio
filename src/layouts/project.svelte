<script>
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { page } from '$app/stores';
	import TiltImage from '$components/TiltImage.svelte';

	//! TODO:
	//! this is very hacky, but only way for now to get the metadata of the md file directly
	//! The reason is that the metadata is not available in the layout file so we have to get it from the glob and filter by the current route
	//! This is a workaround until we have a better solution coming from MDSveX
	const posts = import.meta.glob('/src/routes/work/**/*.md', { eager: true });
	const postIndex = Object.keys(posts).findIndex((post) => post.includes($page.route.id));
	const post = Object.entries(posts)[postIndex];

	const metadata = post[1].metadata;
	// const path = post[0];

	//
	//! Again, very hacky, i need to get all images in the folder and then filter by the current post.
	//
	const imagesArray = Object.values(
		import.meta.glob('/src/routes/work/**/*.{webp,jpg,png,avif,gif}', {
			eager: true
		})
	).map((mod) => mod.default); // Convert to array of URLs
	const imageIndex = imagesArray.findIndex((url) =>
		new RegExp(
			`${metadata.cover?.split('.')[0]}(\\.[^.]+)?\\.${metadata.cover?.split('.')[1]}$`
		).test(url)
	);
</script>

<div class="mx-auto prose py-10 px-3">
	<h1 class="text-4xl font-bold mb-5">
		{metadata.title}
	</h1>

	<p class="text-sm">
		<!-- {#each categories as category} -->
		<span class="mx-1 capitalize">{metadata.type}</span>
		<!-- {/each} -->
		-
		{new Date(metadata.date).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}

		{#if metadata.tags.length > 0}
			|
		{/if}

		{#each metadata.tags as tag}
			<span class="mx-1 capitalize">{tag}</span>
		{/each}
	</p>

	<ProfilePicture />

	{#if metadata.cover && metadata.displayCover}
		<TiltImage>
			<img
				src={imagesArray[imageIndex]}
				alt={`Image at ${imagesArray[imageIndex]}`}
				class="rounded-lg aspect-video pointer-events-none object-cover select-none"
			/>
		</TiltImage>
		<!-- <TiltImage src={'/src/routes' + $page.route.id + '/' + metadata.cover} alt={metadata.title} /> -->
	{/if}

	<!-- Render content of the Markdown file -->

	<slot />

	<a
		href={'https://github.com/ctwhome/portfolio/src/routes' + $page.route.id + '/+page.md'}
		target="_blank"
		class="text-base-300"
	>
		Edit this page
	</a>
</div>

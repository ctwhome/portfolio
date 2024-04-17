<script>
	import ProfilePicture from '$lib/components/ProfilePicture.svelte';
	import { page } from '$app/stores';
	import TiltImage from '$components/TiltImage.svelte';

	//! TODO:
	//! this is very hacky, but only way for now to get the metadata of the md file directly
	//! The reason is that the metadata is not available in the layout file so we have to get it from the glob and filter by the current route
	//! This is a workaround until we have a better solution coming from MDSveX
	const posts = import.meta.glob('/src/routes/posts/**/*.md', { eager: true });
	const postIndex = Object.keys(posts).findIndex((post) => post.includes($page.route.id));
	const post = Object.entries(posts)[postIndex];

	const metadata = post[1].metadata;
	const path = post[0];

	//! Again, very hacky, i need to get all images in the folder and then filter by the current post.
	// Import images eagerly
	const images = import.meta.glob('/src/routes/posts/**/*.{webp,jpg,png,avif}', {
		eager: true
	});
	const imageIndex = Object.keys(images).findIndex((post) =>
		post.includes(path.split('/')[4] + '/' + metadata.cover)
	);
	// Convert to array of URLs
	const image = Object.entries(images)[imageIndex];
</script>

<div class="mx-auto prose py-10 px-3">
	<h1 class="text-4xl font-bold mb-5">
		{metadata.title}
	</h1>

	{#if metadata.cover && metadata.displayCover}
		<TiltImage alt={metadata.title}>
			<img
				src={image[0]}
				alt={`Image at ${image[0]}`}
				class="rounded-lg pointer-events-none aspect-video w-full object-cover select-none"
			/>
		</TiltImage>
		<!-- <TiltImage src={'/src/routes' + $page.route.id + '/' + metadata.cover} alt={metadata.title} /> -->
	{/if}
	<ProfilePicture />

	<!-- Render content of the Markdown file -->
	<slot />
</div>

<a
	href={'https://github.com/ctwhome/portfolio/src/routes' + $page.route.id + '/+page.md'}
	target="_blank"
>
	edit this page
</a>

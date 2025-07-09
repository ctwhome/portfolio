<script lang="ts">
	import { page } from '$app/stores';
	import '$lib/assets/css/app.css';
	import Analytics from '$lib/components/Analytics.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import TiltImage from '$components/TiltContent.svelte';
	import { content } from '$content/content';
	import ProfilePicture from '$components/ProfilePicture.svelte';
	import SEO from '$components/SEO.svelte';
	import GardenDates from '$components/GardenDates.svelte';
	import { onMount } from 'svelte';

	interface PostMetadata {
		title: string;
		description?: string;
		categories: string[];
		tags: string[];
		date: string;
		coverImage: string;
		displayCover: boolean;
	}

	interface Post {
		metadata: PostMetadata;
		default: any;
		slug: string;
	}

	// Find the specific post for the current slug
	const postPath = Object.keys(content).find(
		(path) => path.split('/').at(-2) === $page.params.slug
	);
	const post: Post | null = postPath ? (content as Record<string, Post>)[postPath] : null;

	let categories =
		post?.metadata?.categories.map((category: string) => `${category}`).join(' ') ?? '';
	let details =
		(post?.metadata?.tags.map((tag: string) => `${tag}`).join(' ') ?? '') +
		'  · ' +
		(post?.metadata?.date
			? new Date(post.metadata?.date).toLocaleDateString('en-NL', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
			: '');

	let images: string[] = [];
	let videos: string[] = [];
	let galleryComponent: Gallery | null = null;

	onMount(() => {
		const contentElement = document.querySelector('.prose');
		if (contentElement) {
			images = Array.from(contentElement.querySelectorAll('img')).map(
				(img) => (img as HTMLImageElement).src
			);
			videos = Array.from(contentElement.querySelectorAll('video')).map(
				(video) => (video as HTMLVideoElement).src
			);

			// Add cover image to the beginning of the images array
			const coverImage = `/content/${$page.params.slug}/${post?.metadata?.coverImage ?? ''}`;
			images = [coverImage, ...images];
		}
	});

	function openGalleryWithCover() {
		console.log('Opening gallery with cover');
		if (galleryComponent) {
			console.log('Gallery component found, opening gallery');
			galleryComponent.openGallery(0);
		} else {
			console.log('Gallery component not found');
		}
	}
</script>

<Analytics />

<SEO
	title={post?.metadata?.title ?? ''}
	desc={post?.metadata?.description ?? ''}
	img={`/content/${$page.params.slug}/${post?.metadata?.coverImage ?? ''}`}
/>

<div class="mx-auto max-w-5xl px-3 sm:mt-14">
	<div class="mx-auto max-w-3xl px-3">
		<div class=" font-extrabold">
			<span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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

		<h1 class="mt-4 text-3xl font-black sm:text-4xl">{@html post?.metadata?.title ?? ''}</h1>

		{#if post?.metadata?.description}
			<p class="mt-4 text-lg opacity-80">
				{@html post.metadata?.description}
			</p>
		{/if}

		{#if post?.metadata?.displayCover}
			<div class="mt-10 sm:mt-14">
				<TiltImage on:click={openGalleryWithCover}>
					<div class="aspect-[16/9] sm:scale-110">
						<img
							draggable="false"
							class="mx-auto mb-10 h-full w-full cursor-pointer select-none rounded-xl object-cover outline outline-offset-8 outline-base-200"
							src={`/content/${$page.params.slug}/${post.metadata?.coverImage}`}
							alt={post.slug ?? ''}
						/>
					</div>
				</TiltImage>
			</div>
		{/if}

		<div class="mt-10 sm:mt-20">
			<ProfilePicture subtitle={details} />
		</div>
		
		{#if post?.metadata?.categories?.includes('Digital Garden')}
			<GardenDates 
				createdDate={post.metadata.date}
				updatedDate={post.metadata.updated}
				maturity={post.metadata.maturity}
			/>
		{/if}
	</div>

	<div class="mt-10"></div>
	{#if post?.default}
		<svelte:component this={post.default} />
	{/if}

	<a
		target="_blank"
		class="mt-32 block text-right opacity-80 hover:text-primary"
		href={`https://github.com/ctwhome/portfolio/tree/main/website/src/content/${$page.params.slug}`}
	>
		Edit this page
	</a>
</div>

{#if images.length > 0 || videos.length > 0}
	<Gallery bind:this={galleryComponent} {images} {videos} />
{/if}

<style>
	:global(img) {
		@apply rounded-lg;
	}
</style>

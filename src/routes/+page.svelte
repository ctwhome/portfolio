<script>
	import ProfilePicture from '$components/ProfilePicture.svelte';
	// import StatusEnum from '$lib/models/status-enum.js';
	// import svelteTilt from 'vanilla-tilt-svelte';
	// import profileImage from '$lib/assets/images/ctw-jess-profile.avif';
	// import producDesignImage from '$lib/assets/images/product-design.svg';
	// import engineeringImage from '$lib/assets/images/web.svg';
	import { onMount, onDestroy } from 'svelte';
	import TiltContent from '$lib/components/TiltContent.svelte';

	import { posts } from '$content/content';
	onMount(async () => {});

	onDestroy(() => {
		// Cleanup if needed
	});
</script>

<svelte:head></svelte:head>
<div class="first-fold sm:pt-6">
	<div class="max-w-screen-xl m-auto px-6">
		<div class="grid sm:grid-cols-2 gap-20">
			<div class="flex flex-col gap-10 sm:gap-10 sm:mt-10 sm:mt-5">
				<p class="text-2xl sm:text-3xl lg:text-5xl order-2 sm:order-1">
					I create experiences weaving strong <span class="ctw-text-gradient font-serif font-bold">
						design aesthetics
					</span>
					with
					<span class="ctw-text-gradient-green font-serif font-bold">technical engineering</span>
					know-how.
				</p>
				<TiltContent class=" order-1">
					<ProfilePicture subtitle="Product Designer & Research Software Engineer" />
				</TiltContent>
			</div>

			<TiltContent>
				<img
					draggable="false"
					src="/images/profile.avif"
					class="hidden sm:block rounded pointer-events-none w-full object-cover
							sm:object-[0px,-200px] sm:h-[350px]
							lg:object-[0px,-450px] lg:h-[500px]
							select-none
							"
					alt="Jesse Ctw Profile"
				/>
			</TiltContent>
		</div>
	</div>

	<div class="container mx-auto px-4 -mt-6 sm:mt-16 lg:mt-20">
		<h2
			class="text-[5rem] sm:text-[6rem] lg:text-[15rem]
						 leading-[3.5rem] sm:leading-[3.8rem] lg:leading-[10rem]
						font-bold font-title text-center"
		>
			Take my <span class="line-through opacity-50">word</span>
			<span class="">WORK</span>
			for it!
		</h2>
	</div>

	<div
		class="container mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12 mt-6 sm:mt-12 lg:mt-32"
	>
		{#each posts as post}
			<div>
				<h2 class="text-xl font-bold mt-8 opacity-60">
					{new Date(post.metadata.date).getUTCFullYear()}
				</h2>
				<a
					data-sveltekit-preload-data="hover"
					href={'/work/' + post.slug + '?category=' + post.metadata.categories[0]}
					class="flex flex-col gap-4 rounded-lg hover:bg-base-200/50 transition bg-base-200/30 my-4"
				>
					<div class="flex-none">
						{#if post.metadata.coverImage}
							<img
								draggable="false"
								class="aspect-[5/3] object-cover rounded-lg rounded-b-none"
								src={post.metadata.coverImage &&
									`/content/${post.slug}/${post.metadata.coverImage}`}
								alt={post.slug}
							/>
						{/if}
					</div>
					<div class="px-3 pb-3">
						<h2 class="text-ld line-clamp-3 sm:text-2xl font-bold">{@html post.metadata.title}</h2>
						<!-- {#if post.metadata.description}
							<div class="prose line-clamp-3 mt-2 leading-5 sm:leading-auto text-sm">
								{@html post.metadata.description}
							</div>
						{/if} -->

						<div class="flex gap-3 mt-2 opacity-40 text-sm">
							<div class="flex flex-wrap gap-3">
								{#if post.metadata.categories}
									{#each post.metadata.categories as category}
										<div class="">{category}</div>
									{/each}
								{/if}
								<!-- {#if post.metadata.tags}
						{#each post.metadata.tags as tag}
						<div class="">{tag}</div>
						{/each}
						{/if} -->
							</div>
						</div>
					</div>
				</a>
			</div>
		{/each}
		<!-- <pre>{JSON.stringify(posts, null, 2)}</pre> -->
	</div>
</div>

<style>
	.glow {
		transition: text-shadow 200ms ease;
		text-shadow: 0px 0px 4px white;
	}

	.glow:hover {
		text-shadow: 0px 0px 4px white;
	}

	.ctw-text-gradient {
		background: -webkit-linear-gradient(
			110deg,
			/*#456563 24.71%,*/ /*#5A877E 37.34%,*/ #fdc343 51.57%,
			#e99877 67.46% /*#A4574E 85.7%*/
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.ctw-text-gradient-green {
		background: -webkit-linear-gradient(
			110deg,
			/*#456563 24.71%,*/ #5a877e 37.34%,
			/*#FDC343 51.57%,*/ #e99877 67.46% /*#A4574E 85.7%*/
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.ctw-logo {
		width: 180px;
		margin: 16px auto;
		opacity: 0.6;
	}

	.grid-buttons {
		padding: 16px;
		display: grid;
		grid-gap: 8px;
		grid-template-columns: 1fr 1fr;
	}

	.card {
		animation: 1s appear;
		width: 100%;
	}

	.card:hover {
		background-color: #1b1d2850;
	}

	.quote span {
		color: #ffffff95;
	}

	.title {
		font-family:
			'Quicksand',
			'Source Sans Pro',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			'Helvetica Neue',
			Arial,
			sans-serif;
		display: block;
		font-weight: 300;
		font-size: 100px;
		color: #35495e;
		letter-spacing: 1px;
	}

	.subtitle {
		font-weight: 300;
		font-size: 42px;
		color: #526488;
		word-spacing: 5px;
		padding-bottom: 15px;
	}

	.links {
		padding-top: 15px;
		animation: 1s appear;
		/*animation-delay: 500ms;*/
	}

	@keyframes appear {
		0% {
			opacity: 0;
		}
	}
</style>

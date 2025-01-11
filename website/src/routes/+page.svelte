<script lang="ts">
	import ProfilePicture from '$components/ProfilePicture.svelte';
	import { onMount, onDestroy } from 'svelte';
	import TiltContent from '$lib/components/TiltContent.svelte';

	import { posts as allPosts } from '$content/content';
	import MyApps from './LandingPageComponents/MyApps.svelte';
	import PostsGrid from './LandingPageComponents/PostsGrid.svelte';

	const projectCategories = ['Project', 'Research Project'];
	const posts = allPosts.filter(
		(post) =>
			post.metadata?.categories?.some((category) => projectCategories.includes(category)) ?? false
	);

	let lastDisplayedYear: number | null = null;

	function shouldDisplayYear(currentYear: number): boolean {
		if (currentYear !== lastDisplayedYear) {
			lastDisplayedYear = currentYear;
			return true;
		}
		return false;
	}

	onMount(async () => {});

	onDestroy(() => {
		// Cleanup if needed
	});
</script>

<svelte:head></svelte:head>
<div class="first-fold sm:pt-6">
	<div class="m-auto max-w-screen-xl px-6">
		<div class="grid gap-20 sm:grid-cols-2">
			<div class="flex flex-col gap-10 sm:mt-5 sm:gap-10">
				<p class="order-2 text-2xl sm:order-1 sm:text-3xl lg:text-5xl">
					I create experiences weaving strong <span class="ctw-text-gradient font-serif font-bold">
						design aesthetics
					</span>
					with
					<span class="ctw-text-gradient-green font-serif font-bold">technical engineering</span>
					know-how.
				</p>
				<TiltContent class="order-1">
					<ProfilePicture subtitle="Product Designer & Research Software Engineer" />
				</TiltContent>
			</div>

			<TiltContent>
				<img
					draggable="false"
					src="/images/profile.avif"
					class="pointer-events-none hidden w-full select-none rounded object-cover
					object-center
							 sm:block
						   sm:h-[350px]
						   md:h-[350px]
							 lg:h-[400px]
							xl:h-[500px]
							"
					alt="Jes Ctw Profile"
				/>
			</TiltContent>
		</div>
	</div>

	<div class="container mx-auto -mt-6 px-4 sm:mt-16 xl:mt-20">
		<h2
			class="font-title text-center text-[5rem] font-bold leading-[3.5rem]
						 sm:text-[6rem] sm:leading-[3.8rem] lg:text-[9rem] lg:leading-[6rem] xl:text-[12rem]
						 xl:leading-[8rem] 2xl:text-[15rem] 2xl:leading-[10rem]"
		>
			Take my <span class="line-through opacity-40">word</span>
			<span class="ctw-text-gradient font-black">WORK</span>
			for it!
		</h2>
	</div>

	<div class="container mx-auto mt-6 px-4 sm:mt-12 lg:mt-32">
		<h2 class="mb-8 mt-20 text-4xl font-bold opacity-60 sm:mt-28">Apps</h2>
		<MyApps />

		<h2 class="mb-4 mt-20 text-4xl font-bold opacity-60">Projects</h2>
		<PostsGrid {posts} {shouldDisplayYear} />

		<a href="/work?category=Project%2CResearch+Project" class="btn btn-primary btn-lg ml-4 mt-10">
			See all work ({allPosts.length})
		</a>
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

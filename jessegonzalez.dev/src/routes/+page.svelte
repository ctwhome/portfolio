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
<div class="first-fold animate-fade-in sm:pt-6">
	<div class="m-auto max-w-screen-xl px-6">
		<div class="grid gap-20 sm:grid-cols-2">
			<div class="animate-slide-up flex flex-col gap-10 sm:mt-5 sm:gap-10">
				<p
					class="hover:glow-text order-2 text-2xl transition-all duration-300 sm:order-1 sm:text-3xl lg:text-5xl"
				>
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

	<div class="animate-fade-in-up container mx-auto -mt-6 px-4 sm:mt-16 xl:mt-20">
		<h2
			class="font-title glow-text-strong text-center text-[5rem] font-bold leading-[3.5rem]
						 transition-transform duration-700 sm:text-[6rem] sm:leading-[3.8rem]
						 lg:text-[9rem] lg:leading-[6rem] xl:text-[12rem] xl:leading-[8rem] 2xl:text-[15rem] 2xl:leading-[10rem]"
		>
			Take my <span class="line-through opacity-40">word</span>
			<span class="ctw-text-gradient font-black">WORK</span>
			for it!
		</h2>
	</div>

	<div class="animate-fade-in-delayed container mx-auto mt-6 px-4 sm:mt-12 lg:mt-32">
		<h2
			class="hover:glow-text mb-8 mt-20 text-4xl font-bold opacity-60 transition-all duration-300 sm:mt-28"
		>
			Apps
		</h2>
		<MyApps />

		<h2 class="mb-4 mt-20 text-4xl font-bold opacity-60">Projects</h2>
		<PostsGrid {posts} {shouldDisplayYear} />

		<a href="/work?category=Project%2CResearch+Project" class="btn btn-primary btn-lg ml-4 mt-10">
			See all work ({allPosts.length})
		</a>
	</div>
</div>

<style>
	@keyframes glow-pulse {
		0%,
		100% {
			text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
		}
		50% {
			text-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
		}
	}

	.glow-text {
		text-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
	}

	.glow-text:hover {
		text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
	}

	.glow-text-strong {
		animation: glow-pulse 3s infinite;
		text-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-up {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fade-in 1s ease-out;
	}

	.animate-slide-up {
		animation: slide-up 1s ease-out;
	}

	.animate-fade-in-up {
		animation: slide-up 1.2s ease-out;
	}

	.animate-fade-in-delayed {
		animation: fade-in 1s ease-out 0.5s both;
	}

	.ctw-text-gradient {
		background: -webkit-linear-gradient(110deg, #fdc343 51.57%, #e99877 67.46%, #fdc343 85.7%);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-shift 4s ease infinite;
	}

	@keyframes gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.ctw-text-gradient-green {
		background: -webkit-linear-gradient(110deg, #5a877e 37.34%, #e99877 67.46%, #5a877e 97.46%);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-shift 4s ease infinite;
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

<script>
	import ProfilePicture from '$components/ProfilePicture.svelte';
	import TiltImage from '$components/TiltContent.svelte';
	// import StatusEnum from '$lib/models/status-enum.js';
	// import svelteTilt from 'vanilla-tilt-svelte';
	import profileImage from '$lib/assets/images/ctw-jess-profile.avif';
	import producDesignImage from '$lib/assets/images/product-design.svg';
	import engineeringImage from '$lib/assets/images/web.svg';
	import { onMount, onDestroy } from 'svelte';
	import TiltContent from '$lib/components/TiltContent.svelte';

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
					src="/images/profile.avif"
					class="hidden sm:block rounded pointer-events-none w-full object-cover
							sm:object-[0px,-200px] sm:h-[350px]
							lg:object-[0px,-450px] lg:h-[500px]
							"
					alt="Jesse Ctw Profile"
				/>
			</TiltContent>
		</div>
	</div>

	<div class="container mx-auto px-4 -mt-6 sm:mt-12 lg:mt-20">
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

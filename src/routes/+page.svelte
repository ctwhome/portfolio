<script>
	// import StatusEnum from '$lib/models/status-enum.js';
	// import svelteTilt from 'vanilla-tilt-svelte';
	import { onMount, onDestroy } from 'svelte';
	import VanillaTilt from 'vanilla-tilt';

	// let plants = [];
	let products = [];
	let webs = [];

	let tiltProfile;
	let tiltUX;
	let tiltWeb;

	const formatDate = (date) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(date).toLocaleDateString('en', options);
	};

	onMount(async () => {
		const tiltOtions = {
			max: 25,
			perspective: 1000,
			scale: 1.05,
			speed: 2000,
			transition: true,
			axis: null,
			reset: true,
			easing: 'cubic-bezier(.03,.98,.52,.99)',
			glare: false,
			'max-glare': 0.5,
			'glare-prerender': false
		};
		VanillaTilt.init(tiltProfile, tiltOtions);
		VanillaTilt.init(tiltUX, tiltOtions);
		VanillaTilt.init(tiltWeb, tiltOtions);

		// const resPlants = await fetch('/digital-garden');
		// const resProducts = await fetch('/product-design');
		// const resWebs = await fetch('/web');

		// plants = await resPlants.json();
		// products = await resProducts.json();
		// webs = await resWebs.json();
	});

	onDestroy(() => {
		// Cleanup if needed
		// VanillaTilt.destroy(tiltElement);
	});
</script>

<svelte:head></svelte:head>
<div>
	<div class="first-fold pt-6">
		<div class="container m-auto px-6">
			<div class="md:flex justify-between items-center">
				<div class="md:w-6/12 lg:p-0 p-7 slidein-animation">
					<h1 class="text-3xl md:text-5xl font-bold font-title">J. G. Gonzalez</h1>

					<p class="mt-10 text-2xl md:text-3xl lg:text-4xl font-serif">
						I create experiences weaving together strong <span class="ctw-text-gradient"
							>design aesthetics</span
						>
						with
						<span class="ctw-text-gradient-green"> technical engineering</span> know-how.
					</p>
					<p class="mt-10 text-lg md:text-xl opacity-80">
						Product Designer & Research Software Engineer <br class="hidden sm:inline" /> at
						<a
							class="text-blue-300 glow"
							href="https://www.esciencecenter.nl/team/jesus-garcia-gonzalez-msc"
							target="_blank"
							rel="noopener">The Netherlands eScience Center</a
						>
					</p>
				</div>

				<div
					class="md:w-5/12 order-2"
					bind:this={tiltProfile}
					style=" transform: scale(1) perspective(1040px) rotateY(-31deg) rotateX(2deg);"
				>
					<img
						src="$lib/assets/images/ctw-jess-profile.jpg"
						class="tilt rounded pointer-events-none h-[450px] w-full object-cover"
						alt="Jesse Ctw Profile"
					/>
				</div>
			</div>
		</div>
	</div>

	<div class="container mx-auto">
		<h2 class="text-lg md:text-3xl font-bold font-title">
			Take my <span class="line-through opacity-50">word</span> work for it!
		</h2>
	</div>

	<div class="max-w-[1000px] flex flex-col-reverse md:flex-row gap-20 mt-20 px-4 mx-auto">
		<!--        digital garden-->
		<!-- <div class=" md:w-1/3 "> -->
		<!-- <a href="/digital-garden">
        <img
          class="w-full -mt-10
              transition duration-500
              border-opacity-0 hover:border-opacity-100 border-b-4 border-primary
          "
          src="$lib/assets/images/digital-garden.svg"
          alt="UX Button"
        >
      </a>
      <p class="mt-8">
        A consistently tended collection of half-baked notes, research, and sketches.
      </p>

      <div class="flex flex-col mt-10 gap-6 ">
        {#each plants as post}
          <a href={post.path}>
            <div
              class="
              flex flex-col
              bg-base-100 rounded p-2 flex gap-2 h-28
                border-opacity-0 hover:border-opacity-100 border-b-8 border-primary shadow
                hover:bg-base-200 hover:bg-opacity-30
                transition ease-in-out duration-300 hover:shadow-xl transform hover:scale-105"
            >
              <div class="text-xl font-medium w-3/4">
                {post.title}
              </div>

              <div class="flex justify-between items-center text-sm text-base-content text-opacity-60">
                <div>{formatDate(post.created)}</div>
                <div class="">
                  {StatusEnum[post.status]}
                </div>
              </div>
            </div>
          </a>
        {/each}

        <a href="/digital-garden" class="btn btn-ghost ml-auto normal-case">
          Visit the Garden
        </a>
      </div> -->
		<!-- </div> -->

		<!--        second-->
		<!-- <div class="flex flex-col sm:flex-row gap-4  "> -->
		<!--          design-->
		<div class="w-full">
			<div bind:this={tiltUX}>
				<!-- <a href="/product-design"> -->
				<img
					class="w-full transition duration-500 border-opacity-0 hover:border-opacity-100 border-b-4 border-primary"
					src="$lib/assets/images/product-design.svg"
					alt="UX Button"
				/>
				<!-- </a> -->
			</div>
			<!-- <div class="flex flex-col w-full mt-20 gap-8">
				{#each products as post}
					<a
						href={post.path}
						class="bg-base-100 rounded flex flex-col gap-2
              border-opacity-0 hover:border-opacity-100 border-b-4 border-primary shadow
              hover:bg-base-200 hover:bg-opacity-30
              transition ease-in-out hover:shadow-xl transform duration-300 hover:scale-105"
					>
						<img src={post.image} class="h-40 object-cover rounded-t" alt="post image" />
						<div class="text-2xl font-medium px-2">
							{post.title}
						</div>
						<div class="1-4 text-sm text-base-content text-opacity-70 px-2 pb-4">
							<div>{formatDate(post.created)}</div>
						</div>
					</a>
				{/each}

				<a href="/product-design" class="btn btn-ghost ml-auto normal-case">
					See more Design Projects
				</a>
			</div> -->
		</div>
		<!--          web-->
		<div class="w-full">
			<div bind:this={tiltWeb}>
				<!-- <a href="/web"> -->
				<img
					class="w-full
            transition duration-500
            border-opacity-0 hover:border-opacity-100 border-b-4 border-primary
            "
					src="$lib/assets/images/web.svg"
					alt="UX Button"
				/>
				<!-- </a> -->
			</div>

			<!-- <div class="flex flex-col mt-20 gap-8">
				{#each webs as post}
					<a
						href={post.path}
						class="bg-base-100 rounded flex flex-col gap-2
              border-opacity-0 hover:border-opacity-100 border-b-4 border-primary shadow
              hover:bg-base-200 hover:bg-opacity-30
              transition ease-in-out hover:shadow-xl transform duration-300 hover:scale-105"
					>
						<img src={post.image} class="h-40 object-cover rounded-t" alt="post image" />
						<div class="text-2xl font-medium px-2">
							{post.title}
						</div>
						<div class="1-4 text-sm text-base-content text-opacity-70 px-2 pb-4">
							<div>{formatDate(post.created)}</div>
						</div>
					</a>
				{/each}

				<a href="/web" class="btn btn-ghost ml-auto normal-case"> Read more Web Engineering </a>
			</div> -->
		</div>
		<!-- </div> -->
	</div>
	<div class="container mx-auto mt-10">
		<a class="hover:text-primary" href="work">See Latest work</a> |
		<a class="hover:text-primary" href="three">3D Experiments</a> |
		<a class="hover:text-primary" href="about">About</a>
	</div>
</div>

<style>
	a.glow {
		transition: text-shadow 200ms ease;
	}

	a.glow:hover {
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

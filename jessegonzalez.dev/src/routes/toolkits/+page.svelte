<script>
	import cube3d from './camera-controls/3d-cube.gif';
	import wordpress from './wordpress.webp';
	import nebula from './nebula.gif';
	import world from './world.gif';
	import gis from './gis/images/maps-cover.webp';
	import mdsvex from './mdsvex/mdsvex.avif';
	// Icons
	import CarbonBot from '~icons/carbon/bot';
	import IconAccountBox from '~icons/mdi/account-box';
	import CarbonFingerprintRecognition from '~icons/carbon/fingerprint-recognition';
	import CarbonLogoGithub from '~icons/carbon/logo-github';
	import Carousel from '$lib/components/ui/Carousel.svelte';
	import Autocomplete from '$lib/components/ui/Autocomplete.svelte';
	import LoginButton from '$lib/components/Login/LoginButton.svelte';
	import NativeFileApi from '$lib/components/ui/NativeFileApi.svelte';
	import TimeLine from '$lib/components/TimeLine.svelte';
	import Sortable from '$lib/components/sortable/Sortable.svelte';
	import SendEmail from '$lib/components/emails/SendEmail.svelte';
	import TiltContent from '$components/TiltContent.svelte';
</script>

<div class="container mx-auto p-3">
	<h1 class="text-2xl font-bold">Toolkits & Playground LAB</h1>
	<!-- These are my 3D work, playgrounds, and code snippets. -->
	<p class="prose mt-4">
		This is my digital sandbox and toolkit where I sculpt, stitch, and bring pixels to life. Have a
		play and let me know what you think. I'm always looking for new ways to push the boundaries.
	</p>

	<div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div class="rounded border border-base-300 p-4">
			<h2 class="text-2xl font-bold">📙 Top Svelte Kit</h2>
			Full stack SvelteKit template for several databases and frameworks:
			<div class="mt-4 flex gap-4">
				<a
					class="btn btn-outline !no-underline"
					target="_blank"
					href="https://github.com/ctwhome/top-frameworks"
				>
					<CarbonLogoGithub class="mr-2" />
					Full Stack Templates
				</a>
				<a
					class="btn btn-primary !no-underline"
					target="_blank"
					href="https://top-svelte.vercel.app"
				>
					Top Svelte Demo
				</a>
			</div>
		</div>

		<div class="rounded border border-base-300 p-4">
			<h2 class="text-2xl font-bold">Ctw-kit</h2>
			Components and utilities for Svelte and TailwindCSS (DaisyUI) npm:
			<span class="language-bash whitespace-nowrap rounded-lg bg-base-200 p-2 text-primary">
				bun add ctw-kit
			</span>
			<div class="mt-4">
				<a class="btn btn-primary !no-underline" href="/ctw-kit">Ctw-kit Components</a>
			</div>
		</div>
	</div>

	<h2 class="mt-20 text-2xl font-bold">Svelte Components</h2>
	<p class="opacity-80">
		All examples are made with standard HTML API's and Svelte and TailwindCSS (DaisyUI)
	</p>
	<div class="mt-10 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
		<div class="rounded border border-base-300 p-2">
			<Carousel />
		</div>
		<div class="rounded border border-base-300 p-2">
			<NativeFileApi />
		</div>
		<div class="rounded border border-base-300 p-2">
			<Autocomplete />
		</div>

		<div class="rounded border border-base-300 p-2">
			<TimeLine />
		</div>
		<div class="rounded border border-base-300 p-2">
			Login Button with social providers
			<div class="mb-4" />
			<LoginButton />
		</div>

		<div class="rounded border border-base-300 p-2">
			Example Markdown pages with interactive components
			<a href="/toolkits/mdsvex" class="btn mt-4">MDsveX Full Example</a>
		</div>
		<div class="rounded border border-base-300 p-2">
			Drag and drop with SortableJS
			<Sortable />
		</div>

		<!-- in put name and email and sent PUT /endpoints/email -->
		<div class="rounded border border-base-300 p-2">
			<p class="mb-4">Send Email</p>
			<SendEmail />
		</div>
		<TiltContent>
			<div class="rounded border border-base-300 p-2">
				<p class="mb-4">Tilting Content</p>
				<div class="h-32 text-xl">Block</div>
			</div>
		</TiltContent>
	</div>

	<h2 class="mt-20 text-2xl font-bold">3D Playground</h2>
	<div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		<!-- Nebula  -->
		<a href="/3d/nebula/index.html" data-sveltekit-preload-data data-sveltekit-reload>
			<div
				class="card border border-transparent bg-base-200 bg-opacity-50 shadow transition hover:border-primary hover:shadow-2xl"
			>
				<!-- <figure><img src="/images/3d-cube.gif" alt="3D example" /></figure> -->
				<figure>
					<img src={nebula} alt="3D example" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">3D Nebula</h2>
					<p class="line-clamp-2">And artistic representation of a space Nebula</p>
					<div class="card-actions justify-end">
						<button class="btn btn-outline" data-sveltekit-reload data-sveltekit-preload-data>
							Open
						</button>
					</div>
				</div>
			</div>
		</a>
		<!-- Camera Controls -->
		<a href="/toolkits/camera-controls">
			<div
				class="card border border-transparent bg-base-200 bg-opacity-50 shadow transition hover:border-primary hover:shadow-2xl"
			>
				<!-- <figure><img src="/images/3d-cube.gif" alt="3D example" /></figure> -->
				<figure>
					<img
						src="https://cdn.dribbble.com/users/281953/screenshots/14185638/media/cee0cae52e27109df7eeaeb281e65911.gif"
						alt="3D example"
					/>
				</figure>
				<div class="card-body">
					<h2 class="card-title">ThreeJS Camera Controls</h2>
					<p class="line-clamp-2">Running app with ThreeJS and Advance Camera Controls</p>
					<div class="card-actions justify-end">
						<button class="btn btn-outline" data-sveltekit-reload data-sveltekit-preload-data>
							Open
						</button>
					</div>
				</div>
			</div>
		</a>
		<!-- Orthographic camera with pan an zoom -->
		<a href="/toolkits/three-camera-controls">
			<div
				class="card border border-transparent bg-base-200 bg-opacity-50 shadow transition hover:border-primary hover:shadow-2xl"
			>
				<!-- <figure><img src="/images/3d-cube.gif" alt="3D example" /></figure> -->
				<figure>
					<img
						src="https://cdn.dribbble.com/users/281953/screenshots/14185638/media/cee0cae52e27109df7eeaeb281e65911.gif"
						alt="3D example"
						class="-hue-rotate-90 filter"
					/>
				</figure>
				<div class="card-body">
					<h2 class="card-title">Orthographic Camera</h2>
					<p class="line-clamp-2">Orthographic camera with pan an zoom</p>
					<div class="card-actions justify-end">
						<button class="btn btn-outline" data-sveltekit-reload data-sveltekit-preload-data>
							Open
						</button>
					</div>
				</div>
			</div>
		</a>
	</div>

	<!-- 3D Word Dots -->
	<!-- <a href="/3d/world-dots/index.html">
			<div
			class="card bg-base-200 shadow hover:shadow-2xl border border-transparent hover:border-primary transition"
			>
			<figure>
				<img src={world} alt="3D example" />
			</figure>
			<div class="card-body">
				<h2 class="card-title">Animated World Dots</h2>
				<p>ThreeJS world dots with location labels</p>
				<div class="card-actions justify-end">
					<button class="btn btn-outline" data-sveltekit-reload data-sveltekit-preload-data>
						Open
					</button>
				</div>
			</div>
		</div>
	</a> -->

	<h2 class="mt-20 text-2xl font-bold">Tools and Libraries included here</h2>
	<div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		<!-- Icons -->
		<div class="rounded border border-base-300 p-2">
			<div class="text-sm">
				🤹 Any icon sets ~150 sets with over 200,000 icons, logos, emojis, etc. <br />
				Powered by Iconify, with auto install. Using Iconify and
				<a href="https://icones.js.org/">Icones App</a>
				to find a place icons.
			</div>
			<div class="mt-4 flex">
				<CarbonBot class="text-2xl text-primary" />
				<CarbonFingerprintRecognition class="text-2xl text-secondary" />
				<IconAccountBox class="text-content text-2xl" />
			</div>
		</div>
	</div>

	<h2 class="mt-20 text-2xl font-bold">Framework</h2>
	<div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		<a href="/toolkits/wordpress">
			<div
				class="card border border-transparent bg-base-200 bg-opacity-50 shadow transition hover:border-primary hover:shadow-2xl"
			>
				<figure>
					<img src={wordpress} class="aspect-video object-cover" alt="3D example" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">Headless WordPress CMS</h2>
					<p class="line-clamp-2 text-sm">
						Portfolio implementation with complete renderization from WordPress as a CMS
					</p>
					<div class="card-actions justify-end">
						<button class="btn btn-outline" data-sveltekit-reload data-sveltekit-preload-data>
							Open
						</button>
					</div>
				</div>
			</div>
		</a>

		<a href="/toolkits/gis">
			<div
				class="card border border-transparent bg-base-200 bg-opacity-50 shadow transition hover:border-primary hover:shadow-2xl"
			>
				<figure>
					<img src={gis} class="aspect-video object-cover" alt="GIS Example" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">GIS Experiments</h2>
					<p class="line-clamp-2 text-sm">Mapping and GIS</p>
					<div class="card-actions justify-end">
						<button class="btn btn-outline" data-sveltekit-reload data-sveltekit-preload-data>
							Open
						</button>
					</div>
				</div>
			</div>
		</a>

		<a href="/toolkits/mdsvex">
			<div
				class="card border border-transparent bg-base-200 bg-opacity-50 shadow transition hover:border-primary hover:shadow-2xl"
			>
				<figure>
					<img src={mdsvex} class="aspect-video object-cover" alt="GIS Example" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">MDsveX</h2>
					<p class="line-clamp-2 text-sm">Full example with custom components</p>
					<div class="card-actions justify-end">
						<button class="btn btn-outline" data-sveltekit-reload data-sveltekit-preload-data>
							Open
						</button>
					</div>
				</div>
			</div>
		</a>
	</div>
</div>

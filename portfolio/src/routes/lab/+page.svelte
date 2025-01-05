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
	import Carousel from '$lib/components/ui/Carousel.svelte';
	import Autocomplete from '$lib/components/ui/Autocomplete.svelte';
	import LoginButton from '$lib/components/Login/LoginButton.svelte';
	import NativeFileApi from '$lib/components/ui/NativeFileApi.svelte';
	import TimeLine from '$components/TimeLine.svelte';
	import Sortable from '$components/sortable/Sortable.svelte';
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
	<br />
	<p>All examples are made with standard HTML API's and Svelte and TailwindCSS (DaisyUI)</p>

	<h2 class="mt-20 text-2xl font-bold">Ctw-kit</h2>
	Components and utilities for Svelte and TailwindCSS (DaisyUI) npm:
	<span class=" bg-base-200 rounded-lg p-2">
		<code class="language-bash">bun add ctw-kit</code>
	</span>
	<div class="mt-4">
		<a class="btn" href="/ctw-kit">Ctw-kit Components</a>
	</div>

	<h2 class="mt-20 text-2xl font-bold">Svelte Components</h2>
	<div class="mt-10 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
		<div class="border-base-300 rounded border p-2">
			<Carousel />
		</div>
		<div class="border-base-300 rounded border p-2">
			<NativeFileApi />
		</div>
		<div class="border-base-300 rounded border p-2">
			<Autocomplete />
		</div>

		<div class="border-base-300 rounded border p-2">
			<TimeLine />
		</div>
		<div class="border-base-300 rounded border p-2">
			Login Button with social providers
			<div class="mb-4" />
			<LoginButton />
		</div>

		<div class="border-base-300 rounded border p-2">
			Example Markdown pages with interactive components
			<a href="/lab/mdsvex" class="btn mt-4">MDsveX Full Example</a>
		</div>
		<div class="border-base-300 rounded border p-2">
			Drag and drop with SortableJS
			<Sortable />
		</div>

		<!-- in put name and email and sent PUT /endpoints/email -->
		<div class="border-base-300 rounded border p-2">
			<p class="mb-4">Send Email</p>
			<SendEmail />
		</div>
		<TiltContent>
			<div class="border-base-300 rounded border p-2">
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
				class="card bg-base-200 hover:border-primary border border-transparent bg-opacity-50 shadow transition hover:shadow-2xl"
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
		<a href="/lab/camera-controls">
			<div
				class="card bg-base-200 hover:border-primary border border-transparent bg-opacity-50 shadow transition hover:shadow-2xl"
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
		<a href="/lab/three-camera-controls">
			<div
				class="card bg-base-200 hover:border-primary border border-transparent bg-opacity-50 shadow transition hover:shadow-2xl"
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
		<div class="border-base-300 rounded border p-2">
			<div class="text-sm">
				🤹 Any icon sets ~150 sets with over 200,000 icons, logos, emojis, etc. <br />
				Powered by Iconify, with auto install. Using Iconify and
				<a href="https://icones.js.org/">Icones App</a>
				to find a place icons.
			</div>
			<div class="mt-4 flex">
				<CarbonBot class="text-primary text-2xl" />
				<CarbonFingerprintRecognition class="text-secondary text-2xl" />
				<IconAccountBox class="text-content text-2xl" />
			</div>
		</div>
	</div>

	<h2 class="mt-20 text-2xl font-bold">Framework</h2>
	<div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		<a href="/lab/wordpress">
			<div
				class="card bg-base-200 hover:border-primary border border-transparent bg-opacity-50 shadow transition hover:shadow-2xl"
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

		<a href="/lab/gis">
			<div
				class="card bg-base-200 hover:border-primary border border-transparent bg-opacity-50 shadow transition hover:shadow-2xl"
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

		<a href="/lab/mdsvex">
			<div
				class="card bg-base-200 hover:border-primary border border-transparent bg-opacity-50 shadow transition hover:shadow-2xl"
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

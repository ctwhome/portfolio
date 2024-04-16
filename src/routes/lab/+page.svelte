<script>
	import cube3d from './camera-controls/3d-cube.gif';
	import wordpress from './wordpress.webp';
	import nebula from './nebula.gif';
	import world from './world.gif';

	// Icons
	import CarbonBot from '~icons/carbon/bot';
	import IconAccountBox from '~icons/mdi/account-box';
	import CarbonFingerprintRecognition from '~icons/carbon/fingerprint-recognition';
	import Carousel from '$lib/components/ui/Carousel.svelte';
	import Autocomplete from '$lib/components/ui/Autocomplete.svelte';
	import LoginButton from '$lib/components/Login/LoginButton.svelte';
	import NativeFileApi from '$lib/components/ui/NativeFileApi.svelte';
</script>

<div class="container mx-auto p-3">
	<h1 class="text-2xl font-bold">Toolkits & Playground LAB</h1>
	<!-- These are my 3D work, playgrounds, and code snippets. -->
	<p class="prose mt-4">
		This is my digital sandbox and toolkit where I sculpt, stitch, and bring pixels to life. So,
		take a peek, have a play, and let me know what you think. I'm always looking for new ways to
		push the boundaries.
	</p>

	<h2 class="mt-10 text-2xl font-bold">Framework</h2>
	<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
		<a href="/lab/wordpress">
			<div
				class="card bg-base-200 shadow hover:shadow-2xl border border-transparent hover:border-primary transition"
			>
				<figure>
					<img src={wordpress} alt="3D example" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">Headless WordPress CMS</h2>
					<p>Portfolio implementation with complete renderization from WordPress as a CMS</p>
					<div class="card-actions justify-end">
						<button class="btn btn-outline" data-sveltekit-reload data-sveltekit-preload-data>
							Open
						</button>
					</div>
				</div>
			</div>
		</a>

		<!-- Autocomplete -->

		<!-- <Autocomplete /> -->
	</div>

	<h2 class="mt-10 text-2xl font-bold">3D Playground</h2>
	<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
		<!-- Nebula  -->
		<a href="/3d/nebula/index.html" data-sveltekit-preload-data data-sveltekit-reload>
			<div
				class="card bg-base-200 shadow hover:shadow-2xl border border-transparent hover:border-primary transition"
			>
				<!-- <figure><img src="/images/3d-cube.gif" alt="3D example" /></figure> -->
				<figure>
					<img src={nebula} alt="3D example" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">3D Nebula</h2>
					<p>And artistic representation of a space Nebula</p>
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
				class="card bg-base-200 shadow hover:shadow-2xl border border-transparent hover:border-primary transition"
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
					<p>Running app with ThreeJS and Advance Camera Controls</p>
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
				class="card bg-base-200 shadow hover:shadow-2xl border border-transparent hover:border-primary transition"
			>
				<!-- <figure><img src="/images/3d-cube.gif" alt="3D example" /></figure> -->
				<figure>
					<img
						src="https://cdn.dribbble.com/users/281953/screenshots/14185638/media/cee0cae52e27109df7eeaeb281e65911.gif"
						alt="3D example"
						class="filter -hue-rotate-90"
					/>
				</figure>
				<div class="card-body">
					<h2 class="card-title">Orthographic Camera</h2>
					<p>Orthographic camera with pan an zoom</p>
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

	<h2 class="mt-10 text-2xl font-bold">Svelte Components</h2>
	<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
		<div>
			<div>
				🤹 Any icon sets ~150 popular sets with over 200,000 icons, logos, emojis, etc. <br />
				Powered by Iconify. with auto install. Using Iconify and
				<a href="https://icones.js.org/">Icones App</a> to find a place icons.
			</div>
			<div class="flex">
				<CarbonBot class="text-primary text-2xl" />
				<CarbonFingerprintRecognition class="text-secondary text-2xl" />
				<IconAccountBox class="text-content text-2xl" />
			</div>
		</div>
		<Autocomplete />
		<Carousel />
		<div>
			Login Button with social providers
			<LoginButton />
		</div>

		<NativeFileApi />
	</div>
</div>
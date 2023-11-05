<script>
	import cube3d from './camera-controls/3d-cube.gif';
	import nebula from './nebula.gif';
	import world from './world.gif';
</script>

<div class="container mx-auto p-3">
	<h1 class="text-2xl font-bold">3D Work - Examples and Playground</h1>
	<!-- These are my 3D work, playgrounds, and code snippets. -->
	<p class="prose mt-4">
		This is my digital sandbox where I sculpt, stitch, and bring pixels to life. Think of this space
		as a gallery-meets-playground, where my 3D creations frolic in the wild. From quirky code
		snippets to full-blown digital dioramas, it's all about crafting visuals that pop out of your
		screen and (almost) into your lap. So, take a peek, have a play, and let's revel in the art of
		the third dimension together!
	</p>

	<h2 class="mt-10 text-lg">Playground</h2>
	<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
		<!-- Camera Controls -->
		<a href="/3d/camera-controls">
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
	</div>

	<h2 class="mt-10 text-lg">3D Examples</h2>

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

		<!-- 3D Word Dots -->
		<a href="/3d/world-dots/index.html">
			<div
				class="card bg-base-200 shadow hover:shadow-2xl border border-transparent hover:border-primary transition"
			>
				<!-- <figure><img src="/images/3d-cube.gif" alt="3D example" /></figure> -->
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
		</a>
	</div>
</div>

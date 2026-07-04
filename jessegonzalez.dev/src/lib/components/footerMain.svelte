<script>
	import Socialicons from '$lib/components/si.svelte';
	let className = undefined;
	export { className as class };
</script>

<section class={' ' + className}>
	<!-- Simplified gradient stripe -->
	<div class="h-1 w-full bg-gradient-to-r from-primary/60 via-secondary/60 to-primary/60" />

	<div class="container flex-wrap flex items-center mx-auto px-4 py-8">
		<div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 text-base-content text-opacity-70">
			<div class="flex flex-col gap-2">
				<span class="text-xl font-bold">
					Jesse<span class="text-primary">.</span>Gonzalez
				</span>
				<span class="text-sm opacity-70">Building, learning, sharing.</span>
			</div>
		</div>

		<div class="flex flex-col sm:flex-row mx-auto sm:mr-0 mt-6 sm:mt-0 gap-6 sm:gap-10 items-start sm:items-center">
			<div class="flex gap-6 text-sm">
				<a href="/work" class="hover:text-primary opacity-70 hover:opacity-100 transition-colors">Work</a>
				<a href="/work?category=Digital+Garden" class="hover:text-primary opacity-70 hover:opacity-100 transition-colors">Garden</a>
				<a href="/about" class="hover:text-primary opacity-70 hover:opacity-100 transition-colors">About</a>
			</div>
			<div class="flex items-center gap-4">
				<a
					href="https://ctw.studio"
					target="_blank"
					rel="noopener"
					class="text-sm font-medium bg-base-200 hover:bg-primary hover:text-primary-content px-3 py-1.5 rounded-full transition-colors"
				>
					Professional work &rarr;
				</a>
				<Socialicons />
			</div>
		</div>
	</div>

	<div class="text-center text-xs opacity-50 pb-4">
		&copy; {new Date().getFullYear()} Jesse Gonzalez &middot; Amsterdam, Netherlands
	</div>
</section>

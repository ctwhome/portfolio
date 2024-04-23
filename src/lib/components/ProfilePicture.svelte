<script>
	import ctwhomeProfile from '$lib/assets/images/ctwhome-profile.webp';
</script>

<!-- Profile picture -->
<a href="/about" class="flex items-center gap-3 decoration-transparent hover:decoration-primary">
	<img
		width="60"
		id="cover"
		height="60"
		class="mask mask-hexagon my-2"
		src={ctwhomeProfile}
		alt="J. Gonzalez Ctwhome profile picture"
	/>
	<div>
		<div class="font-bold">J. Gonzalez - Ctw</div>
		<div class="opacity-60">Product Designer & Research Software Engineer</div>
	</div>
</a>

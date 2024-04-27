<script>
	import ctwhomeProfile from '$lib/assets/images/ctwhome-profile.webp';
	export let subtitle = 'Product Designer & Research Software Engineer';
</script>

<!-- Profile picture -->
<a
	href="/about"
	class="flex items-center gap-3 decoration-transparent hover:decoration-primary border border-base-200 p-2 rounded-lg"
>
	<img
		id="cover"
		width="40"
		height="40"
		class="mask mask-hexagon my-2"
		src={ctwhomeProfile}
		alt="J. Gonzalez Ctwhome profile picture"
	/>
	<div>
		<div class="font-bold">J. Gonzalez - Ctw</div>
		<div class="opacity-60 text-sm">{subtitle}</div>
	</div>
</a>

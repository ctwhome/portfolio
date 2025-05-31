<script>
	import ctwhomeProfile from '$lib/assets/images/ctwhome-profile.webp';
	export let subtitle = 'Product Designer & Research Software Engineer';
</script>

<!-- Profile picture -->
<a
	href="/"
	class="flex items-center gap-3 rounded-lg border border-base-200 p-2 decoration-transparent hover:decoration-primary"
>
	<img
		id="cover"
		width="40"
		height="40"
		class="mask mask-hexagon my-2"
		src={ctwhomeProfile}
		alt="J. Gonzalez Ctwhome profile picture"
		draggable="false"
	/>
	<div>
		<div class="font-bold">Jesse Gonzalez - Ctw</div>
		<div class="text-sm opacity-60">{subtitle}</div>
	</div>
</a>

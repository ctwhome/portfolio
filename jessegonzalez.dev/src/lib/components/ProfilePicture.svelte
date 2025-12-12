<script>
	import ctwhomeProfile from '$lib/assets/images/ctwhome-profile.webp';

	export let subtitle = 'Building, learning, sharing';
	export let isDigitalGarden = false;
	export let createdDate = '';
	export let updatedDate = '';
	export let maturity = '';

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	$: displaySubtitle = isDigitalGarden && maturity ?
		`${maturity === 'seeding' ? '🌱' : maturity === 'growing' ? '🌿' : '🌳'} ${maturity} · planted ${formatDate(createdDate)}${updatedDate && updatedDate !== createdDate ? ` · updated ${formatDate(updatedDate)}` : ''}` :
		subtitle;
</script>

<!-- Profile picture -->
<div>
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
			alt="Jesse Gonzalez profile picture"
			draggable="false"
		/>
		<div>
			<div class="font-bold">Jesse Gonzalez</div>
			<div class="text-sm opacity-60">{displaySubtitle}</div>
		</div>
	</a>
</div>

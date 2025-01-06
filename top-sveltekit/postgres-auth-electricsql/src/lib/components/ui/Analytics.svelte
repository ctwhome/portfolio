<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';

	const MEASUREMENT_ID = 'G-DHQ2TX1XM1';
	run(() => {
		if (typeof gtag !== 'undefined') {
			gtag('config', 'G-DHQ2TX1XM1', {
				page_title: document.title,
				page_path: $page.url.pathname
			});
		}
	});
</script>

<svelte:head>
	<script async src={`https://www.googletagmanager.com/gtag/js?id=G-DHQ2TX1XM1`}>
	</script>
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', 'G-DHQ2TX1XM1');
	</script>
</svelte:head>

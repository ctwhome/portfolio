<script lang="ts">
	import { page } from '$app/stores';

	const MEASUREMENT_ID = 'G-DHQ2TX1XM1';
	$: {
		if (typeof gtag !== 'undefined' && $page?.url?.pathname) {
			gtag('config', 'G-DHQ2TX1XM1', {
				page_title: document.title,
				page_path: $page.url.pathname
			});
		}
	}
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

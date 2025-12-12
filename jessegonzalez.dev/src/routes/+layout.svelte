<script>
	import '$lib/assets/css/app.css';
	import '$lib/assets/css/code-highlighted-prisma.css';
	import FooterMain from '$lib/components/footerMain.svelte';
	import Header from '$lib/components/Header.svelte';
	import Analytics from '$lib/components/Analytics.svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	injectSpeedInsights();

	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/service-worker.js')
				.then(reg => console.log('Service worker registered:', reg))
				.catch(err => console.error('Service worker registration failed:', err));
		});
	}
</script>

<Analytics />

<svelte:head>
	<title>Jesse Gonzalez - Building, learning, sharing</title>
</svelte:head>

<div class="flex h-screen flex-col">
	<!-- <header-main /> -->
	<Header />
	<div class="flex-1">
		<!-- todo: this doens't work -->
		<slot>
			<!-- Content here -->
		</slot>
	</div>
	<FooterMain class="mt-10" />
</div>

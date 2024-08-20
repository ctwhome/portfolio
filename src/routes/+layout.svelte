<script>
	import '$lib/assets/css/app.css';
	import '$lib/assets/css/code-highlighted-prisma.css';
	import FooterMain from '$lib/components/footerMain.svelte';
	import Header from '$lib/components/Header.svelte';
	import Analytics from '$lib/components/Analytics.svelte';
</script>

<Analytics />

<svelte:head>
	<title>Ctwhome Portfolio</title>
</svelte:head>

<div class="flex flex-col h-screen">
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

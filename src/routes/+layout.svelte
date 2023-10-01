<script>
	import '$lib/assets/css/app.css';
	import FooterMain from '$lib/components/FooterMain.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

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


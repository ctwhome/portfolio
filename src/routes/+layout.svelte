<script>
	import '$lib/assets/css/app.css';
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
</div>

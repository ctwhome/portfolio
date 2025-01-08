<script lang="ts">
	import { run } from 'svelte/legacy';

	import { Toaster } from 'svelte-french-toast';
	import { toastStore } from '$lib/stores/toast.store';

	// Subscribe to the toast store to trigger updates
	run(() => {
		$toastStore;
	});
</script>

<Toaster
	position="bottom-center"
	gutter={8}
	toastOptions={{
		style: 'background: rgba(40, 40, 40, 0.9); color: #FFF; font-weight: 500;'
	}}
/>

<style>
	:global(.toaster) {
		margin-top: 60px;
	}
</style>

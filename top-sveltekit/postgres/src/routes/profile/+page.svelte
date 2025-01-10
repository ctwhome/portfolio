<script>
	import UserInfo from './UserInfo.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	onMount(async () => {
		// Fetch the API key from the server when the component mounts
		const response = await fetch('/api/user/api-key');
		const data = await response.json();
	});
</script>

<div class="container mx-auto">
	{#if $page.data.session}
		<UserInfo />

		{#if dev}
			<pre>{JSON.stringify($page.data.session, null, 2)}</pre>
		{/if}
	{:else}
		Not logged in
	{/if}
</div>

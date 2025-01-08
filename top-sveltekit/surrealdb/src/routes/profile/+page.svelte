<script>
	import UserInfo from './UserInfo.svelte';

	import { page } from '$app/stores';

	import { onMount } from 'svelte';

	let apiKey = $state('');

	onMount(async () => {
		// Fetch the API key from the server when the component mounts
		const response = await fetch('/api/user/api-key');
		const data = await response.json();
		apiKey = data.apiKey || '';
	});
</script>

<div class="container mx-auto">
	{#if $page.data.session}
		<UserInfo />
		<pre>{JSON.stringify($page.data.session, null, 2)}</pre>
	{:else}
		Not logged in
	{/if}
</div>

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

	async function saveApiKey() {
		// Save the API key to the server
		const response = await fetch('/api/user/api-key', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ apiKey })
		});

		if (response.ok) {
			alert('API key saved successfully');
		} else {
			alert('Failed to save API key');
		}
	}
</script>

<div class="container mx-auto">
	{#if $page.data.session}
		<UserInfo />

		<div class="join mt-6">
			<input
				type="text"
				class="input input-bordered join-item"
				name="apiKey"
				id="apiKey"
				bind:value={apiKey}
				placeholder="Enter your OpenAI API key"
			/>
			<button class="btn join-item" onclick={saveApiKey}>Save</button>
		</div>
	{:else}
		Not logged in
	{/if}
</div>

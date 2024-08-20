<script lang="ts">
	import IcRoundCheck from '~icons/ic/round-check';

	let name: string = '';
	let email: string = '';
	let success: boolean = false;

	async function handleSubmit() {
		console.log('🚀 ~ file: SendEmail.svelte ~ line 10 ~ handleSubmit ~ name', name);
		try {
			const response = await fetch('/endpoints/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					name
				})
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			success = true;
			name = '';
			email = '';
		} catch (error) {
			console.error('Error sending email:', error);
		}
	}
</script>

<form class="form-control" on:submit|preventDefault={handleSubmit}>
	<input
		type="text"
		bind:value={name}
		placeholder="Name"
		class="input input-sm input-bordered w-full"
	/>
	<input
		type="email"
		bind:value={email}
		placeholder="Email"
		class="input input-sm input-bordered w-full mt-2"
	/>
	{#if !success}
		<p class="flex gap-2 justify-center mt-3 px-4">
			<IcRoundCheck class="text-success " /> Email sent!
		</p>
	{/if}
	<button class="btn btn-primary mt-4" class:btn-disabled={!email || !name} type="submit">
		Send Email
	</button>
</form>

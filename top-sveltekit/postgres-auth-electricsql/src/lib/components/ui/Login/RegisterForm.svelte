<script lang="ts">
	import PhKeyBold from '~icons/ph/key-bold';

	interface RegisterResponse {
		error?: string;
		user?: {
			id: string;
			email: string;
			name?: string;
		};
	}

	let email = $state('');
	let name = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let success = $state('');

	async function handleRegister() {
		error = '';
		success = '';

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		try {
			console.log('Attempting registration with:', { email, name });

			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password, name })
			});

			const data: RegisterResponse = await response.json();
			console.log('Registration response:', data);

			if (!response.ok) {
				error = data.error || 'Registration failed';
				return;
			}

			success = 'Registration successful! You can now log in.';
			password = '';
			confirmPassword = '';

			// Emit an event to notify parent component
			dispatch('registrationSuccess');
		} catch (e) {
			error = 'An error occurred during registration';
			console.error('Registration error:', e);
		}
	}

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<form class="rounded-box border border-base-300 p-3" on:submit|preventDefault={handleRegister}>
	<div class="form-control">
		<input
			bind:value={name}
			type="text"
			placeholder="Enter your name"
			class="input input-bordered"
			required
			autocomplete="name"
		/>
	</div>

	<div class="form-control mt-3">
		<input
			bind:value={email}
			type="email"
			placeholder="Enter your email"
			class="input input-bordered"
			required
			autocomplete="email"
		/>
	</div>

	<div class="form-control mt-3">
		<input
			bind:value={password}
			type="password"
			placeholder="Create password"
			class="input input-bordered"
			required
			autocomplete="new-password"
			minlength="8"
		/>
	</div>

	<div class="form-control mt-3">
		<input
			bind:value={confirmPassword}
			type="password"
			placeholder="Confirm password"
			class="input input-bordered"
			required
			autocomplete="new-password"
			minlength="8"
		/>
	</div>

	{#if error}
		<div class="alert alert-error mt-2">{error}</div>
	{/if}

	{#if success}
		<div class="alert alert-success mt-2">{success}</div>
	{/if}

	<button type="submit" class="btn btn-outline btn-secondary mt-3 w-full">
		<PhKeyBold class="size-5" />
		Create Account
	</button>
</form>

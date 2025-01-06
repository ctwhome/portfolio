<script lang="ts">
	import PhKeyBold from '~icons/ph/key-bold';
	import { signIn } from '@auth/sveltekit/client';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';

	interface SignInResult {
		ok?: boolean;
		error?: string;
		url?: string;
		status?: number;
	}

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let success = $state('');

	async function handleEmailSignIn() {
		try {
			console.log('Attempting sign in with:', { email });

			// Close the modal before sign in
			const modalCheckbox = document.getElementById('login-modal') as HTMLInputElement;
			if (modalCheckbox) {
				modalCheckbox.checked = false;
			}

			// Let SvelteKit Auth handle the redirect and session update
			const result = await signIn('credentials', {
				email,
				password,
				redirect: true,
				callbackUrl: '/profile'
			});

			// This code won't run due to redirect, but kept for error cases
			if (!result?.ok) {
				error = 'Invalid email or password';
				return;
			}
		} catch (e) {
			error = 'An error occurred during sign in';
			console.error('Sign in error:', e);
		}
	}
</script>

<form class="rounded-box border-base-300 border p-3" on:submit|preventDefault={handleEmailSignIn}>
	<div class="form-control">
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
			placeholder="Enter your password"
			class="input input-bordered"
			required
			autocomplete="current-password"
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
		Sign in with Email
	</button>
</form>

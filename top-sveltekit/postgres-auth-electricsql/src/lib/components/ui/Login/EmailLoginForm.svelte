<script lang="ts">
	import PhKeyBold from '~icons/ph/key-bold';
	import { signIn } from '@auth/sveltekit/client';
	import { goto } from '$app/navigation';

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

			const result = (await signIn('credentials', {
				email,
				password,
				redirect: false,
				callbackUrl: '/profile'
			})) as SignInResult;

			console.log('Sign in result:', result);

			// Check if the result indicates an error
			if (!result?.ok) {
				error = 'Invalid email or password';
				return;
			}

			// If login successful, redirect to profile
			error = '';
			success = 'Login successful! Redirecting...';

			// Add a small delay before redirect to show the success message
			setTimeout(async () => {
				await goto('/profile', { replaceState: true });
			}, 1000);
		} catch (e) {
			error = 'An error occurred during sign in';
			console.error('Sign in error:', e);
		}
	}
</script>

<form class="rounded-box border border-base-300 p-3" on:submit|preventDefault={handleEmailSignIn}>
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

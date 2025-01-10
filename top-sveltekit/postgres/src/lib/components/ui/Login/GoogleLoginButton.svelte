<script lang="ts">
	import BiGoogle from '~icons/bi/google';
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { closeLoginModal, getAuthErrorMessage } from './utils';
	import type { AuthProvider } from './types';

	let isLoading = $state(false);
	let error = $state('');

	async function handleGoogleSignIn() {
		error = '';
		isLoading = true;

		try {
			closeLoginModal();
			await signIn('google' satisfies AuthProvider, {
				callbackUrl: $page.url.pathname,
				redirect: true
			});
		} catch (e) {
			error = getAuthErrorMessage(e);
			console.error('Google sign-in error:', e);
			isLoading = false;
		}
	}
</script>

<div class="space-y-2">
	<button
		type="button"
		class="btn btn-primary w-full"
		onclick={handleGoogleSignIn}
		disabled={isLoading}
		aria-busy={isLoading}
		aria-label="Sign in with Google"
	>
		<BiGoogle />
		<span class="ml-2">{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
	</button>

	{#if error}
		<div class="alert alert-error" role="alert">{error}</div>
	{/if}
</div>

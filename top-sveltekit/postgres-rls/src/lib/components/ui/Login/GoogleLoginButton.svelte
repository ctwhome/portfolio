<script lang="ts">
	import BiGoogle from '~icons/bi/google';
	import { signIn } from '@auth/sveltekit/client';

	async function handleGoogleSignIn() {
		try {
			await signIn('google', {
				callbackUrl: '/profile',
				redirect: true
			});
		} catch (error) {
			console.error('Google sign-in error:', error);
		}
	}
</script>

<button type="button" class="btn btn-primary w-full" on:click={handleGoogleSignIn}>
	<BiGoogle />
	<span class="ml-2">Sign in with Google</span>
</button>

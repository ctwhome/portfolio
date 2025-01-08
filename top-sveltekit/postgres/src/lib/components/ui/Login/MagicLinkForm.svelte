<script lang="ts">
	import MingcuteMailSendLine from '~icons/mingcute/mail-send-line';
	import { signIn } from '@auth/sveltekit/client';

	interface SignInResult {
		ok?: boolean;
		error?: string;
		url?: string;
		status?: number;
	}

	let email = $state('');
	let error = $state('');
	let magicLinkSent = $state(false);

	async function handleMagicLinkSignIn() {
		try {
			const result = (await signIn('resend', {
				email,
				redirect: false,
				callbackUrl: '/profile'
			})) as SignInResult;

			if (result?.ok) {
				magicLinkSent = true;
				error = '';
			} else {
				error = 'Failed to send magic link. Please try again.';
			}
		} catch (e) {
			error = 'An error occurred while sending the magic link';
			console.error('Magic link error:', e);
		}
	}
</script>

<form
	class="rounded-box border border-base-300 p-3"
	on:submit|preventDefault={handleMagicLinkSignIn}
>
	{#if magicLinkSent}
		<div class="alert alert-success">Magic link sent! Please check your email.</div>
	{:else}
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

		{#if error}
			<div class="mt-2 text-error">{error}</div>
		{/if}

		<button type="submit" class="btn btn-outline btn-secondary mt-3 w-full">
			<MingcuteMailSendLine class="size-5" />
			Send Magic Link
		</button>
	{/if}
</form>

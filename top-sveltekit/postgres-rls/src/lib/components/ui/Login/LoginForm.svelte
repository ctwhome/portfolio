<script lang="ts">
	import MingcuteMailSendLine from '~icons/mingcute/mail-send-line';
	import PhKeyBold from '~icons/ph/key-bold';
	import GoogleLoginButton from './GoogleLoginButton.svelte';
	import MagicLinkForm from './MagicLinkForm.svelte';
	import EmailLoginForm from './EmailLoginForm.svelte';
	import RegisterForm from './RegisterForm.svelte';

	let openMagicLink = $state(false);
	let openCredentials = $state(true);
	let isRegistering = $state(false);

	function toggleRegistration() {
		isRegistering = !isRegistering;
	}
</script>

<div>
	<h1 class="mb-5 text-center text-2xl font-bold">
		{isRegistering ? 'Create Account' : 'Login Access'}
	</h1>
	<div class="flex flex-col gap-4 p-5">
		{#if !isRegistering}
			<!-- Google Sign In -->
			<GoogleLoginButton />

			<div class="divider">OR</div>

			<!-- Magic Link Login -->
			<!-- <button
				class="btn btn-outline mt-3 w-full border-base-300"
				class:hidden={openMagicLink}
				on:click={() => (openMagicLink = !openMagicLink)}
			>
				<MingcuteMailSendLine class="size-5" />
				Sign in with Magic Link
			</button>
			{#if openMagicLink}
				<MagicLinkForm />
			{/if} -->
		{/if}

		<!-- Email Form (Login/Register) -->
		<!-- {#if !isRegistering}
			<button
				class="btn btn-outline mt-3 w-full border-base-300"
				on:click={() => (openCredentials = !openCredentials)}
				class:hidden={!openCredentials}
			>
				<PhKeyBold class="size-5" />
				Sign in with Email
			</button>
		{/if} -->

		{#if isRegistering}
			<RegisterForm on:registrationSuccess={() => (isRegistering = false)} />
		{:else}
			<EmailLoginForm />
		{/if}

		<div class="mt-4 text-center">
			{#if isRegistering}
				Already have an account?
				<button type="button" class="link link-primary" on:click={toggleRegistration}>
					Sign in
				</button>
			{:else}
				Don't have an account?
				<button type="button" class="link link-primary" on:click={toggleRegistration}>
					Create one
				</button>
			{/if}
		</div>
	</div>
</div>

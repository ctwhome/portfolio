<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import GoogleLoginButton from '$lib/components/ui/Login/GoogleLoginButton.svelte';
	import EmailLoginForm from '$lib/components/ui/Login/EmailLoginForm.svelte';
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-base-200 p-8 shadow-lg">
		<div class="text-center">
			<h2 class="text-3xl font-bold">Sign in to your account</h2>
			<p class="mt-2 text-sm">Or start your 14-day free trial</p>
		</div>

		<div class="mt-8 space-y-6">
			<div class="space-y-4">
				<GoogleLoginButton />
				<div class="divider">OR</div>
				<EmailLoginForm />
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import type { EmailFormData, SendEmailProps } from "./types";
	// import IcRoundCheck from '~icons/ph/check-circle-fill';

	export let onSuccess: SendEmailProps["onSuccess"] = undefined;
	export let onError: SendEmailProps["onError"] = undefined;

	let formData: EmailFormData = {
		name: "",
		email: "",
	};
	let success: boolean = false;

	async function handleSubmit() {
		console.log(
			"🚀 ~ file: SendEmail.svelte ~ line 10 ~ handleSubmit ~ name",
			formData.name,
		);
		try {
			const response = await fetch("/endpoints/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formData.email,
					name: formData.name,
				}),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			success = true;
			formData = {
				name: "",
				email: "",
			};
			onSuccess?.();
		} catch (error) {
			console.error("Error sending email:", error);
			onError?.(error as Error);
		}
	}
</script>

<form class="form-control" on:submit|preventDefault={handleSubmit}>
	<input
		type="text"
		bind:value={formData.name}
		placeholder="Name"
		class="input input-sm input-bordered w-full"
	/>
	<input
		type="email"
		bind:value={formData.email}
		placeholder="Email"
		class="input input-sm input-bordered mt-2 w-full"
	/>
	{#if success}
		<p class="mt-3 flex justify-center gap-2 px-4">
			<!-- <IcRoundCheck class="text-success " /> Email sent! -->
		</p>
	{/if}
	<button
		class="btn btn-primary mt-4"
		class:btn-disabled={!formData.email || !formData.name}
		type="submit"
	>
		Send Email
	</button>
</form>

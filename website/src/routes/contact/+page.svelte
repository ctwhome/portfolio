<script lang="ts">
	import Mail from '~icons/lucide/mail';
	import Send from '~icons/lucide/send';
	import { enhance } from '$app/forms';

	let sending = false;
	let success = false;
	let error = '';
</script>

<div class="min-h-screen">
	<div class="container mx-auto px-4 py-20">
		<div class="mx-auto max-w-md">
			<div class="mb-8 text-center">
				<h1 class="mb-2 text-4xl font-bold">Contact Me</h1>
				<p class="text-base-content/60">
					Fill out the form below and I'll get back to you as soon as possible.
				</p>
			</div>

			<div
				class="card glass border-primary/20 from-base-100/50 to-base-300/50 border bg-gradient-to-br shadow-xl backdrop-blur"
			>
				<div class="card-body">
					<form
						on:submit|preventDefault={async (e) => {
							sending = true;
							error = '';
							const form = e.currentTarget;
							const formData = new FormData(form);

							try {
								const response = await fetch('/api/contact', {
									method: 'POST',
									body: formData
								});

								if (response.ok) {
									success = true;
									form.reset(); // Clear form inputs on success
								} else {
									const data = await response.json();
									error = data.error || 'Failed to send message. Please try again.';
								}
							} catch (e) {
								error = 'Failed to send message. Please try again.';
							} finally {
								sending = false;
							}
						}}
						class="space-y-4"
					>
						<div class="form-control">
							<label class="label" for="name">
								<span class="label-text">Name</span>
							</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								class="input input-bordered w-full"
								placeholder="Your name"
							/>
						</div>

						<div class="form-control">
							<label class="label" for="email">
								<span class="label-text">Email</span>
							</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								class="input input-bordered w-full"
								placeholder="your@email.com"
							/>
						</div>

						<div class="form-control">
							<label class="label" for="message">
								<span class="label-text">Message</span>
							</label>
							<textarea
								id="message"
								name="message"
								required
								class="textarea textarea-bordered h-32"
								placeholder="Your message"
							></textarea>
						</div>

						{#if error}
							<div class="alert alert-error">
								<span>{error}</span>
							</div>
						{/if}

						{#if success}
							<div class="alert alert-success">
								<Mail class="h-4 w-4" />
								<span>Thank you for reaching out! We'll get back to you as soon as possible.</span>
							</div>
						{:else}
							<button type="submit" class="btn btn-primary w-full" disabled={sending}>
								{#if sending}
									<span class="loading loading-spinner"></span>
									Sending...
								{:else}
									<Send class="h-4 w-4" />
									Send Message
								{/if}
							</button>
						{/if}
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

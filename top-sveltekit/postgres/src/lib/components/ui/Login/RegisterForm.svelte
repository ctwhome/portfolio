<script lang="ts">
	import PhKeyBold from '~icons/ph/key-bold';
	import { createEventDispatcher } from 'svelte';
	import { validateEmail, validatePassword, getAuthErrorMessage } from './utils';
	import type { RegisterResponse } from './types';

	const dispatch = createEventDispatcher<{
		registrationSuccess: void;
	}>();

	let email = $state('');
	let name = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let success = $state('');
	let isLoading = $state(false);

	function validateForm(): string | null {
		const emailError = validateEmail(email);
		if (emailError) return emailError;

		const passwordError = validatePassword(password);
		if (passwordError) return passwordError;

		if (password !== confirmPassword) {
			return 'Passwords do not match';
		}

		if (!name.trim()) {
			return 'Name is required';
		}

		return null;
	}

	async function handleRegister() {
		error = '';
		success = '';
		isLoading = true;

		const validationError = validateForm();
		if (validationError) {
			error = validationError;
			isLoading = false;
			return;
		}

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email.trim(),
					password,
					name: name.trim()
				})
			});

			const data: RegisterResponse = await response.json();

			if (!response.ok) {
				error = data.error || 'Registration failed';
				isLoading = false;
				return;
			}

			success = 'Registration successful! You can now log in.';
			// Clear sensitive data
			password = '';
			confirmPassword = '';
			dispatch('registrationSuccess');
		} catch (e) {
			error = getAuthErrorMessage(e);
			console.error('Registration error:', e);
		} finally {
			isLoading = false;
		}
	}
</script>

<form
	class="rounded-box border border-base-300 p-3"
	onsubmit={(e) => {
		e.preventDefault();
		handleRegister();
	}}
	aria-label="Registration form"
>
	<div class="space-y-3">
		<div class="form-control">
			<label for="register-name" class="sr-only">Name</label>
			<input
				id="register-name"
				bind:value={name}
				type="text"
				placeholder="Enter your name"
				class="input input-bordered"
				required
				autocomplete="name"
				disabled={isLoading}
				aria-invalid={error && !name ? 'true' : undefined}
			/>
		</div>

		<div class="form-control">
			<label for="register-email" class="sr-only">Email</label>
			<input
				id="register-email"
				bind:value={email}
				type="email"
				placeholder="Enter your email"
				class="input input-bordered"
				required
				autocomplete="email"
				disabled={isLoading}
				aria-invalid={error && !validateEmail(email) ? 'true' : undefined}
			/>
		</div>

		<div class="form-control">
			<label for="register-password" class="sr-only">Password</label>
			<input
				id="register-password"
				bind:value={password}
				type="password"
				placeholder="Create password (min. 8 characters)"
				class="input input-bordered"
				required
				autocomplete="new-password"
				minlength="8"
				disabled={isLoading}
				aria-invalid={error && !validatePassword(password) ? 'true' : undefined}
			/>
		</div>

		<div class="form-control">
			<label for="register-confirm-password" class="sr-only">Confirm Password</label>
			<input
				id="register-confirm-password"
				bind:value={confirmPassword}
				type="password"
				placeholder="Confirm password"
				class="input input-bordered"
				required
				autocomplete="new-password"
				minlength="8"
				disabled={isLoading}
				aria-invalid={error && password !== confirmPassword ? 'true' : undefined}
			/>
		</div>

		{#if error}
			<div class="alert alert-error" role="alert">{error}</div>
		{/if}

		{#if success}
			<div class="alert alert-success" role="alert">{success}</div>
		{/if}

		<button
			type="submit"
			class="btn btn-outline btn-secondary w-full"
			disabled={isLoading}
			aria-busy={isLoading}
		>
			<PhKeyBold class="size-5" />
			{isLoading ? 'Creating Account...' : 'Create Account'}
		</button>
	</div>
</form>

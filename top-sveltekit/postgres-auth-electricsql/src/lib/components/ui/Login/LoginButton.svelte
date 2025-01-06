<script lang="ts">
	import { page } from '$app/stores';
	import LoginForm from './LoginForm.svelte';
</script>

<div>
	<!-- Logged in -->
	{#if $page.data.session}
		<div class="dropdown dropdown-end">
			<div
				tabindex="0"
				role="button"
				class="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-base-200 active:scale-95"
			>
				<img
					alt="User avatar"
					class="h-8 w-8 cursor-pointer rounded-full"
					src={$page.data?.session?.user?.image ?? '/images/avatar.webp'}
					referrerpolicy="no-referrer"
				/>
			</div>
			<ul tabindex="0" class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
				<li class="flex gap-2">
					<a href="/profile" class="flex items-center gap-2">Profile</a>
				</li>
				<form action="/auth/signout" method="POST">
					<li class="flex gap-2">
						<button type="submit" class="items-center gap-2">Logout</button>
					</li>
				</form>
			</ul>
		</div>
		<!-- Not logged in-->
	{:else}
		<div>
			<div>
				<label for="login-modal" class="modal-button btn btn-primary btn-md">Login access</label>
				<input id="login-modal" type="checkbox" class="modal-toggle" />
				<div class="modal h-screen">
					<div class="modal-box">
						<LoginForm />

						<div class="modal-action">
							<label for="login-modal" class="btn">Close</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

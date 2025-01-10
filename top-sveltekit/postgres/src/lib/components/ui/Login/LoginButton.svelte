<script lang="ts">
	import { page } from '$app/stores';
	import LoginForm from './LoginForm.svelte';
	import { Role } from '$lib/types';
</script>

<div>
	<!-- Logged in -->
	{#if $page.data.session}
		<div class="dropdown dropdown-end">
			<button
				type="button"
				aria-haspopup="true"
				aria-expanded="false"
				class="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-base-200 active:scale-95"
			>
				<img
					alt="User avatar"
					class="size-8 cursor-pointer rounded-full ring-primary ring-offset-2 ring-offset-base-100"
					class:ring-2={$page.data.session?.user?.roles?.includes(Role.ADMIN)}
					src={$page.data?.session?.user?.image ?? '/images/profile.avif'}
					referrerpolicy="no-referrer"
					on:error={(e: Event) => {
						if (e.target instanceof HTMLImageElement) {
							console.error('Image failed to load:', e.target.src);
							e.target.onerror = null; // Prevent infinite loop
							e.target.src = '/images/profile.avif';
						}
					}}
				/>
			</button>
			<ul class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow" role="menu">
				<li class="flex gap-2">
					<a href="/profile" class="flex items-center gap-2">Profile</a>
				</li>
				{#if $page.data.session?.user?.roles?.includes(Role.ADMIN)}
					<li class="flex gap-2">
						<a
							href="/admin"
							class="hover:text-primary-focus flex items-center gap-2 font-medium text-primary"
						>
							<span class="rounded-md bg-primary/10 p-1">Admin Panel</span>
						</a>
					</li>
				{/if}
				<div class="divider my-0"></div>
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

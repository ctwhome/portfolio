<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import UserCircle from '~icons/heroicons/user-circle';

	interface User {
		id: number;
		email: string;
		name: string | null;
		roles: string[];
	}

	let users: User[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/admin/users');
			if (!response.ok) throw new Error('Failed to fetch users');
			users = await response.json();
		} catch (e: unknown) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		} finally {
			loading = false;
		}
	});
</script>

<div class="container mx-auto p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">User Management</h1>
		<div class="badge badge-primary">{users.length} Users</div>
	</div>

	{#if loading}
		<div class="flex justify-center">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<span>{error}</span>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table-zebra table w-full">
				<thead>
					<tr>
						<th>ID</th>
						<th>User</th>
						<th>Email</th>
						<th>Roles</th>
					</tr>
				</thead>
				<tbody>
					{#each users as user (user.id)}
						<tr class="hover">
							<td>{user.id}</td>
							<td class="flex items-center gap-2">
								<UserCircle class="h-6 w-6" />
								{user.name || 'No name'}
							</td>
							<td>{user.email}</td>
							<td>
								<div class="flex flex-wrap gap-1">
									{#each user.roles.filter(Boolean) as role}
										<div class="badge badge-outline">{role}</div>
									{/each}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

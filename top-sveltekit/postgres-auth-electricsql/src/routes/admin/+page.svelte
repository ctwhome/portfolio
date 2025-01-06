<script lang="ts">
	import { onMount } from 'svelte';
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
	import { Role } from '$lib/types';
	let availableRoles = [Role.USER, Role.ADMIN];

	async function updateUserRole(userId: number, role: string, currentRoles: string[]) {
		try {
			const response = await fetch(`/api/admin/users/${userId}/roles`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ role, action: currentRoles.includes(role) ? 'remove' : 'add' })
			});

			if (!response.ok) throw new Error('Failed to update user role');

			// Refresh user list
			const usersResponse = await fetch('/api/admin/users');
			if (!usersResponse.ok) throw new Error('Failed to fetch users');
			users = await usersResponse.json();
		} catch (e: unknown) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		}
	}

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
								<select
									class="select select-bordered w-full max-w-xs"
									value={user.roles[0] || Role.USER}
									on:change={async (e) => {
										const newRole = e.currentTarget.value;
										const currentRole = user.roles[0] || 'user';

										try {
											if (newRole === Role.USER) {
												// Just remove admin role, no need to add 'user'
												if (currentRole === Role.ADMIN) {
													await updateUserRole(user.id, Role.ADMIN, user.roles);
												}
											} else {
												// Adding admin role
												await updateUserRole(user.id, newRole, []);
											}
										} catch (err) {
											// Revert select value on error
											e.currentTarget.value = currentRole;
											error = err instanceof Error ? err.message : 'Failed to update role';
										}
									}}
								>
									{#each availableRoles as role}
										<option value={role}>{role}</option>
									{/each}
								</select>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

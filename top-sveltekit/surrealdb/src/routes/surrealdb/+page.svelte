<script lang="ts">
	import { onMount } from 'svelte';
	import Surreal from 'surrealdb';
	import AlertCircle from '~icons/lucide/alert-circle';
	import Loader2 from '~icons/lucide/loader-2';
	import { page } from '$app/stores';

	let records: any[] = [];
	let error: string | null = null;
	let isLoading = true;

	onMount(async () => {
		try {
			if (!$page.data.session?.user) {
				error = 'Please login to view records';
				isLoading = false;
				return;
			}

			console.log('Creating Surreal instance...');
			const db = new Surreal();

			console.log('Connecting to database...');
			await db.connect(
				'https://civil-gazelle-069peoc69hv4j55gh62p9e1r40.aws-euw1.surreal.cloud/rpc'
			);
			console.log('Connected successfully');

			console.log('Setting namespace and database...');
			await db.use({ namespace: 'kit', database: 'surrealdb' });

			console.log('Session data:', $page.data.session);
			console.log('Authenticating with session token...');
			const token = $page.data.session?.token;
			if (!token) {
				console.error('No token in session:', $page.data.session);
				throw new Error('No authentication token found');
			}
			console.log('Using token:', token.substring(0, 20) + '...');
			await db.authenticate(token);
			console.log('Authentication successful');

			console.log('Testing database access...');
			const info = await db.query('INFO FOR DB');
			console.log('Database info:', info);

			console.log('Fetching records...');
			const result = await db.select<any>('info');
			console.log('Query result:', result);
			records = Array.isArray(result) ? result : [];

			isLoading = false;
		} catch (err) {
			console.error('Error:', err);
			error = err instanceof Error ? err.message : 'Failed to connect';
			isLoading = false;
		}
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">SurrealDB Records</h1>
	<pre>{JSON.stringify($page.data.session?.user, null, 2)}</pre>
	{#if error}
		<div class="alert alert-error mb-4">
			<AlertCircle />
			<span>{error}</span>
		</div>
	{/if}

	{#if isLoading}
		<div class="flex items-center justify-center">
			<Loader2 class="h-8 w-8 animate-spin" />
		</div>
	{:else if !$page.data.session?.user}
		<div class="alert alert-warning">
			<AlertCircle />
			<span>Please login to view records</span>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Data</th>
					</tr>
				</thead>
				<tbody>
					{#if records && records.length > 0}
						{#each records as record}
							<tr class="hover">
								<td>{record.id}</td>
								<td>
									<pre class="whitespace-pre-wrap rounded-lg bg-base-200 p-2">{JSON.stringify(
											record,
											null,
											2
										)}</pre>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="2" class="py-4 text-center">No records found</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	{/if}
</div>

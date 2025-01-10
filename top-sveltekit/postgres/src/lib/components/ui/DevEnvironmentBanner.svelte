<script lang="ts">
	import { dev } from '$app/environment';
	import {
		PUBLIC_DB_HOST,
		PUBLIC_DB_PORT,
		PUBLIC_DB_USER,
		PUBLIC_DB_NAME
	} from '$env/static/public';
	import Database from '~icons/lucide/database';
	import Server from '~icons/lucide/server';
	import User from '~icons/lucide/user';
</script>

{#if dev}
	<div
		class="fixed bottom-0 left-0 w-full bg-warning px-4 py-2 text-xs text-warning-content shadow-lg"
	>
		<div class="flex items-center justify-start gap-6">
			<div class="flex items-center gap-1">
				<span class="font-semibold">Development Environment</span>
			</div>
			<div class="flex items-center gap-1">
				<Server class="size-4" />
				<span>
					{dev ? PUBLIC_DB_HOST : 'localhost'}:{dev ? PUBLIC_DB_PORT : '5432'}
				</span>
			</div>
			<div class="flex items-center gap-1">
				<User class="size-4" />
				<span>{dev ? PUBLIC_DB_USER : 'postgres'}</span>
			</div>
			<div class="flex items-center gap-1">
				<Database class="size-4" />
				<span>{dev ? PUBLIC_DB_NAME : 'postgres'}</span>
			</div>
		</div>
	</div>
{/if}

<script lang="ts">
	import '$lib/assets/css/app.css';
	import '$lib/assets/css/code-highlighted-prisma.css';
	import Header from '$components/ui/Header.svelte';
	import Analytics from '$components/ui/Analytics.svelte';
	import SideMenu from '$components/ui/SideMenu.svelte';
	import GlobalToast from '$components/ui/GlobalToast.svelte';
	import { env } from '$env/dynamic/public';
	import FooterMain from '$components/ui/footerMain.svelte';
	import Database from '~icons/lucide/database';
	import Server from '~icons/lucide/server';
	import User from '~icons/lucide/user';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Analytics />
<GlobalToast />

<div
	class="relative grid h-dvh w-dvw grid-rows-[auto_auto_1fr] overflow-hidden sm:grid-rows-[auto_1fr]"
>
	<Header />
	<SideMenu />
	{#if children}
		{@render children()}
	{:else}
		<!-- Content here -->
	{/if}
	<FooterMain />
	<!-- Display a ribbon if the app is running with a local database -->
	{#if env.PUBLIC_LOCALHOST}
		<div
			class="fixed bottom-0 left-0 w-full bg-warning px-4 py-2 text-xs text-warning-content shadow-lg"
		>
			<div class="flex items-center justify-start gap-6">
				<div class="flex items-center gap-1">
					<span class="font-semibold">DEV</span>
				</div>
				<div class="flex items-center gap-1">
					<Server class="h-4 w-4" />
					<span>{env.PUBLIC_DB_HOST || 'localhost'}:{env.PUBLIC_DB_PORT || '5432'}</span>
				</div>
				<div class="flex items-center gap-1">
					<User class="h-4 w-4" />
					<span>{env.PUBLIC_DB_USER || 'postgres'}</span>
				</div>
				<div class="flex items-center gap-1">
					<Database class="h-4 w-4" />
					<span>{env.PUBLIC_DB_NAME || 'postgres'}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

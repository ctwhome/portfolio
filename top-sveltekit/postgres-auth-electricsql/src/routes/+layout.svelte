<script lang="ts">
	import '$lib/assets/css/app.css';
	import '$lib/assets/css/code-highlighted-prisma.css';
	import Header from '$components/ui/Header.svelte';
	import Analytics from '$components/ui/Analytics.svelte';
	import SideMenu from '$components/ui/SideMenu.svelte';
	import GlobalToast from '$components/ui/GlobalToast.svelte';
	import { env } from '$env/dynamic/public';
	import FooterMain from '$components/ui/footerMain.svelte';
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
	{#if env.PUBLIC_LOCALHOST}
		<div class="fixed bottom-0 left-0 w-full bg-warning pl-4 text-xs text-warning-content">
			dev database
		</div>
	{/if}
</div>

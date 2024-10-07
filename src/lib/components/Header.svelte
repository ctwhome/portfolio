<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// import SocialIcons from './SocialIcons.svelte';
	// import HeaderResponsiveMenu from './HeaderResponsiveMenu.svelte';
	// import { Link } from 'svelte-routing';
	// import { get } from 'svelte/store';
	// import { tilt } from '../../stores/tilt.js';
	// import menuItems from '$lib/models/menu-itmes.js';
	import logo from '$lib/assets/images/logo.svg';
	import DaisyUIThemeSwitcher from '$lib/components/themeChamge/DaisyUIThemeSwitcher.svelte';
	import { onMount } from 'svelte';
	let active = 'Latest Work';

	let activeCategory = '';
	let activeTag = '';

	$: {
		if (browser) {
			activeCategory = $page.url.searchParams.get('category');
			activeTag = $page.url.searchParams.get('tag');
		}
	}
	onMount(() => {
		activeCategory = $page.url.searchParams.get('category') || '';
		activeTag = $page.url.searchParams.get('tag') || '';
	});

	const links = [
		{
			title: 'Project',
			path: '/work?category=Project',
			displayTitle: 'Projects'
		},
		{
			title: 'Blog',
			path: '/work?category=Blog',
			displayTitle: 'Engineering Blog'
		},
		{
			title: 'Digital Garden',
			path: '/work?category=Digital Garden',
			displayTitle: 'Digital Garden'
		},
		// {
		// 	title: 'Latest Work',
		// 	path: '/work',
		// 	displayTitle: 'Latest Work'
		// },
		{
			title: 'Lab',
			path: '/lab',
			displayTitle: 'Lab'
		},
		{
			title: 'About',
			path: '/about',
			displayTitle: 'About me'
		}
	];
</script>

<nav class="bien-nav mb-10 px-2">
	<div class="bien-glass" />
	<div class="bien-glass-edge" />
	<div class="relative container mx-auto py-2">
		<!--Desktop Header-->
		<header class="flex items-center gap-3">
			<a class="flex-initial mr-3" href="/">
				<img
					src={logo}
					alt="Logo asset"
					class="max-w-[8rem] sm:max-w-[10rem] h-auto no-drag select-none"
				/>
			</a>
			<!-- menu-->

			<!-- Mobile -->
			<div class="z-10 dropdown flex justify-end flex-1 lg:hidden">
				<div tabindex="0" role="button" class="btn m-1">{active}</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
				>
					{#each links as link}
						<li>
							<a
								class="menu-link"
								on:click={() => (active = link.title)}
								class:active={activeCategory === link.title}
								href={link.path}
							>
								{link.displayTitle}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<!-- Desktop -->
			<div class="z-10 flex-1 space-x-4 lg:space-x-8 w-full justify-end hidden lg:flex">
				<!-- <a class="menu-link" href="/about">About <span class="hidden sm:inline">me</span></a> -->
				{#each links as link}
					<a
						class="menu-link"
						on:click={() => (active = link.title)}
						class:active={activeCategory === link.title}
						href={link.path}
					>
						{link.displayTitle}
					</a>
				{/each}
			</div>

			<DaisyUIThemeSwitcher class="z-50 ml-auto sm:ml-14 " />
		</header>
	</div>
</nav>

<!-- <nav class="bien-nav">
	<div class="bien-glass"></div>
	<div class="bien-glass-edge"></div>
</nav>
 -->
<style lang="postcss">
	.menu-link {
		@apply text-base-content text-opacity-80 hover:text-opacity-100 font-medium transition hover:text-secondary;
	}

	.menu-link.active {
		@apply text-primary;
		/*transform:  scale(0.9, 0.9);*/
	}

	/* Frosted navigation header */
	nav {
		z-index: 10000;
		position: sticky;
		left: 0;
		right: 0;
		top: 0;
		/* height: 100px; */
	}

	/* Frosted Navigation bar */
	.bien-glass {
		position: absolute;
		inset: 0;
		/*   Extend the backdrop to the bottom for it to "collect the light" outside of the nav */
		--extended-by: 100px;
		bottom: calc(-1 * var(--extended-by));

		--filter: blur(30px);
		-webkit-backdrop-filter: var(--filter);
		backdrop-filter: var(--filter);
		pointer-events: none;

		/*   Cut the part of the backdrop that falls outside of <nav /> */
		--cutoff: calc(100% - var(--extended-by));
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 0,
			black var(--cutoff),
			transparent var(--cutoff)
		);
	}

	.bien-glass-edge {
		position: absolute;
		z-index: -1;
		left: 0;
		right: 0;

		--extended-by: 80px;
		--offset: 20px;
		--thickness: 2px;
		height: calc(var(--extended-by) + var(--offset));
		/*   Offset is used to snuck the border backdrop slightly under the main backdrop for  smoother effect */
		top: calc(100% - var(--offset) + var(--thickness));

		/*   Make the blur bigger so that the light bleed effect spreads wider than blur on the first backdrop */
		/*   Increase saturation and brightness to fake smooth chamfered edge reflections */
		--filter: blur(90px) saturate(160%) brightness(1.3);
		-webkit-backdrop-filter: var(--filter);
		backdrop-filter: var(--filter);
		pointer-events: none;

		-webkit-mask-image: linear-gradient(
			to bottom,
			black 0,
			black var(--offset),
			transparent var(--offset)
		);
	}
</style>

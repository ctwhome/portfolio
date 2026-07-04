<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { ThemeChange } from 'ctw-kit';
	import { onMount } from 'svelte';

	let active = 'Work';
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
			title: 'Work',
			path: '/work?category=Project',
			displayTitle: 'Work'
		},
		{
			title: 'Digital Garden',
			path: '/work?category=Digital+Garden',
			displayTitle: 'Garden'
		},
		{
			title: 'Blog',
			path: '/work?category=Blog',
			displayTitle: 'Blog'
		},
		{
			title: 'Toolkits',
			path: '/toolkits',
			displayTitle: 'Toolkits'
		},
		{
			title: 'About',
			path: '/about',
			displayTitle: 'About'
		}
	];
</script>

<nav class="bien-nav z-10 mb-10 px-2">
	<div class="bien-glass" />
	<div class="bien-glass-edge" />
	<div class="container relative mx-auto py-2">
		<!--Desktop Header-->
		<header class="flex items-center gap-3">
			<a class="mr-3 flex-initial group" href="/">
				<span class="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
					Jesse<span class="text-primary">.</span>Gonzalez
				</span>
			</a>
			<!-- menu-->

			<!-- Mobile -->
			<div class="dropdown z-10 flex flex-1 justify-end lg:hidden">
				<div tabindex="0" role="button" class="btn m-1">{active}</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
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
					<li class="mt-2 pt-2 border-t border-base-200">
						<a
							href="https://ctw.studio"
							target="_blank"
							rel="noopener"
							class="btn btn-sm btn-primary !no-underline"
						>
							CTW Studio
						</a>
					</li>
				</ul>
			</div>
			<!-- Desktop -->
			<div class="z-10 hidden w-full flex-1 justify-end space-x-4 lg:flex lg:space-x-8">
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
				<a
					href="https://ctw.studio"
					target="_blank"
					rel="noopener"
					class="btn btn-sm btn-primary !no-underline"
				>
					CTW Studio
				</a>
			</div>

			<ThemeChange class="z-50 ml-auto sm:ml-4" />
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
		@apply font-medium text-base-content text-opacity-80 transition hover:text-secondary hover:text-opacity-100;
	}

	.menu-link.active {
		@apply text-primary;
		/*transform:  scale(0.9, 0.9);*/
	}

	/* Frosted navigation header */
	nav {
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

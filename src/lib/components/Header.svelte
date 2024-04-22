<script>
	import { page } from '$app/stores';
	// import SocialIcons from './SocialIcons.svelte';
	// import HeaderResponsiveMenu from './HeaderResponsiveMenu.svelte';
	// import { Link } from 'svelte-routing';
	// import { get } from 'svelte/store';
	// import { tilt } from '../../stores/tilt.js';
	// import menuItems from '$lib/models/menu-itmes.js';
	import DaisyUIThemeSwitcher from '$lib/components/themeChamge/DaisyUIThemeSwitcher.svelte';
</script>

<nav class="bien-nav mb-10">
	<div class="bien-glass" />
	<div class="bien-glass-edge" />
	<div class="relative container mx-auto -mt-4 py-2">
		<!--Mobile header -->
		<!--      Inside the sidebar-->
		<!-- <HeaderResponsiveMenu ref="menu" class="relative">
    <div class="p-6">
      <Link href="/" on:click|native={() => $refs.menu.close()}>
        <img src="$lib/assets/images/logo.svg" class="mx-3 mt-1" width="100%" height="100%" alt="Logo Ctwhome website">
      </Link>
      <div class="mt-10 ">
        {#each menu.items as item (item.path)}
        <Link class="menu-link sm:text-lg  hover:text-primary transition" href={item.path} on:click|native={() => $refs.menu.close()}>
          {{ item.title }}
        </Link>
        {/each}
      </div>
    </div>
    <SocialIcons class="mt-32 pl-6" />
  </HeaderResponsiveMenu> -->
		<div class="mt-4 flex flex-wrap justify-center items-center">
			<!-- {#each menu.items as item (item.path)}
    <Link class="menu-link font-medium  text-sm sm:text-lg hover:text-primary transition" href={item.path}>
      {{ item.title }}
    </Link>
    {/each} -->
		</div>
		<!--Desktop Header-->

		<header class="flex items-center gap-3">
			<a class="flex-initial mr-3 my-1" href="/">
				<img
					src="$lib/assets/images/logo.svg"
					alt="Logo asset"
					class="max-w-[180px] h-auto aspect-4 sm:aspect-3 no-drag select-none"
				/>
			</a>
			<!-- menu-->
			<div class="z-10 flex-1 flex space-x-4 lg:space-x-8 w-full justify-end">
				<!-- <a class="menu-link" href="/about">About <span class="hidden sm:inline">me</span></a> -->
				<a class="menu-link" class:active={$page.route.id?.includes('/blog')} href="/blog"
					>New Blog (WIP)</a
				>
				<a class="menu-link" class:active={$page.route.id?.includes('/posts')} href="/posts">Blog</a
				>
				<a class="menu-link" class:active={$page.route.id?.includes('/work')} href="/work">
					<span class="hidden">Latest </span>Work
				</a>
				<a class="menu-link" class:active={$page.route.id?.includes('/lab')} href="/lab">Lab</a>
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

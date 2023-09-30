<!-- FILEPATH: /Users/ctw/Sites/github/portfolio/nuxt/components/header/HeaderMain.svelte -->
<script>
  import { onMount } from 'svelte';
  import SocialIcons from './SocialIcons.svelte';
  import HeaderResponsiveMenu from './HeaderResponsiveMenu.svelte';
  import { Link } from 'svelte-routing';
  import { get } from 'svelte/store';
  import { tilt } from '../../stores/tilt.js';
  import { menuItems } from '../../stores/menuItems.js';

  let menu = get(menuItems);

  onMount(async () => {
    menu = await menuItems.fetch();
  });
</script>

<div class="relative container mx-auto">
  <!--Mobile header -->
  <HeaderResponsiveMenu ref="menu" class="relative">
    <!--      Inside the sidebar-->
    <div class="p-6">
      <Link to="/" on:click|native={() => $refs.menu.close()}>
        <img src="~/assets/logo.svg" class="mx-3 mt-1" width="100%" height="100%" alt="Logo Ctwhome website">
      </Link>
      <div class="mt-10 ">
        {#each menu.items as item (item.path)}
        <Link class="menu-link sm:text-lg  hover:text-primary transition" to={item.path} on:click|native={() => $refs.menu.close()}>
          {{ item.title }}
        </Link>
        {/each}
      </div>
    </div>
    <SocialIcons class="mt-32 pl-6" />
  </HeaderResponsiveMenu>
  <div class="mt-4 sm:hidden flex flex-wrap justify-center items-center space-x-2 space-x-4">
    {#each menu.items as item (item.path)}
    <Link class="menu-link font-medium  text-sm sm:text-lg hover:text-primary transition" to={item.path}>
      {{ item.title }}
    </Link>
    {/each}
  </div>
  <!--Desktop Header-->
  <header class="flex items-center pt-2">
    <Link class="flex-initial hidden sm:block mr-3 my-1" to="/">
      <img src="~/assets/logo.svg" alt="Logo asset">
    </Link>

    <!-- menu-->
    <div class="flex-1 hidden sm:flex space-x-4 lg:space-x-8 w-full justify-end ">
      {#each menu.items as item (item.path)}
      <Link class="text-base-content text-opacity-80 hove:text-opacity-100 menu-link font-medium font-title text-sm md:text-md lg:text-lg hover:text-primary transition" to={item.path}>
        {{ item.title }}
      </Link>
      {/each}
    </div>

    <daisyui-theme-switcher class="ml-auto hidden sm:block sm:ml-14 " />
  </header>
</div>

<style>
  .menu-link.active {
    @apply text-primary;
    /*transform:  scale(0.9, 0.9);*/
  }
</style>

<template>
  <div class="relative container mx-auto">
    <!--Mobile header -->
    <header-responsive-menu ref="menu" class="relative">
      <!--      Inside the sidebar-->
      <div class="p-6">
        <NuxtLink to="/" @click.native="$refs.menu.close">
          <img src="~/assets/logo.svg" class="mx-3 mt-1">
        </NuxtLink>
        <div class="mt-10 ">
          <div v-for="item in menu.items" :key="item.path" class="mt-3">
            <nuxt-link class="menu-link sm:text-lg  hover:text-primary transition" :to="item.path" @click.native="$refs.menu.close" @click="$refs.menu.close()">
              {{ item.title }}
            </nuxt-link>
          </div>
        </div>
      </div>
      <social-icons class="mt-32 pl-6" />
    </header-responsive-menu>
    <div class="mt-4 sm:hidden flex flex-wrap justify-center items-center space-x-2 space-x-4">
      <div v-for="item in menu.items" :key="item.path">
        <nuxt-link class="menu-link font-medium  text-sm sm:text-lg hover:text-primary transition" :to="item.path">
          {{ item.title }}
        </nuxt-link>
      </div>
    </div>
    <!--Desktop Header-->
    <header class="flex items-center pt-2">
      <NuxtLink v-tilt="tilt" class="flex-initial hidden sm:block mr-3 my-1" to="/">
        <img src="~/assets/logo.svg">
      </NuxtLink>

      <!-- menu-->
      <div
        class="flex-1 hidden sm:flex space-x-4 lg:space-x-8 w-full justify-end "
      >
        <nuxt-link
          v-for="item in menu.items"
          :key="item.path"
          class="text-base-content text-opacity-80 hove:text-opacity-100 menu-link font-medium
                    font-title text-sm md:text-md lg:text-lg hover:text-primary transition
"
          :to="item.path"
        >
          {{ item.title }}
        </nuxt-link>
      </div>

      <daisyui-theme-switcher class="ml-auto hidden sm:block sm:ml-14 " />
    </header>
  </div>
</template>
<script>

export default {
  data () {
    return {
      menu: [],
      tilt: {
        reverse: true, // reverse the tilt direction
        max: 25, // max tilt rotation (degrees)
        perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1, // 2 = 200%, 1.5 = 150%, etc..
        speed: 2000, // Speed of the enter/exit transition
        transition: true, // Set a transition on enter/exit.
        axis: null, // What axis should be disabled. Can be X or Y.
        reset: true, // If the tilt effect has to be reset on exit.
        easing: 'cubic-bezier(.03,.98,.52,.99)', // Easing on enter/exit.
        glare: false, // if it should have a "glare" effect
        'max-glare': 1, // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
        'glare-prerender': false // false = VanillaTilt creates the glare elements for you, otherwise
        // you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
      }
    }
  },
  async fetch () {
    this.menu = await this.$content('menu-items').fetch()
  }
}
</script>
<style scoped>
.menu-link.active{
  @apply text-primary
}
</style>

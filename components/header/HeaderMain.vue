<template>
  <div class="relative container mx-auto">
    <header-responsive-menu ref="menu">
      <div class="p-6">
        <NuxtLink to="/" @click.native="$refs.menu.close">
          <Logo class="mx-3 mt-1" />
        </NuxtLink>
        <div class="mt-10">
          <div v-for="item in menu.items" :key="item.path" class="mt-3">
            <nuxt-link class="menu-link sm:text-lg  hover:text-primary transition" :to="item.path" @click.native="$refs.menu.close" @click="$refs.menu.close()">
              {{ item.title }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </header-responsive-menu>
    <header class="flex justify-around items-center pt-2">
      <NuxtLink v-tilt="tilt" class="hidden sm:block" to="/">
        <Logo class="mx-3 mt-1" />
      </NuxtLink>

      <!-- menu-->
      <div
        class="hidden sm:flex ml-auto sm:items-center space-x-2 sm:space-x-8"
      >
        <div v-for="item in menu.items" :key="item.path">
          <nuxt-link class="text-base-content text-opacity-80 hove:text-opacity-100 menu-link font-medium font-title text-sm sm:text-lg hover:text-primary transition" :to="item.path">
            {{ item.title }}
          </nuxt-link>
        </div>
      </div>

      <daisyui-theme-switcher class="ml-auto sm:ml-14 " />
    </header>
    <div
      class="sm:hidden flex flex-grow items-center space-x-2 space-x-6 mx-auto"
    >
      <div v-for="item in menu.items" :key="item.path">
        <nuxt-link class="menu-link font-medium  text-sm sm:text-lg hover:text-primary transition" :to="item.path">
          {{ item.title }}
        </nuxt-link>
      </div>
    </div>
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

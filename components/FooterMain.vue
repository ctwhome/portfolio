<template>
  <section class="">
    <div class="flex w-full">
      <div class="w-1/3 flex">
        <div class="w-1/3 py-0 h-1" style="background: #456563;" />
        <div class="w-1/3 py-0 h-1" style="background: #5A877E;" />
        <div class="w-1/3 py-0 h-1" style="background: #FDC343;" />
      </div>
      <div class="w-1/3 flex">
        <div class="w-1/3 py-0 h-1" style="background: #E99877;" />
        <div class="w-1/3 py-0 h-1" style="background: #A4574E;" />
        <div class="w-1/3 py-0 h-1" style="background: #FDC343;" />
      </div>
      <div class="w-1/3 flex">
        <div class="w-1/3 py-0 h-1" style="background: #456563;" />
        <div class="w-1/3 py-0 h-1" style="background: #5A877E;" />
        <div class="w-1/3 py-0 h-1" style="background: #FDC343;" />
      </div>
    </div>
    <div class="container mx-auto px-4">
      <div class="pt-6">
        <div class="relative lg:pb-2 mb-2 flex flex-wrap ">
          <p class="w-full lg:w-auto text-opacity-70 text-base-content text-sm text-center lg:text-left order-last lg:order-first ">
            © {{ new Date().getFullYear() }} Jos Gonzalez
          </p>
          <!--          <div-->
          <!--            class="mx-auto"-->
          <!--          >-->
          <!--            <nuxt-link to="/pages/terms" class="mr-6 text-sm text-gray-400 hover:text-gray-300">-->
          <!--              Terms of Service-->
          <!--            </nuxt-link>-->
          <!--            <nuxt-link to="/pages/privacy" class="mr-6 text-sm text-gray-400 hover:text-gray-300">-->
          <!--              Police Privacy-->
          <!--            </nuxt-link>-->
          <!--          </div>-->

          <div class="ml-auto">
            <social-icons />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

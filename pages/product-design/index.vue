<template>
  <div class="flex flex-col px-4">
    <div class="container mx-auto h-full px-4">
      <div class="flex flex-col md:flex-row justify-center gap-10 mt-10">
        <img src="~/assets/product-design.svg" alt="">
        <div>
          <p class="prose mt-4">
            Product design blends user needs with goals to help organizations make
            consistently successful projects, optimizing the user experience to create products fair and sustainable for the longer term.
            <br><br>
            <span class="italic">“If you think good design is expensive, you should look at the cost of bad design.”</span>
            <br>
            — Dr. Ralf Speth, CEO of Jaguar Land Rover
          </p>
        </div>
      </div>

      <blog-list class="mt-10" :posts="posts" more-button="View more Articles" />
    </div>
    <footer-main class="mt-30" />
  </div>
</template>

<script>
export default {
  transition: 'fade',
  async asyncData ({ $content, params }) {
    // blog list
    const posts = await $content('product-design')
      .sortBy('date', 'desc')
      .fetch()
    return {
      posts
    }
  },
  methods: {
    formatDate (date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    }
  }
}
</script>

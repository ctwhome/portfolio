<template>
  <div class="flex flex-col px-4">
    <div class="container mx-auto h-full">
      <div class="flex flex-col md:flex-row justify-center gap-10 mt-10">
        <img class="-mt-12" src="~/assets/digital-garden.svg" alt="">
        <div>
          <p class="prose mt-4">
            A consistently tended collection of half-baked notes, research, and sketches.
            <br>
            Public learning.
            <br><br>
            <span class="italic">“Learning is taking action and seeing what happens.”</span>
            <br>
            — Seth Godin
          </p>
        </div>
      </div>
      <blog-list :posts="posts" more-button="View more Articles" />
    </div>
  </div>
</template>

<script>
export default {
  transition: 'fade',
  async asyncData ({ $content, params }) {
    // blog list
    const posts = await $content('digital-garden')
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

<style scoped>

</style>

<template>
  <div class="flex flex-col px-4">
    <div class="container mx-auto h-full">
      <div class="flex flex-col md:flex-row justify-center gap-10 mt-10">
        <img src="~/assets/web.svg" alt="">
        <div>
          <p class="prose mt-4">
            Web engineering focuses on the methodologies, techniques, and tools that are the foundation of Web application development and which support their <strong>design, development, evolution, and evaluation</strong>.
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
    const posts = await $content('web')
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

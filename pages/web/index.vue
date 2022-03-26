<template>
  <div class="flex flex-col px-4 ">
    <div class="h-full container mx-auto mt-10">
      <!--Header section-->
      <div class="flex flex-col md:flex-row gap-10 mt-10">
        <img class="-mt-12" src="~/assets/web.svg" alt="">
        <div class="text-xl text-base-content text-opacity-90">
          <p class=" mt-4">
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
      .sortBy('created', 'desc')
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

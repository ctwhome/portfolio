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
      <div class="flex gap-4">
        <div
          v-for="(item,index) in tags"
          :key="index"
          :class="{ 'bg-primary': currentTags && currentTags.includes(item) }"
          class="
          rounded p-1 transition duration-500 bg-opacity-40
          hover:bg-primary hover:bg-opacity-50 hover:text-base-content hover:cursor-pointer
          "
          @click="toggleTag(item)"
        >
          #{{ item }}
        </div>
      </div>

      <blog-list :posts="posts" more-button="View more Articles" :show-image="false" />
    </div>
    <footer-main class="mt-30" />
  </div>
</template>

<script>
import flattenTags from '~/utils/flattenTags'
export default {
  transition: 'fade',
  data () {
    return {
      currentTags: [],
      posts: [],
      tags: []
    }
  },

  async fetch () {
    // post list
    this.tags = flattenTags(await this.$content('digital-garden').only('tags').fetch())
    this.posts = await this.$content('digital-garden')
      .where({ tags: { $contains: this.$route.query.tag || [] } })
      .sortBy('date', 'desc')
      .fetch()
  },

  mounted () {
    // Filter the tags!
    // console.log('entras', this.$route.query.tag)
    this.currentTags = this.$route.query.tag
  },
  methods: {
    toggleTag (item) {
      // const currentTags = this.$route.query.tags ? this.$route.query.tags + '+' + item : item

      const currentTags = this.$route.query.tag
      const newTags = []
      // Populate current tags
      if (currentTags) {
        Array.isArray(currentTags)
          ? currentTags.map(tag => newTags.push(tag))
          : newTags.push(currentTags)
      }
      // find if the selected tag is already in use
      const index = newTags.findIndex(i => i === item)
      // add or remove the selected tag to the current tags
      if (index === -1) {
        newTags.push(item)
      } else {
        newTags.splice(index, 1)
      }
      this.currentTags = newTags
      // this.$router.push({ query: { tags: currentTagss + item } })
      // if tag in active, remove it, if not, add it
      this.$router.push({ path: 'digital-garden', query: { tag: newTags } })
      this.$fetch()
    },
    formatDate (date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    }
  }
}
</script>

<style scoped>

</style>

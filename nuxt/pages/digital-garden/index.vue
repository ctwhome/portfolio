<template>
  <div class="flex flex-col px-4 ">
    <div class="h-full container mx-auto">
      <!--Header section-->
      <div class="flex flex-col md:flex-row gap-10 mt-10">
        <img class="-mt-12" src="~/assets/digital-garden.svg" alt="digital garden image">
        <div class="text-xl text-base-content text-opacity-90">
          <p class=" mt-4">
            A consistently tended collection of half-baked notes, research, and sketches.
            <br>
            Public learning.
            <br><br>
            <span class="text-sm italic">“Learning is taking action and seeing what happens.”
              <br>
              — Seth Godin
            </span>
          </p>
        </div>
      </div>
      <!--Filters-->
      <div class="flex mt-10">
        <!-- Tags-->
        <div class="flex flex-wrap gap-3">
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

        <!-- Status-->
        <div class="flex flex-wrap gap-3 ml-auto">
          <div
            v-for="(item,key) in StatusEnum"
            :key="key"
            :class="{'bg-primary':status ===key }"
            class="
                  rounded py-1 px-2 transition duration-500 bg-opacity-60
                  hover:bg-primary hover:bg-opacity-50 hover:text-base-content hover:cursor-pointer
                  "
            @click="changeStatus(key)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <blog-list :posts="posts" more-button="View more Articles" :show-image="false" :show-tags="true" class="mt-10" />
    </div>
    <footer-main class="mt-30" />
  </div>
</template>

<script>
import flattenTags from '~/utils/flattenTags'
import StatusEnum from '~/models/status-enum'

export default {
  transition: 'fade',
  setup () {
    return {
      StatusEnum
    }
  },
  data () {
    return {
      currentTags: [],
      posts: [],
      tags: [],
      status: null
    }
  },

  async fetch () {
    // post list
    this.tags = flattenTags(await this.$content('digital-garden').only('tags').fetch())
    const where = {}
    if (this.$route.query.status) {
      where.status = { $eq: Number(this.$route.query.status) }
    }
    if (this.$route.query.tag) {
      where.tags = { $contains: this.$route.query.tag }
    }
    this.posts = await this.$content('digital-garden')
      .where(where)
      .sortBy('created', 'desc')
      .fetch()
  },

  mounted () {
    // Filter the tags!
    this.currentTags = this.$route.query.tag
    this.status = this.$route.query.status
  },
  methods: {
    changeStatus (status) {
      this.status = status === this.status ? null : status
      this.$router.push({ path: 'digital-garden', query: { tag: this.$route.query.tag, status: this.status } })
      this.$fetch()
    },
    toggleTag (item) {
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
      this.$router.push({ path: 'digital-garden', query: { tag: newTags, status: this.$route.query.status } })
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

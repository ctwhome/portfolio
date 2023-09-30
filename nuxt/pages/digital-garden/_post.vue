<template>
  <div class="flex flex-col">
    <div class="h-full p-6 mx-auto mt-10 sm:mt-20 prose lg:prose-xl ">
      <h1 class=" font-bold text-4xl sm:text-6xl">
        {{ post.title }}
      </h1>
      <div
        class="flex gap-4 items-center my-6 sm:my-16 pt-4
                text-sm text-base-content text-opacity-70
                border-t border-opacity-25"
      >
        <div class="w-2/3">
          <span class="text-primary mr-4">{{ StatusEnum[post.status] }}</span>
          Planted {{ formatDate(post.created) }} - Last Tended {{ formatDate(post.updated) }}
        </div>
        <div class="flex flex-wrap gap-x-3 w-1/3">
          <div
            v-for="(item,index) in post.tags"
            :key="index"
            class="
                  rounded p-1 transition duration-500 bg-opacity-40
                  hover:bg-primary hover:bg-opacity-50 hover:text-base-content hover:cursor-pointer
                  "
            @click="goToTag(item)"
          >
            #{{ item }}
          </div>
        </div>
      </div>

      <!-- table of contents -->
      <table-of-contents :toc="post.toc" />
      <!-- content from markdown -->
      <nuxt-content :document="post" class=" " />
      <!-- prevNext component -->
      <PrevNext :prev="prev" :next="next" class="mt-20" />
    </div>
    <footer-main class="mt-32" />
  </div>
</template>
<script>
import StatusEnum from '~/models/status-enum'

export default {
  transition: 'fade',
  setup () {
    return {
      StatusEnum
    }
  },
  async asyncData ({ $content, params }) {
    const post = await $content('digital-garden', params.post).fetch()
    const [prev, next] = await $content('digital-garden')
      .only(['title', 'post'])
      .sortBy('created', 'desc')
      .surround(params.post)
      .fetch()
    return {
      post,
      prev,
      next
    }
  },
  methods: {
    goToTag (tag) {
      this.$router.push({ path: '/digital-garden', query: { tag, status: this.$route.query.status } })
    },
    formatDate (date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    }
  }
}
</script>

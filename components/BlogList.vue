<template>
  <div class="container mx-auto px-4">
    <div class="mb-6 flex flex-wrap gap-5 w-full">
      <nuxt-link
        v-for="(post,index) in posts"
        :key="index"
        :to="post.path"
        class=" max-w-xs w-full shadow h-full
                rounded overflow-hidden transition shadow hover:shadow-lg
        "
      >
        <img v-if="showImage" class="w-full max-h-36 lg:h-30 rounded-t object-cover" :src="post.image" :alt="post.title">
        <div
          class="py-2 px-3 rounded-b bg-base-200 bg-opacity-40
                transition duration-500
                border-opacity-0 hover:border-opacity-100 border-b-4 border-primary"
        >
          <h2 class="my-2 text-xl font-bold ">
            {{ post.title }}
          </h2>
          <div v-if="showTags" class="flex flex-wrap gap-2 text-opacity-60">
            <small v-for="(tag,i) in post.tags" :key="i">#{{ tag }}</small>
          </div>
          <div class="mt-6 flex text-xs text-base-content text-opacity-60 border-t border-white border-opacity-5 pt-2">
            <span class="">{{ formatDate(post.created) }}</span>
            <span class="ml-auto">{{ StatusEnum[post.status] }}</span>
          </div>
          <!--                    <div class="text-primary font-bold">-->
          <!--                      Read More-->
          <!--                    </div>-->
        </div>
      </nuxt-link>
    </div>
    <nuxt-link v-if="more" class="btn" :to="to">
      {{ moreButton }}}
    </nuxt-link>
  </div>
</template>

<script>
import StatusEnum from '~/models/status-enum'
export default {
  props: {
    posts: { type: Array },
    more: { type: Boolean, default: false },
    moreButton: { type: String, default: 'Read More' },
    to: { type: String },
    showTags: { type: Boolean, default: false },
    showImage: { type: Boolean, default: true },
    status: { type: String, default: '' }
  },
  setup () {
    return {
      StatusEnum
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

<template>
  <div class="container mx-auto pt-10">
    <div>
      <div class="font-italic text-base-300">
        Notion CSM - WIP <br>
        This is the transition to using the new Notion API as a CMS.
      </div>
      <div class="posts">
        <h2 class="text-4xl font-bold my-5">
          All Posts ({{ posts.results.length }})
        </h2>
        <div v-if="posts">
          <nuxt-link
            v-for="post in posts.results"
            :key="post.id"
            class="block mb-4 hover:bg-base-200 max-w-max text-lg transition-all p-2"
            :to="'/notion/'+post.id"
          >
            <span class="font-bold">

              {{ post.properties.title.title[0].text.content }}
            </span>
            <span
              v-for="tag in post.properties.tags.multi_select"
              :key="tag.id"
              class="border-b mx-1"
              :style="{'border-color':tag.color}"
            >#{{ tag.name }} </span>
            <!--            <pre>{{ post }}</pre>-->
            <div class="text-base-300">
              ({{ post.id }})
            </div>
          </nuxt-link>
        </div>

        -------------
        <!--        <pre>{{ posts && posts.results }}</pre>-->

        -------------
        <!-- component -->
        <!--        <ul>-->
        <!--          <li v-for="(post, k) in posts" :key="k" class="hover:bg-base-200">-->
        <!--            <span>{{ post.date }}</span>-->
        <!--            <NuxtLink v-if="post.slug" :to="post.slug" class="button&#45;&#45;grey">-->
        <!--              <b>{{ post.title }}</b>-->
        <!--              {{ post.preview }}-->
        <!--            </NuxtLink>-->
        <!--          </li>-->
        <!--        </ul>-->
        <!--      </div>-->
        <!--      <div class="posts">-->
        <!--        <h2>All Tags</h2>-->
        <!--        <ul>-->
        <!--          <li v-for="(tag, key) in tags" :key="key">-->
        <!--            <div class="text-sm text-content-200">-->
        <!--              #{{ tag }}-->
        <!--            </div>-->
        <!--            <ul>-->
        <!--              <li v-for="(post, k) in postsByTag.get(tag)" :key="k">-->
        <!--                <NuxtLink v-if="post.slug" :to="post.slug" class="button&#45;&#45;grey">-->
        <!--                  <b>{{ post.title }}</b>-->
        <!--                  {{ post.preview }}-->
        <!--                </NuxtLink>-->
        <!--              </li>-->
        <!--            </ul>-->
        <!--          </li>-->
        <!--        </ul>-->
        <!--      </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // async asyncData ({ $notion, params, error }) {
  //   // const pageTable = await $notion.getPageTable('10327f9074b7433aad577ccd0020e971')
  //   // https://www.notion.so/ctwhome/29a3ed94b7ba4db3bbf6ad715e8892f9?v=25dd41d8eb2043fb84c9508cf4711977
  //   // const db = await fetch('https://api.notion.com/v1/databases/25dd41d8eb2043fb84c9508cf4711977')
  //   // const dbData = await db.json()
  //   // console.log('🎹 db', dbData)
  //   const pageTable = await $notion.getPageTable('e195e81c5153446b8893e0a573348921')
  //
  //   // sort published pages
  //   const posts = pageTable
  //     .filter(page => page.published)
  //     .sort((a, b) => a.date - b.date)
  //   // convert array of pages to a map of tags with page arrays
  //   const postsByTag = pageTable
  //     .filter(page => page.published)
  //     .reduce((map, currentPage) => {
  //       currentPage.tags.forEach(tag =>
  //         map.has(tag)
  //           ? map.set(tag, [...map.get(tag), currentPage])
  //           : map.set(tag, [currentPage])
  //       )
  //       return map
  //     }, new Map())
  //   return {
  //     posts,
  //     postsByTag,
  //     tags: [...postsByTag.keys()].sort()
  //   }
  // },
  data () {
    return {
      posts: null
    }
  },
  async fetch () {
    const location = 'https://api.notion.com/v1/databases/e195e81c5153446b8893e0a573348921/query'
    const settings = {
      method: 'POST',
      headers: {
        'Notion-Version': '2022-02-22',
        'Content-Type': 'application/json',
        Authorization: this.$config.secretNotion
      }
    }
    try {
      const fetchResponse = await fetch(location, settings)
      const data = await fetchResponse.json()
      // console.log('🎹 ', data)
      this.posts = data
    } catch (e) {
      return e
    }
  }
}
</script>

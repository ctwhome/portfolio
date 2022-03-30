<template>
  <NotionRenderer
    :block-map="blockMap"
    :block-overrides="blockOverrides"
    :page-link-options="pageLinkOptions"
    full-page
    prism
    katex
  />
</template>

<script>
import 'prismjs'
import 'prismjs/themes/prism.css'

export default {
  transition: 'fade',
  async asyncData ({ $notion, params, error }) {
    // const pageTable = await $notion.getPageTable(
    //   '10327f9074b7433aad577ccd0020e971'
    // )
    // const page = pageTable.find(
    // item => item.published && item.slug === params.slug
    // )
    const blockMap = await $notion.getPageBlocks(params.slug)
    if (!blockMap || blockMap.error) {
      return error({ statusCode: 404, message: 'Post not found' })
    }
    return { blockMap }
  },
  data () {
    return {
      post: null,
      blockOverrides: {
        // code: 'CustomCode'
      },
      pageLinkOptions: { component: 'NuxtLink', href: 'to' }
    }
  }

  /**
   * Example with official Notion API, but it doesn't have the rendering, so I can't do anything with it yet.
   */
  /* async fetch () { */
  /*  // https://api.notion.com/v1/blocks/:id/children?page_size=100 */
  /*  const location = 'https://api.notion.com/v1/blocks/' + this.$route.params.slug + '/children' */
  /*  const settings = { */
  /*    method: 'GET', */
  /*    headers: { */
  /*      'Notion-Version': '2022-02-22', */
  /*      'Content-Type': 'application/json', */
  /*      Authorization: 'Bearer secret_A92jLLyZSyrGMxTbVAxfdmOGXXCeyl1Fj1s7UfmIKyY' */
  /*    } */
  /*  } */
  /*  try { */
  //     const fetchResponse = await fetch(location, settings)
  //     const data = await fetchResponse.json()
  //     // console.log('🎹 ', data)
  //     this.post = data
  //   } catch (e) {
  //     return e
  //   }
  // }
}
</script>

<style>
@import "vue-notion/src/styles.css";
.notion{
  @apply text-base-content
}
/*:not(pre) > code[class*="language-"], pre[class*="language-"] {*/
/* !*background: blue;*!*/
/*@apply bg-base-200 text-base-content*/
/*}*/
/*.language-plain {*/
/*  @apply text-base-content*/
/*}*/
</style>

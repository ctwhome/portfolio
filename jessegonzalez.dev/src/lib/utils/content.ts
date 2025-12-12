// TODO WIP - it would be nice if i could get the metadata of the md file directly

import { browser } from '$app/environment'
import { format } from 'date-fns'
import { parse } from 'node-html-parser'

// we require some server-side APIs to parse all metadata
if (browser) {
  throw new Error(`posts can only be imported server-side`)
}

type Glob = { default: SvelteComponent; metadata: Record<string, any> };




// Get all posts and add metadata
// export const posts = Object.entries(import.meta.glob('/content/**/*.md', { eager: true }))
// Gets the metadata of the mdfile directly
export const content = Object.entries(import.meta.glob<Glob>('/src/work/**/*.md', { eager: true }))
  .filter(
    ([path, post]) => post.metadata.published
  )

  .map(([filepath, post]) => {
    const html = parse(post.default.render().html)
    const preview = post.metadata.preview ? parse(post.metadata.preview) : html.querySelector('p')

    return {
      ...post.metadata,

      // generate the slug from the file path
      slug: filepath
        .replace(/(\/index)?\.md/, '')
        .split('/')
        .pop(),

      // whether or not this file is `my-post.md` or `my-post/index.md`
      // (needed to do correct dynamic import in posts/[slug].svelte)
      isIndexFile: filepath.endsWith('/index.md'),

      // format date as yyyy-MM-dd
      date: post.metadata.date
        ? format(
          // offset by timezone so that the date is correct
          addTimezoneOffset(new Date(post.metadata.date)),
          'yyyy-MM-dd'
        )
        : undefined,

      preview: {
        html: preview.toString(),
        // text-only preview (i.e no html elements), used for SEO
        text: preview.structuredText ?? preview.toString()
      },

    }
  })
  // sort by date
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  // add references to the next/previous post
  .map((post, index, allPosts) => ({
    ...post,
    next: allPosts[index - 1],
    previous: allPosts[index + 1]
  }))

function addTimezoneOffset(date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000
  return new Date(new Date(date).getTime() + offsetInMilliseconds)
}

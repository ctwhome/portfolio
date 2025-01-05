import { visit } from 'unist-util-visit'
import autolinkHeadings from 'rehype-autolink-headings'
import slugPlugin from 'rehype-slug'
import relativeImages from 'mdsvex-relative-images'
import remarkExternalLinks from 'remark-external-links';
import readingTime from 'remark-reading-time';

export default {
  extensions: ['.svx', '.md'],
  smartypants: {
    dashes: 'oldschool'
  },
  layout: {
    _: "/src/markdown-layouts/default.svelte",
    // blog: "/src/markdown-layouts/blog.svelte",
    // project: "/src/markdown-layouts/project.svelte",
  },
  remarkPlugins: [
    videos,
    relativeImages,
    readingTime,
    [remarkExternalLinks, { target: '_blank', rel: 'noopener' }],
  ],
  rehypePlugins: [
    slugPlugin,
    [autolinkHeadings, { behavior: 'wrap' }]
  ]
}

function videos() {
  const extensions = ['mp4', 'webm']
  return function transformer(tree) {
    visit(tree, 'image', (node) => {
      if (extensions.some((ext) => node.url.endsWith(ext))) {
        node.type = 'html'
        node.value = `
            <video
              src="${node.url}"
              autoplay
              muted
              playsinline
              loop
              title="${node.alt}"
            />
          `
      }
    })
  }
}

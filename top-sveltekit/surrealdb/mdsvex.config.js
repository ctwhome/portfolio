import { visit } from 'unist-util-visit'

import autolinkHeadings from 'rehype-autolink-headings'
import slugPlugin from 'rehype-slug'

import relativeImages from 'mdsvex-relative-images'
// import remarkHeadings from '@vcarl/remark-headings'
import remarkExternalLinks from 'remark-external-links';
import readingTime from 'remark-reading-time';

// import remarkToc from 'remark-toc'


export default {
  extensions: ['.svx', '.md'],
  smartypants: {
    dashes: 'oldschool'
  },
  layout: {
    _: "/src/lib/markdown-layouts/default.svelte", // Default layout for markdown files
    blog: "/src/lib/markdown-layouts/blog.svelte",
    project: "/src/lib/markdown-layouts/project.svelte",
  },
  remarkPlugins: [
    videos,
    relativeImages,
    // remarkToc,
    // headings,
    // adds a `readingTime` frontmatter attribute
		readingTime,
    // external links open in a new tab
		[remarkExternalLinks, { target: '_blank', rel: 'noopener' }],
  ],
  rehypePlugins: [
    slugPlugin,
    [
      autolinkHeadings, { behavior: 'wrap' }
    ]
  ]
}

/**
 * Adds support to video files in markdown image links
 */
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

/**
 * Parses headings and includes the result in metadata
 */
// function headings() {
//   return function transformer(tree, vfile) {
//     // run remark-headings plugin
//     remarkHeadings()(tree, vfile)

//     // include the headings data in mdsvex frontmatter
//     vfile.data.fm ??= {}
//     vfile.data.fm.headings = vfile.data.headings.map((heading) => ({
//       ...heading,
//       // slugify heading.value
//       id: heading.value
//         .toLowerCase()
//         .replace(/\s/g, '-')
//         .replace(/[^a-z0-9-]/g, '')
//     }))
//   }
// }

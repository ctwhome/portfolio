//
// This file help to get all the content from the markdown files in the content
// folder. It is used in the server.ts file in the blog folder to
// get all the content for pre - rendering.
//


// import { get } from "svelte/store"
const content = import.meta.glob('$content/**/*.md', { eager: true })
const filtered = [];

for (const path in content) {
  const { metadata } = content[path];
  // Assuming that the MDsveX transformed content includes a `.toString()` method to get raw Markdown
  // If not, you might need to adjust this depending on what `content` actually includes
  // const markdown = rawContent.toString();

  filtered.push({
    metadata,
    slug: path.split('/').at(-2), // Get folder name as slug
    prevPost: null, // TODO: Implement
    nextPost: null  // TODO: Implement
  });
}
// filter out the TEMPLATE and content folder
const posts = filtered
  .filter(filteredPost => !filteredPost.slug.includes('TEMPLATE'))
  .filter(filteredPost => !filteredPost.slug.includes('content'))
  .sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));


export { content, posts }


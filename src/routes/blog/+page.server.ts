export async function load({ params }) {
  const allPostFiles = import.meta.glob('$content/**/*.md', { eager: true });
  const posts = [];

  for (const path in allPostFiles) {
    const { metadata } = allPostFiles[path];
    // Assuming that the MDsveX transformed content includes a `.toString()` method to get raw Markdown
    // If not, you might need to adjust this depending on what `content` actually includes
    // const markdown = rawContent.toString();

    posts.push({
      metadata,
      slug: path.split('/').at(-2), // Get folder name as slug
      prevPost: null, // TODO: Implement
      nextPost: null  // TODO: Implement
    });
  }

  const filtered = posts.filter(post => !post.slug.includes('TEMPLATE'))
  // .sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));
  return {
    posts: filtered
  };
};

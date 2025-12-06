export interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  coverImage?: string | null;
  categories?: string[];
  tags?: string[];
  externalUrl?: string;
  [key: string]: any;
}

export interface Post {
  metadata: PostMetadata;
  slug: string;
  prevPost: Post | null;
  nextPost: Post | null;
}

export interface ContentModule {
  metadata: PostMetadata;
}

const content: Record<string, ContentModule> = import.meta.glob('$content/**/*.md', { eager: true });
const filtered: Post[] = [];

for (const path in content) {
  const module = content[path] as ContentModule;
  if (!module || !module.metadata) continue;

  const slug = path.split('/').at(-2) || '';
  filtered.push({
    metadata: {
      ...module.metadata,
      coverImage: module.metadata.coverImage ? `/content/${slug}/${module.metadata.coverImage}` : null
    },
    slug, // Get folder name as slug
    prevPost: null, // TODO: Implement
    nextPost: null  // TODO: Implement
  });
}
// filter out the TEMPLATE and content folder
const posts: Post[] = filtered
  .filter(filteredPost => !filteredPost.slug.includes('TEMPLATE'))
  .filter(filteredPost => !filteredPost.slug.includes('content'))
  .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());


export { content, posts }

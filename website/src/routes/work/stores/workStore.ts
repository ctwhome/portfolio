import { derived, writable } from 'svelte/store';
import type { Post } from '$content/content';

function createWorkStore() {
  const posts = writable<Post[]>([]);
  const activeCategories = writable<string[]>([]);
  const activeTags = writable<string[]>([]);

  // Derive filtered posts automatically when filters change
  const filteredPosts = derived(
    [posts, activeCategories, activeTags],
    ([$posts, $activeCategories, $activeTags]) => {
      if ($activeCategories.length === 0 && $activeTags.length === 0) {
        return $posts;
      }

      return $posts.filter(post => {
        const matchesCategories = $activeCategories.length === 0 ||
          $activeCategories.some(category => post.metadata?.categories?.includes(category));

        const matchesTags = $activeTags.length === 0 ||
          $activeTags.some(tag => post.metadata?.tags?.includes(tag));

        return matchesCategories && matchesTags;
      });
    }
  );

  // Derive global categories and tags from posts
  const globalCategories = derived(posts, $posts =>
    Array.from(
      new Set($posts.flatMap(post => post.metadata?.categories || []))
    ).map(name => ({
      name,
      count: $posts.filter(post => post.metadata?.categories?.includes(name)).length
    }))
  );

  // Update tag counts based on active category
  const globalTags = derived(
    [posts, activeCategories],
    ([$posts, $activeCategories]) => {
      // Filter posts by active category first
      const filteredPosts = $activeCategories.length === 0
        ? $posts
        : $posts.filter(post =>
          $activeCategories.some(category => post.metadata?.categories?.includes(category))
        );

      // Get tags only from filtered posts
      return Array.from(
        new Set(filteredPosts.flatMap(post => post.metadata?.tags || []))
      ).map(name => ({
        name,
        count: filteredPosts.filter(post => post.metadata?.tags?.includes(name)).length
      }));
    }
  );

  const hasFilters = derived(
    [activeCategories, activeTags],
    ([$activeCategories, $activeTags]) =>
      $activeCategories.length > 0 || $activeTags.length > 0
  );

  function setPosts(newPosts: Post[]) {
    posts.set(newPosts);
  }

  function setFilters(categories: string[], tags: string[]) {
    activeCategories.set(categories);
    activeTags.set(tags);
  }

  // Make categories act like tabs - only one active at a time
  function toggleCategory(categoryName: string) {
    activeCategories.update($categories => {
      if ($categories.includes(categoryName)) {
        return []; // Deselect if clicking active category
      }
      return [categoryName]; // Select only this category
    });
    // Clear tags when changing category
    activeTags.set([]);
  }

  // Tags remain multi-select
  function toggleTag(tagName: string) {
    activeTags.update($tags =>
      $tags.includes(tagName)
        ? $tags.filter(t => t !== tagName)
        : [...$tags, tagName]
    );
  }

  function clearFilters() {
    activeCategories.set([]);
    activeTags.set([]);
  }

  function getSearchParams(categories: string[], tags: string[]): string {
    const params = new URLSearchParams();
    if (categories.length) params.set('category', categories.join(','));
    if (tags.length) params.set('tag', tags.join(','));
    return params.toString() ? `?${params.toString()}` : '';
  }

  return {
    setPosts,
    setFilters,
    filteredPosts,
    hasFilters,
    globalCategories,
    globalTags,
    activeCategories,
    activeTags,
    toggleCategory,
    toggleTag,
    clearFilters,
    getSearchParams
  };
}

export const workStore = createWorkStore();

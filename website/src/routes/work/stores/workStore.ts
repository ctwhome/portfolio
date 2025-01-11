import { posts } from '$content/content';
import { derived, writable } from 'svelte/store';

// Pre-calculate global categories and tags once
const globalCategories = Array.from(
  new Set(posts.flatMap(post => post.metadata?.categories || []))
).map(name => ({
  name,
  count: posts.filter(post => post.metadata?.categories?.includes(name)).length
}));

const globalTags = Array.from(
  new Set(posts.flatMap(post => post.metadata?.tags || []))
).map(name => ({
  name,
  count: posts.filter(post => post.metadata?.tags?.includes(name)).length
}));

function createWorkStore() {
  const activeCategories = writable<string[]>([]);
  const activeTags = writable<string[]>([]);

  // Derive filtered posts automatically when filters change
  const filteredPosts = derived(
    [activeCategories, activeTags],
    ([$activeCategories, $activeTags]) => {
      if ($activeCategories.length === 0 && $activeTags.length === 0) {
        return posts;
      }

      return posts.filter(post => {
        const matchesCategories = $activeCategories.length === 0 ||
          $activeCategories.some(category => post.metadata?.categories?.includes(category));

        const matchesTags = $activeTags.length === 0 ||
          $activeTags.some(tag => post.metadata?.tags?.includes(tag));

        return matchesCategories && matchesTags;
      });
    }
  );

  // Derive hasFilters state
  const hasFilters = derived(
    [activeCategories, activeTags],
    ([$activeCategories, $activeTags]) =>
      $activeCategories.length > 0 || $activeTags.length > 0
  );

  function initializeFilters(categories: string[], tags: string[]) {
    activeCategories.set(categories);
    activeTags.set(tags);
  }

  function toggleCategory(categoryName: string) {
    activeCategories.update($categories =>
      $categories.includes(categoryName)
        ? $categories.filter(c => c !== categoryName)
        : [...$categories, categoryName]
    );
  }

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

  function getUrlSearchParams($activeCategories: string[], $activeTags: string[]): string {
    const params = new URLSearchParams();

    if ($activeCategories.length) params.set('category', $activeCategories.join(','));
    if ($activeTags.length) params.set('tag', $activeTags.join(','));

    const searchParams = params.toString();
    return searchParams ? `?${searchParams}` : '';
  }

  return {
    activeCategories,
    activeTags,
    filteredPosts,
    hasFilters,
    globalCategories,
    globalTags,
    initializeFilters,
    toggleCategory,
    toggleTag,
    clearFilters,
    getUrlSearchParams
  };
}

export const workStore = createWorkStore();

import { posts } from '$content/content';
import { derived, writable } from 'svelte/store';

function createWorkStore() {
  const activeCategories = writable<string[]>([]);
  const activeTags = writable<string[]>([]);
  const filteredPosts = writable(posts);
  const hasFilters = writable(false);

  // Initialize global categories and tags
  const globalCategories = posts.reduce((acc, post) => {
    post.metadata?.categories?.forEach((category: string) => {
      const existing = acc.find(c => c.name === category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: category, count: 1 });
      }
    });
    return acc;
  }, [] as { name: string; count: number }[]);

  const globalTags = posts.reduce((acc, post) => {
    post.metadata?.tags?.forEach((tag: string) => {
      const existing = acc.find(t => t.name === tag);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: tag, count: 1 });
      }
    });
    return acc;
  }, [] as { name: string; count: number }[]);

  function setFiltersFromParams(categoryParam: string | null, tagParam: string | null) {
    activeCategories.set(categoryParam ? categoryParam.split(',') : []);
    activeTags.set(tagParam ? tagParam.split(',') : []);
    updateFilteredPosts();
  }

  function toggleCategory(categoryName: string) {
    activeCategories.update($activeCategories => {
      const index = $activeCategories.indexOf(categoryName);
      if (index === -1) {
        return [...$activeCategories, categoryName];
      }
      return $activeCategories.filter(c => c !== categoryName);
    });
    updateFilteredPosts();
  }

  function toggleTag(tagName: string) {
    activeTags.update($activeTags => {
      const index = $activeTags.indexOf(tagName);
      if (index === -1) {
        return [...$activeTags, tagName];
      }
      return $activeTags.filter(t => t !== tagName);
    });
    updateFilteredPosts();
  }

  function clearFilters() {
    activeCategories.set([]);
    activeTags.set([]);
    hasFilters.set(false);
    filteredPosts.set(posts);
  }

  const updateFilteredPosts = () => {
    let currentCategories: string[] = [];
    let currentTags: string[] = [];

    const unsubscribeCategories = activeCategories.subscribe(value => {
      currentCategories = value;
    });
    const unsubscribeTags = activeTags.subscribe(value => {
      currentTags = value;
    });

    hasFilters.set(currentCategories.length > 0 || currentTags.length > 0);

    if (!currentCategories.length && !currentTags.length) {
      filteredPosts.set(posts);
      unsubscribeCategories();
      unsubscribeTags();
      return;
    }

    let filtered = posts;

    if (currentCategories.length > 0) {
      filtered = filtered.filter(({ metadata }) =>
        metadata?.categories?.some((category: string) => currentCategories.includes(category))
      );
    }

    if (currentTags.length > 0) {
      filtered = filtered.filter(({ metadata }) =>
        metadata?.tags?.some((tag: string) => currentTags.includes(tag))
      );
    }

    filteredPosts.set(filtered);
    unsubscribeCategories();
    unsubscribeTags();
  };

  const getUrlParams = (): URLSearchParams => {
    const params = new URLSearchParams();
    let currentCategories: string[] = [];
    let currentTags: string[] = [];

    const unsubscribeCategories = activeCategories.subscribe(value => {
      currentCategories = value;
    });
    const unsubscribeTags = activeTags.subscribe(value => {
      currentTags = value;
    });

    if (currentCategories.length > 0) {
      params.set('category', currentCategories.join(','));
    }
    if (currentTags.length > 0) {
      params.set('tag', currentTags.join(','));
    }

    unsubscribeCategories();
    unsubscribeTags();
    return params;
  };

  return {
    activeCategories,
    activeTags,
    filteredPosts,
    hasFilters,
    globalCategories,
    globalTags,
    setFiltersFromParams,
    toggleCategory,
    toggleTag,
    clearFilters,
    getUrlParams
  };
}

export const workStore = createWorkStore();

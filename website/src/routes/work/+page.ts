import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ url }) => {
  const categoryParam = url.searchParams.get('category');
  const tagParam = url.searchParams.get('tag');

  return {
    initialFilters: {
      categories: categoryParam?.split(',') || [],
      tags: tagParam?.split(',') || []
    }
  };
};

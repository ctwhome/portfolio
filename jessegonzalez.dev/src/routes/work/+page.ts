import { posts } from '$content/content';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async () => {
  return { posts };
};

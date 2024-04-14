import type { SvelteComponent } from "svelte";
import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
  const glob_import = import.meta.glob<{ default: SvelteComponent; metadata: Record<string, any> }>(
    '$lib/content/projects/*.md',
    { eager: true }
  );

  const content = Object.entries(glob_import).map(([path, module]) => ({
    path,
    content: module.default, // Assuming module.default is the component
    metadata: module.metadata
  }));

  console.log(content); // Ensure this logs correctly

  return { content }
};

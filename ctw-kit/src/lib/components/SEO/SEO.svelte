<script lang="ts">
  import type { SiteSettings } from "./types";

  export let siteSettings: SiteSettings;
  export let title = siteSettings.title;
  export let desc = siteSettings.description;
  export let img = siteSettings.image;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={desc} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={desc} />
  <meta name="twitter:image" content={siteSettings.baseUrl + img} />
  <meta name="twitter:image:alt" content={title} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={desc} />
  <meta property="og:image" content={siteSettings.baseUrl + img} />
  <meta property="og:image:alt" content={title} />
  <meta property="og:url" content={siteSettings.baseUrl} />
  <meta property="og:type" content="article" />
</svelte:head>

<script>
	import { page } from '$app/stores';
	import { siteSettings } from '$lib/siteSettings';

	export let title = siteSettings.title;
	export let desc = siteSettings.description;
	export let img = siteSettings.image;
	export let url = '';

	// Ensure image URL is absolute
	$: absoluteImg = img.startsWith('http') ? img : siteSettings.baseUrl + img;
	// Use current page URL if not provided
	$: pageUrl = url || siteSettings.baseUrl + $page.url.pathname;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={absoluteImg} />
	<meta name="twitter:image:alt" content={title} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={absoluteImg} />
	<meta property="og:image:alt" content={title} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Ctwhome Portfolio" />
</svelte:head>

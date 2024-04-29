<script>
	import { readEnv } from '$lib/utils/util';

	let siteData = {
		title: 'Ctwhome - Portfolio',
		desc: 'Web Engineering - Projects and Portfolio of J. Gonzalez',
		card: '/images/default.jpg'
	};
	export let title = siteData.title;
	export let desc = siteData.desc;
	export let img = siteData.card;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={readEnv('VITE_ROOT') + img} />
	<meta name="twitter:image:alt" content={title} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={readEnv('VITE_ROOT') + img} />
</svelte:head>

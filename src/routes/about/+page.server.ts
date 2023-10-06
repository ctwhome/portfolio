import { replaceURL } from '$lib/utils/repace-url-for-seo.js';

export async function load() {
	// fetch page from wordpress json api
	const res = await fetch(`https://portfolio.ctwhome.com/wp-json/wp/v2/pages?slug=about}`);
	const [page] = await res.json();
	const yoast_head = replaceURL(page.yoast_head);

	return {
		page,
		yoast_head
	};
}

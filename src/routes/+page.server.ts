// Redirect page removing the trailing slash

import { replaceURL } from '$lib/utils/repace-url-for-seo.js';

// Load the post data
export async function load({ params }) {
	let yoast_head = null;
	const URL = `https://portfolio.ctwhome.com/wp-json/wp/v2/pages/111`;
	const response = await fetch(URL);

	if (response.ok) {
		const postData = await response.json();
		yoast_head = replaceURL(postData.yoast_head);
	} else {
		console.error('Failed to fetch post');
	}
	return {
		yoast_head
	};
}

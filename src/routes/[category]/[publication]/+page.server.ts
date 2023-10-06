// Redirect page removing the trailing slash
export const trailingSlash = 'never';

// Load the post data
export async function load({ params }) {
	let post = null;
	let previousPost = null;
	let nextPost = null;
	let media = null;
	let date = null;
	let categories = null;
	let tags = null;
	let yoast_head = null;
	const URL = `https://portfolio.ctwhome.com/wp-json/wp/v2`;
	const id = params.publication;
	const response = await fetch(`${URL}/posts?slug=${id}`);

	if (response.ok) {
		const postData = await response.json();

		[post] = postData;

		date = new Date(post.date).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		const [
			mediaResponse,
			categoriesResponse,
			tagsResponse,
			previousPostResponse,
			nextPostResponse
		] = await Promise.all([
			fetch(`${URL}/media/${post.featured_media}`),
			fetch(`${URL}/categories?post=${post.id}`),
			fetch(`${URL}/tags?post=${post.id}`),
			fetch(`${URL}/posts?per_page=1&order=asc&orderby=date&after=${post.date}`),
			fetch(`${URL}/posts?per_page=1&order=desc&orderby=date&before=${post.date}`)
		]);

		media = await mediaResponse.json();
		categories = await categoriesResponse.json();

		tags = await tagsResponse.json();

		const previousPostData = await previousPostResponse.json();
		previousPost = previousPostData[0];

		const nextPostData = await nextPostResponse.json();
		nextPost = nextPostData[0];

		yoast_head = post.yoast_head;
	} else {
		console.error('Failed to fetch post');
	}
	return {
		post,
		media,
		date,
		categories,
		tags,
		nextPost,
		previousPost,
		yoast_head
	};
}

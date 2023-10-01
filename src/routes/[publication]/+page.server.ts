export async function load({ params }) {
	let post = null;
	let media = null;
	let date = null;
	const categories = null;
	const tags = null;

	// async function fetchSinglePost(id) {
	const url = `http://portfolio.ctwhome.com/wp-json/wp/v2/posts/${params.publication}`;

	const response = await fetch(url);

	if (response.ok) {
		const postData = await response.json();
		const mediaResponse = await fetch(
			`http://portfolio.ctwhome.com/wp-json/wp/v2/media/${postData.featured_media}`
		);
		media = await mediaResponse.json();

		post = postData;
		date = new Date(post.date).toLocaleDateString('en-NL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	} else {
		console.error('Failed to fetch post');
	}

	return { post, media, date, categories, tags };
}

export async function load({ params }) {
	let posts = [];
	const url =
		'http://portfolio.ctwhome.com/wp-json/wp/v2/posts?_fields=id, title,excerpt,featured_media, tags, categories';
	const response = await fetch(url);

	if (response.ok) {
		const data = await response.json();
		const mediaRequests = data.map((post) =>
			fetch(`http://portfolio.ctwhome.com/wp-json/wp/v2/media/${post.featured_media}`)
		);

		const mediaResponses = await Promise.all(mediaRequests);
		const mediaData = await Promise.all(mediaResponses.map((response) => response.json()));

		posts = data.map((post, index) => {
			return {
				id: post.id,
				title: post.title.rendered,
				excerpt: post.excerpt.rendered,
				tags: post.tags,
				categories: post.categories,
				imageUrl:
					mediaData[index].media_details?.sizes?.thumbnail?.source_url ||
					mediaData[index].source_url
			};
		});
	} else {
		console.error('Failed to fetch posts');
	}
	return { posts: posts };
}

function groupPostsByYear(posts) {
	// Sort the posts by their Unix timestamp in descending order
	posts.sort((a, b) => b.post.unix_timestamp - a.post.unix_timestamp);

	// Initialize an empty object to store the posts grouped by year
	const postsByYear = {};

	// Loop through each post
	posts.forEach(({ post }) => {
		// Convert the Unix timestamp to a JavaScript Date object
		const date = new Date(post.unix_timestamp * 1000);

		// Extract the year from the Date object
		const year = date.getFullYear();

		// Initialize the year property if it doesn't exist yet
		if (!postsByYear[year]) {
			postsByYear[year] = [];
		}

		// Push the post into the appropriate year property
		postsByYear[year].push(post);
	});

	return postsByYear;
}

export async function load({ params }) {
	let posts = [];

	// Using Custom Endpoint inside WP
	const url = 'https://portfolio.ctwhome.com/wp-json/custom/v1/posts';
	const response = await fetch(url);

	if (response.ok) {
		const data = await response.json();
		posts = data.map((post) => {
			return { post };
		});
	} else {
		console.error('Failed to fetch posts');
	}

	return { posts: groupPostsByYear(posts), count: posts.length };
}

// let posts = [];
// const url =
// 	'https://portfolio.ctwhome.com/wp-json/wp/v2/posts?_fields=id, title,excerpt,featured_media, tags, categories';
// const response = await fetch(url);

// if (response.ok) {
// 	const data = await response.json();
// 	const mediaRequests = data.map((post) =>
// 		fetch(`https://portfolio.ctwhome.com/wp-json/wp/v2/media/${post.featured_media}`)
// 	);

// 	const mediaResponses = await Promise.all(mediaRequests);
// 	const mediaData = await Promise.all(mediaResponses.map((response) => response.json()));

// 	posts = data.map((post, index) => {
// 		return {
// 			id: post.id,
// 			title: post.title.rendered,
// 			excerpt: post.excerpt.rendered,
// 			tags: post.tags,
// 			categories: post.categories,
// 			imageUrl:
// 				mediaData[index].media_details?.sizes?.thumbnail?.source_url ||
// 				mediaData[index].source_url
// 		};
// 	});
// } else {
// 	console.error('Failed to fetch posts');
// }

// 	let posts2 = [];

// 	async function fetchTerms(id, taxonomy) {
// 		try {
// 			const response = await fetch(`https://portfolio.ctwhome.com/wp-json/wp/v2/${taxonomy}/${id}`);
// 			const data = await response.json();
// 			return data.name;
// 		} catch (error) {
// 			console.error(`Error fetching ${taxonomy}: `, error);
// 			return null;
// 		}
// 	}

// 	async function fetchMedia(id) {
// 		const response = await fetch(`https://portfolio.ctwhome.com/wp-json/wp/v2/media/${id}`);
// 		const data = await response.json();
// 		return data.source_url;
// 	}

// 	try {
// 		const response = await fetch('https://portfolio.ctwhome.com/wp-json/wp/v2/posts?_embed');
// 		const data = await response.json();

// 		posts2 = await Promise.all(
// 			data.map(async (post) => {
// 				const categories = await Promise.all(
// 					post.categories.map((id) => fetchTerms(id, 'categories'))
// 				);
// 				const tags = await Promise.all(post.tags.map((id) => fetchTerms(id, 'tags')));

// 				// Fetch media if available
// 				let media = null;
// 				if (post.featured_media) {
// 					media = await fetchMedia(post.featured_media);
// 				}

// 				return { ...post, categories, tags, media };
// 			})
// 		);
// 	} catch (error) {
// 		console.error('Error fetching posts: ', error);
// 	}

// 	console.log('🎹 posts2', posts2);

// 	return {
// 		// posts: posts,
// 		posts2: posts2
// 	};
// }

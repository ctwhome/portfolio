// function groupPostsByYear(posts) {
// 	// Sort the posts by their Unix timestamp in descending order
// 	posts.sort((a, b) => b.post.unix_timestamp - a.post.unix_timestamp);

// 	// Initialize an empty object to store the posts grouped by year
// 	const postsByYear = {};

// 	// Loop through each post
// 	posts.forEach(({ post }) => {
// 		// Convert the Unix timestamp to a JavaScript Date object
// 		const date = new Date(post.unix_timestamp * 1000);

// 		// Extract the year from the Date object
// 		const year = date.getFullYear();

// 		// Initialize the year property if it doesn't exist yet
// 		if (!postsByYear[year]) {
// 			postsByYear[year] = [];
// 		}

// 		// Push the post into the appropriate year property
// 		postsByYear[year].push(post);
// 	});

// 	return postsByYear;
// }

// export async function load({ params }) {
// 	const CATEGORIES_URL =
// 		'https://portfolio.ctwhome.com/wp-json/wp/v2/categories?_fields=id,name,count';
// 	const TAGS_URL = 'https://portfolio.ctwhome.com/wp-json/wp/v2/tags?_fields=id,name,count';
// 	const CUSTOM_POSTS_LIST_URL = 'https://portfolio.ctwhome.com/wp-json/custom/v1/posts';

// 	const [postsResponse, tagsResponse, categoriesResponse] = await Promise.all([
// 		fetch(CUSTOM_POSTS_LIST_URL),
// 		fetch(TAGS_URL),
// 		fetch(CATEGORIES_URL)
// 	]);

// 	if (!postsResponse.ok) {
// 		console.error('Failed to fetch posts');
// 		return;
// 	}

// 	const [postsData, tagsData, categoriesData] = await Promise.all([
// 		postsResponse.json(),
// 		tagsResponse.json(),
// 		categoriesResponse.json()
// 	]);

// 	const posts = postsData.map((post) => ({ post }));

// 	return {
// 		posts: groupPostsByYear(posts),
// 		count: posts.length,
// 		tags: tagsData,
// 		categories: categoriesData
// 	};
// }

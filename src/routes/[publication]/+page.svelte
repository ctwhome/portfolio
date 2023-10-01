<script>
	import { page } from '$app/stores';
	import FooterMain from '$lib/components/footerMain.svelte';
	import { onMount } from 'svelte';

	let post = null;
	let media = null;
	let date = null;
	let categories = null;
	let tags = null;

	async function fetchSinglePost(id) {
		const url = `http://portfolio.ctwhome.com/wp-json/wp/v2/posts/${id}`;
		console.log('🎹 id', id);

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

			// {
			//   title: postData.title.rendered,
			//   excerpt: postData.excerpt.rendered,
			//   imageUrl: mediaData.source_url
			// };
		} else {
			console.error('Failed to fetch post');
		}
	}
	onMount(() => {
		// Fetch posts when the component mounts
		fetchSinglePost($page.params.publication);
	});
</script>

<div class="prose mx-auto mt-6">
	{#if post}
		<h1>{post.title.rendered}</h1>
		<p>{date}</p>
		{#if media}
			<img src={media?.media_details?.sizes?.thumbnail?.source_url} alt={post.title.rendered} />
			<img src={media?.source_url} alt={post.title.rendered} />
		{/if}
		{@html post.content.rendered}
	{/if}
</div>
<!-- <pre>{JSON.stringify(media?.media_details, null, 2)}</pre>
<pre>{JSON.stringify(post, null, 2)}</pre> -->

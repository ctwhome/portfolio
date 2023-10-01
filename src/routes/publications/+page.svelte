<script>
	import { onMount } from 'svelte';

	let posts = [];

	async function fetchPosts() {
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
	}
	onMount(() => {
		// Fetch posts when the component mounts
		fetchPosts();
	});
</script>

<main class="mx-auto max-w-[700px]">
	<h1 class="text-4xl font-bold my-10" >My Publicaions ({posts.length})</h1>

	{#if posts.length === 0}
		<p>Loading...</p>
	{:else}
		<ul >
			{#each posts as post}
				<a href={'/' + post.id} class="flex gap-4 mb-10 rounded p-4 hover:bg-base-200 transition">
					<div class="">
						{#if post.imageUrl}
							<img src={post.imageUrl} alt={post.title} />
						{/if}
					</div>
					<div>
						<h2 class="text-xl font-bold">{post.title}</h2>
            {post.tags}
						<div class="prose">
							{@html post.excerpt}
							<button class="btn btn-ghost hover:btn-primary">View Post</button>
						</div>
					</div>
				</a>
			{/each}
		</ul>
	{/if}
</main>


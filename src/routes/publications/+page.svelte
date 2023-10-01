<script>
	export let data;
</script>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

<main class="mx-auto max-w-[700px]">
	<h1 class="text-4xl font-bold my-10">My Publicaions ({data?.posts?.length})</h1>

	{#if data?.posts?.length === 0}
		<p>Loading...</p>
	{:else if data?.posts?.length > 0}
		<ul>
			{#each data.posts as post}
				<a
					data-sveltekit-preload-data="hover"
					href={'/' + post.id}
					class="flex gap-4 mb-10 rounded p-4 hover:bg-base-200 transition"
				>
					<div class="">
						{#if post.imageUrl}
							<img
								class="w-[150px] aspect-[4/3] object-cover"
								src={post.imageUrl}
								alt={post.title}
							/>
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

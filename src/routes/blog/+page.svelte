<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
</script>

{$page.data.posts.length}
{#each $page.data.posts as post}
	<!-- <pre>{JSON.stringify(post, null, 2)}</pre> -->
	<div>
		<a data-sveltekit-preload-data="hover" href={'/blog/' + post.slug}
			>{post.metadata.title}
			<!-- <img src={post.metadata.coverImage} alt="" /> -->
			{#if post.metadata.coverImage}
				<img
					class="w-20 h-20 object-cover rounded"
					src={post.metadata.coverImage && `/content/${post.slug}/${post.metadata.coverImage}`}
					alt={post.slug}
				/>
			{:else}
				<div class="w-20 h-20 bg-base-200"></div>
			{/if}
			{post.metadata.coverImage} - {`/content/${post.slug}/${post.metadata.coverImage}`}
		</a>
	</div>

	<!-- <pre>{JSON.stringify(post.content, null, 2)}</pre> -->
	<!-- <img src={post.metadata.coverImage} alt="" /> -->
	<!-- <div>{@html post.conetnt}</div> -->
{/each}
<!-- <script lang="ts">
  import { page } from '$app/stores';
</script>

<article>
  {#each $page.data.posts as { metadata, content, slug }}
    <section>
      <h1>{metadata.title}</h1>
		</article> -->
<!-- </section> -->
<!-- {/each} -->

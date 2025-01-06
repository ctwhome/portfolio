<script>
	import { fade } from 'svelte/transition';

	const gallery_items = [
		{
			url: 'https://picsum.photos/id/237/400/300',
			description: 'Dog'
		},
		{
			url: 'https://picsum.photos/id/238/400/300',
			description: 'Building'
		},
		{
			url: 'https://picsum.photos/id/240/400/300',
			description: 'Staircase'
		}
	];

	let currentSlideItem = $state(0);

	const nextImage = () => {
		currentSlideItem = (currentSlideItem + 1) % gallery_items.length;
	};

	const prevImage = () => {
		if (currentSlideItem != 0) {
			currentSlideItem = (currentSlideItem - 1) % gallery_items.length;
		} else {
			currentSlideItem = gallery_items.length - 1;
		}
	};
</script>

<div>
	<h3 class="mt-3 text-xl">Image Carousel</h3>
	{#each [gallery_items[currentSlideItem]] as item (currentSlideItem)}
		<button type="button" onclick={() => nextImage()} aria-label="Next image">
			<img
				class="cursor-pointer"
				in:fade
				src={item.url}
				alt={item.description}
				width="100%"
				height="100%"
			/>
		</button>
	{/each}
	<div class="carousel-buttons flex gap-1">
		<button onclick={() => prevImage()}>◀</button>
		{#each gallery_items as item, i (i)}
			<button
				type="button"
				class="cursor-pointer {currentSlideItem === i && 'border border-primary ring-offset-0 '}"
				onclick={() => (currentSlideItem = i)}
				onkeydown={(e) => e.key === 'Enter' && (currentSlideItem = i)}
				style="background: none; border: none; padding: 0;"
			>
				<img src={item.url} alt={item.description} width={50} height={50} />
			</button>
		{/each}
		<button onclick={() => nextImage()}>▶</button>
	</div>
</div>

<script>
	import { fade } from "svelte/transition";

	const gallery_items = [
		{
			url: "https://picsum.photos/id/237/400/300",
			description: "Dog",
		},
		{
			url: "https://picsum.photos/id/238/400/300",
			description: "Building",
		},
		{
			url: "https://picsum.photos/id/240/400/300",
			description: "Staircase",
		},
	];

	let currentSlideItem = 0;

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
	<h3 class="text-xl mt-3">Image Carousel</h3>
	<div class="relative">
		{#each [gallery_items[currentSlideItem]] as item (currentSlideItem)}
			<img
				in:fade
				src={item.url}
				alt={item.description}
				width="100%"
				height="100%"
			/>
		{/each}
		<button
			class="absolute left-0 top-1/2 -translate-y-1/2 bg-base-200 bg-opacity-50 p-2 hover:bg-opacity-75"
			on:click={() => prevImage()}
			aria-label="Previous image"
		>
			◀
		</button>
		<button
			class="absolute right-0 top-1/2 -translate-y-1/2 bg-base-200 bg-opacity-50 p-2 hover:bg-opacity-75"
			on:click={() => nextImage()}
			aria-label="Next image"
		>
			▶
		</button>
	</div>
	<div class="carousel-buttons flex gap-1 mt-2">
		{#each gallery_items as item, i (i)}
			<button
				class="p-0 {currentSlideItem === i ? 'ring-2 ring-primary' : ''}"
				on:click={() => (currentSlideItem = i)}
				aria-label={`View ${item.description}`}
			>
				<img
					class="w-12 h-12 object-cover"
					src={item.url}
					alt={item.description}
					width={50}
					height={50}
				/>
			</button>
		{/each}
	</div>
</div>

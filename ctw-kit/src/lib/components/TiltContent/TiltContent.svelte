<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import VanillaTilt from "vanilla-tilt";
	import type { TiltOptions, TiltContentProps, TiltEvents } from "./types";

	let tiltImage: HTMLElement | HTMLElement[];

	let className: TiltContentProps["class"] = undefined;
	export { className as class };

	const dispatch = createEventDispatcher<TiltEvents>();

	function handleClick(event: MouseEvent | KeyboardEvent) {
		dispatch("click", event);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleClick(event);
		}
	}

	onMount(async () => {
		const tiltOtions: TiltOptions = {
			max: 4,
			perspective: 1000,
			scale: 2.05,
			speed: 1000,
			transition: true,
			axis: null,
			reset: true,
			easing: "cubic-bezier(.03,.98,.52,.99)",
			glare: false,
			"max-glare": 0.5,
			"glare-prerender": false,
		};
		VanillaTilt.init(tiltImage, tiltOtions);
	});
</script>

<div
	class={"order-2 " + className}
	bind:this={tiltImage}
	on:click={handleClick}
	on:keydown={handleKeyDown}
	role="button"
	tabindex="0"
	style="transform: scale(1) perspective(1040px) rotateY(-31deg) rotateX(2deg); cursor: pointer;"
>
	<slot />
</div>

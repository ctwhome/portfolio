<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import VanillaTilt from 'vanilla-tilt';

	let tiltImage: HTMLElement | HTMLElement[];

	let className = undefined; // class is a reserved keyword in JS, with initialization
	export { className as class };

	const dispatch = createEventDispatcher();

	function handleClick(event: MouseEvent) {
		dispatch('click', event);
	}

	onMount(async () => {
		const tiltOtions = {
			max: 4,
			perspective: 1000,
			scale: 1.05,
			speed: 1000,
			transition: true,
			axis: null,
			reset: true,
			easing: 'cubic-bezier(.03,.98,.52,.99)',
			glare: false,
			'max-glare': 0.5,
			'glare-prerender': false
		};
		VanillaTilt.init(tiltImage, tiltOtions);
	});
</script>

<div
	class={'order-2 ' + className}
	bind:this={tiltImage}
	on:click={handleClick}
	style="transform: scale(1) perspective(1040px) rotateY(-31deg) rotateX(2deg); cursor: pointer;"
>
	<slot />
</div>

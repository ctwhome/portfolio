<script lang="ts">
	import { onMount } from 'svelte';
	import VanillaTilt from 'vanilla-tilt';
	let tiltImage: HTMLElement | HTMLElement[];

	let className = undefined; // class is a reserved keyword in JS, with initialization
	export { className as class };

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
	style=" transform: scale(1) perspective(1040px) rotateY(-31deg) rotateX(2deg);"
>
	<!-- <img
		src={image?.default}
		class="tilt rounded pointer-events-none h-[450px] w-full object-cover"
		alt="Jesse Ctw Profile"
	/> -->
	<slot />
</div>

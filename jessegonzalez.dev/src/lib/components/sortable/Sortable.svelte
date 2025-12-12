<script lang="ts">
	// Install sortablejs and its typings
	// npm install sortablejs @types/sortablejs

	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';

	let foo: HTMLElement;
	let bar: HTMLElement;

	onMount(async function () {
		Sortable.create(foo, {
			ghostClass: 'bg-blue-500',
			chosenClass: 'bg-red-500',
			dragClass: 'bg-yellow-500',
			group: 'shared',
			// group: {
			// 	name: 'foo',
			// 	put: true,
			// 	pull: true
			// 	// 				pull: false,
			// },
			animation: 200
		});

		Sortable.create(bar, {
			group: 'shared',
			// group: {
			// 	name: 'bar',
			// 	put: true
			// },
			animation: 200
		});
	});
</script>

<section class="flex flex-wrap gap-2 bg-base-300" bind:this={foo}>
	<div class="size-10 bg-primary flex items-center justify-center">1</div>
	<div class="size-10 bg-base-200 flex items-center justify-center">2</div>
	<div class="size-10 bg-base-200 flex items-center justify-center">3</div>
	<div class="size-10 bg-base-200 flex items-center justify-center">4</div>
	<div class="size-10 bg-base-200 flex items-center justify-center">5</div>
</section>

<section class="flex gap-2" bind:this={bar}>
	<div class="size-10 bg-base-200 flex items-center justify-center">6</div>
	<div class="size-10 bg-base-200 flex items-center justify-center">7</div>
	<div class="size-10 bg-base-200 flex items-center justify-center">8</div>
	<div class="size-10 bg-base-200 flex items-center justify-center">9</div>
</section>

<style>
	section {
		margin-bottom: 16px;
		border: 1px solid black;
	}
</style>

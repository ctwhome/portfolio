<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	// Example data initialization (you should adapt this to your actual data structure and initial state)
	const initialDataSlices = []; // replace with your initial data

	// Creating local writable stores
	const currentTimeIndex = writable(0);

	export let playAnimation = false;
	export let length = 10;
	export let positionIndex = 0;
	export let playSpeedInMiliseconds = 300;
	export let subStepsPerFrame = 10;

	let interval;
	const dispatch = createEventDispatcher();

	function play() {
		playAnimation = !playAnimation;
		if (playAnimation) {
			interval = setInterval(() => {
				positionIndex = (positionIndex + 1) % length;
				$currentTimeIndex = positionIndex;
			}, playSpeedInMiliseconds / subStepsPerFrame);
		} else {
			clearInterval(interval);
		}
	}

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div>
	Play/Pause timeline
	<div class="flex gap-4 mt-4 items-center px-5">
		<!--  Play icon -->
		<button class="btn" class:btn-primary={playAnimation} on:click={play}>
			{#if !playAnimation}
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M9.525 18.025q-.5.325-1.012.038T8 17.175V6.825q0-.6.513-.888t1.012.038l8.15 5.175q.45.3.45.85t-.45.85l-8.15 5.175Z"
					/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M16 19q-.825 0-1.413-.588T14 17V7q0-.825.588-1.413T16 5q.825 0 1.413.588T18 7v10q0 .825-.588 1.413T16 19Zm-8 0q-.825 0-1.413-.588T6 17V7q0-.825.588-1.413T8 5q.825 0 1.413.588T10 7v10q0 .825-.588 1.413T8 19Z"
					/>
				</svg>
			{/if}
		</button>
		<div class="w-full">
			<input
				type="range"
				class="range-slider transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
				min="1"
				max={length}
				step="1"
				value={positionIndex + 1}
				on:input={(event) => {
					dispatch('onSelectedIndex', { index: parseInt(event.target.value) });
				}}
			/>
			<div class="w-full flex justify-between text-xs px-2 h-[30px]">
				<!-- Steps -->
				<!--  array of steps from 0 to length -->
				{#each Array.from({ length }, (_, index) => index) as step}
					<div class="flex flex-col">
						<div>|</div>
						<div class="-ml-1">{step + 1 || 0}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="flex gap-4 p-6 text-sm">
		Play Speed (ms):

		<input
			type="number"
			value={playSpeedInMiliseconds}
			step="100"
			min="100"
			class="w-20 input border border-base-300"
			on:input={(event) => {
				const wasPlaying = playAnimation;
				wasPlaying && play(); // stop current animation the animation
				playSpeedInMiliseconds = parseInt(event?.target?.value);
				wasPlaying && play(); // stop current animation the animation
			}}
		/>
	</div>
</div>

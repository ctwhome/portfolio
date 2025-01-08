<script lang="ts">
	import { run } from 'svelte/legacy';

	import { isMenuOpen, closeMenu, openMenu } from '$lib/stores/menu.store';
	import FeedbackButton from '$lib/components/ui/feedback/FeedbackButton.svelte';
	import { onMount } from 'svelte';

	let containerElement: HTMLElement = $state();
	let startX: number;
	let currentX: number;
	let isDragging = false;
	let menuWidth = 256; // Width of the menu in pixels
	let dragThreshold = 5; // Minimum drag distance to start moving the menu
	let edgeThreshold = 100; // Area from the left edge to start dragging when menu is closed

	let menuPosition = $derived($isMenuOpen ? 0 : -menuWidth);

	const updatePosition = (x: number) => {
		const position = Math.max(-menuWidth, Math.min(0, x));
		const progress = Math.min((position + menuWidth) / menuWidth, 0.5); // Cap at 0.5 (50% opacity)
		containerElement.style.setProperty('--menu-position', `${position}px`);
		containerElement.style.setProperty('--overlay-opacity', progress.toString());
	};

	const handleTouchStart = (event: TouchEvent) => {
		startX = event.touches[0].clientX;
		currentX = menuPosition;
		isDragging = false;
		containerElement.style.setProperty('--transition-duration', '0s');
	};

	const handleTouchMove = (event: TouchEvent) => {
		const touchX = event.touches[0].clientX;
		const diffX = touchX - startX;

		// Start dragging only if the touch started near the left edge when menu is closed
		if (!$isMenuOpen && startX > edgeThreshold) return;

		// Implement drag threshold
		if (Math.abs(diffX) > dragThreshold) {
			isDragging = true;
		}

		if (isDragging) {
			currentX = $isMenuOpen ? diffX : diffX - menuWidth;
			updatePosition(currentX);
		}
	};

	const handleTouchEnd = () => {
		containerElement.style.setProperty('--transition-duration', '0.2s');

		if (isDragging) {
			const closeThreshold = menuWidth * 0.4;
			if ($isMenuOpen && currentX < -closeThreshold) {
				closeMenu();
			} else if (!$isMenuOpen && currentX > -menuWidth + closeThreshold) {
				openMenu();
			} else {
				// Snap back to original position
				updatePosition(menuPosition);
			}
		}

		isDragging = false;
	};

	onMount(() => {
		updatePosition(menuPosition);

		document.addEventListener('touchstart', handleTouchStart, { passive: true });
		document.addEventListener('touchmove', handleTouchMove, { passive: true });
		document.addEventListener('touchend', handleTouchEnd);

		return () => {
			document.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
		};
	});

	run(() => {
		if (containerElement) {
			updatePosition(menuPosition);
		}
	});
</script>

<div bind:this={containerElement} class="side-menu-container sm:hidden">
	<!-- Background overlay (max 60% opacity) -->
	<div
		class="pointer-events-none fixed inset-0 z-40 bg-black sm:hidden"
		style="opacity: var(--overlay-opacity);"
	></div>

	<nav
		class="fixed bottom-0 left-0 top-0 z-50 grid w-64 grid-rows-[1fr_auto] overflow-hidden bg-base-100 p-4 shadow-lg sm:hidden"
	>
		<div class="flex-1 overflow-y-auto pt-16">Content here</div>

		<FeedbackButton />
	</nav>

	<!-- Clickable area to close menu when open -->
	{#if $isMenuOpen}
		<div class="z-45 fixed inset-0 sm:hidden" onclick={closeMenu}></div>
	{/if}
</div>

<style>
	.side-menu-container {
		--menu-position: -256px;
		--overlay-opacity: 0;
		--transition-duration: 0.2s;
	}

	.side-menu-container > * {
		transition:
			transform var(--transition-duration) ease-out,
			opacity var(--transition-duration) ease-out;
	}

	nav {
		transform: translateX(var(--menu-position));
		touch-action: pan-y;
		will-change: transform;
	}
</style>

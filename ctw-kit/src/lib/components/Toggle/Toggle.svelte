<script lang="ts">
	import { type ToggleProps } from ".";

	let {
		checked = false,
		label = undefined,
		className = undefined,
		onChange,
	} = $props() as ToggleProps;

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		onChange?.({ checked });
	}
</script>

<label class="flex cursor-pointer items-center gap-2">
	{#if label}
		<span class="text-sm">{label}</span>
	{/if}
	<input
		type="checkbox"
		class={"toggle " + className}
		{checked}
		onchange={handleChange}
	/>
</label>

<style>
	.toggle {
		flex-shrink: 0;
		--tglbg: var(--fallback-b1, oklch(var(--b1) / 1));
		--handleoffset: 1.5rem /* 24px */;
		--handleoffsetcalculator: calc(var(--handleoffset) * -1);
		--togglehandleborder: 0 0;
		height: 1.5rem /* 24px */;
		width: 3rem /* 48px */;
		cursor: pointer;
		appearance: none;
		border-radius: var(--rounded-badge, 1.9rem /* 30.4px */);
		border-width: 1px;
		border-color: currentColor;
		background-color: currentColor;
		color: var(--fallback-bc, oklch(var(--bc) / 0.5));
		transition:
			background,
			box-shadow var(--animation-input, 0.2s) ease-out;
		box-shadow:
			var(--handleoffsetcalculator) 0 0 2px var(--tglbg) inset,
			0 0 0 2px var(--tglbg) inset,
			var(--togglehandleborder);
	}

	.toggle:focus-visible {
		outline-style: solid;
		outline-width: 2px;
		outline-offset: 2px;
		outline-color: var(--fallback-bc, oklch(var(--bc) / 0.2));
	}
	.toggle:hover {
		background-color: currentColor;
	}

	.toggle:checked {
		background-image: none;
		--handleoffsetcalculator: var(--handleoffset);
		--tw-text-opacity: 1;
		color: var(--fallback-bc, oklch(var(--bc) / var(--tw-text-opacity)));
	}

	.toggle:indeterminate {
		--tw-text-opacity: 1;
		color: var(--fallback-bc, oklch(var(--bc) / var(--tw-text-opacity)));
		box-shadow:
			calc(var(--handleoffset) / 2) 0 0 2px var(--tglbg) inset,
			calc(var(--handleoffset) / -2) 0 0 2px var(--tglbg) inset,
			0 0 0 2px var(--tglbg) inset;
	}

	.toggle:disabled {
		cursor: not-allowed;
		--tw-border-opacity: 1;
		border-color: var(
			--fallback-bc,
			oklch(var(--bc) / var(--tw-border-opacity))
		);
		background-color: transparent;
		opacity: 0.3;
		--togglehandleborder: 0 0 0 3px var(--fallback-bc, oklch(var(--bc) / 1))
				inset,
			var(--handleoffsetcalculator) 0 0 3px
				var(--fallback-bc, oklch(var(--bc) / 1)) inset;
	}
</style>

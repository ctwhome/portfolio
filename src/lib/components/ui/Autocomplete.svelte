<script>
	import { onMount } from 'svelte';
	let searchValue = '';
	let options = [];
	let filteredOptions = [];
	let selectedIndex = -1;
	let showDropdown = false;
	let timeoutId = null;

	function handleInput(event) {
		searchValue = event.target.value;
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fetchOptions(searchValue);
		}, 500);
	}

	async function fetchOptions(searchTerm) {
		try {
			const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${searchTerm}`);
			const data = await response.json();
			options = data.map((post) => post.title);
			filteredOptions = options.filter((option) =>
				option.toLowerCase().includes(searchValue.toLowerCase())
			);
			selectedIndex = -1;
			showDropdown = true;
		} catch (error) {
			console.error(error);
		}
	}

	function handleKeyDown(event) {
		switch (event.key) {
			case 'ArrowDown':
				if (selectedIndex < filteredOptions.length - 1) {
					selectedIndex++;
				}
				break;
			case 'ArrowUp':
				if (selectedIndex > 0) {
					selectedIndex--;
				}
				break;
			case 'Enter':
				if (selectedIndex !== -1) {
					searchValue = filteredOptions[selectedIndex];
				}
				showDropdown = false;
				break;
			case 'Escape':
				showDropdown = false;
				break;
			default:
				break;
		}
	}

	onMount(() => {
		fetchOptions('');
	});
</script>

<div>
	<div class="text-sm mb-4">
		Input search with auto complete, defer and keyboard navigatio (WIP).
	</div>
	<div class="relative">
		<input
			class="input border-2 border-gray-300 rounded-md w-full"
			type="text"
			bind:value={searchValue}
			on:input={handleInput}
			on:keydown={handleKeyDown}
			placeholder="Search..."
		/>
	</div>

	{#if showDropdown}
		{#if searchValue}
			<ul class="bg-base-200 max-h-60 overflow-auto">
				{#each filteredOptions as option, i}
					<li
						class="p-3 hover:bg-secondary hover:text-secondary-content"
						class:bg-secondary={i === selectedIndex}
						class:text-secondary-content={i === selectedIndex}
					>
						{option}
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>

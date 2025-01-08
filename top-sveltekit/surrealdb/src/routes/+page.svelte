<script lang="ts">
	import LoginButton from '$components/ui/Login/LoginButton.svelte';
	import Todo from '$lib/components/Todo.svelte';
	import { page } from '$app/stores';
</script>

{#if $page.data.session}
	<Todo />
{:else}
	<div class="flex flex-col items-center justify-center overflow-auto">
		<div class="">
			<div class="text-neutral-content text-center">
				<div class="max-w-md">
					<h1 class="mb-5 text-5xl font-bold">Top-sveltekit</h1>
					<p class="mb-5">
						Experience the power of advanced AI assistants in a native-like app interface.
					</p>

					<LoginButton />
				</div>
			</div>
		</div>
	</div>
{/if}

<script lang="ts">
	import { onMount } from 'svelte';
	import { todoStore } from '$lib/stores/todoStore';
	import { page } from '$app/stores';
	import AddIcon from '~icons/material-symbols/add';
	import ErrorIcon from '~icons/material-symbols/error';
	import DeleteIcon from '~icons/material-symbols/delete';

	let newTodoTitle = '';

	onMount(() => {
		if ($page.data.session) {
			todoStore.fetchTodos();
		}
	});

	async function handleSubmit() {
		if (!newTodoTitle.trim()) return;
		await todoStore.addTodo(newTodoTitle.trim());
		newTodoTitle = '';
	}

	async function handleToggle(id: string, completed: boolean) {
		await todoStore.toggleTodo(id, !completed);
	}

	async function handleDelete(id: string) {
		await todoStore.deleteTodo(id);
	}
</script>

<div class="mx-auto w-full max-w-2xl p-4">
	<form on:submit|preventDefault={handleSubmit} class="mb-6 flex gap-2">
		<input
			type="text"
			bind:value={newTodoTitle}
			placeholder="Add a new todo..."
			class="input input-bordered flex-grow"
		/>
		<button type="submit" class="btn btn-primary">
			<AddIcon class="h-5 w-5" />
			Add
		</button>
	</form>

	{#if $todoStore.loading}
		<div class="flex justify-center">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if $todoStore.error}
		<div class="alert alert-error">
			<ErrorIcon class="h-5 w-5" />
			<span>{$todoStore.error}</span>
		</div>
	{:else}
		<div class="space-y-2">
			{#each $todoStore.todos as todo (todo.id)}
				<div class="card bg-base-200">
					<div class="card-body flex-row items-center justify-between p-4">
						<div class="flex flex-grow items-center gap-3">
							<input
								type="checkbox"
								checked={todo.completed}
								on:change={() => handleToggle(todo.id, todo.completed)}
								class="checkbox"
							/>
							<span class:line-through={todo.completed}>
								{todo.title}
							</span>
						</div>
						<button on:click={() => handleDelete(todo.id)} class="btn btn-ghost btn-sm text-error">
							<DeleteIcon class="h-5 w-5" />
						</button>
					</div>
				</div>
			{/each}

			{#if $todoStore.todos.length === 0}
				<div class="py-4 text-center text-gray-500">No todos yet. Add one above!</div>
			{/if}
		</div>
	{/if}
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { createClient } from '@supabase/supabase-js';
	import { env } from '$env/dynamic/public';

	const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
	const SUPABASE_KEY = env.PUBLIC_SUPABASE_KEY;

	const supabase = createClient(
		SUPABASE_URL || 'no database url provided',
		SUPABASE_KEY || 'no database role provided',
		{ db: { schema: 'portfolio' } }
	);

	let todos = [];

	onMount(async () => {
		console.log('🎹 todos', SUPABASE_URL);

		const { data, error } = await supabase.from('todos').select('*');
		if (error) {
			console.error('Error fetching todos:', error);
		} else {
			todos = data;
		}
	});
</script>

<div class="flex flex-col gap-4">
	<ul class="list-disc list-inside">
		{#each todos as todo}
			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-2">
					<input type="checkbox" checked={todo.isChecked} class="checkbox" />
					<span class="label-text" class:line-through={todo.isChecked}>{todo.content}</span>
				</label>
			</div>
		{/each}
	</ul>
</div>

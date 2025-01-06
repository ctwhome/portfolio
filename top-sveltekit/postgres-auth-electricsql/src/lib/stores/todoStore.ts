import { writable } from 'svelte/store';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

function createTodoStore() {
  const { subscribe, set, update } = writable<TodoState>({
    todos: [],
    loading: false,
    error: null
  });

  return {
    subscribe,
    fetchTodos: async () => {
      update(state => ({ ...state, loading: true }));
      try {
        const response = await fetch('/api/todos');
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();

        update(state => ({
          ...state,
          todos: data,
          loading: false,
          error: null
        }));
      } catch (error) {
        update(state => ({
          ...state,
          error: error instanceof Error ? error.message : 'An error occurred',
          loading: false
        }));
      }
    },

    addTodo: async (title: string) => {
      update(state => ({ ...state, loading: true }));
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        if (!response.ok) throw new Error('Failed to add todo');
        const data = await response.json();

        update(state => ({
          ...state,
          todos: [data, ...state.todos],
          loading: false,
          error: null
        }));
      } catch (error) {
        update(state => ({
          ...state,
          error: error instanceof Error ? error.message : 'An error occurred',
          loading: false
        }));
      }
    },

    toggleTodo: async (id: string, completed: boolean) => {
      update(state => ({ ...state, loading: true }));
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed })
        });
        if (!response.ok) throw new Error('Failed to update todo');
        const data = await response.json();

        update(state => ({
          ...state,
          todos: state.todos.map(todo =>
            todo.id === id ? data : todo
          ),
          loading: false,
          error: null
        }));
      } catch (error) {
        update(state => ({
          ...state,
          error: error instanceof Error ? error.message : 'An error occurred',
          loading: false
        }));
      }
    },

    deleteTodo: async (id: string) => {
      update(state => ({ ...state, loading: true }));
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete todo');

        update(state => ({
          ...state,
          todos: state.todos.filter(todo => todo.id !== id),
          loading: false,
          error: null
        }));
      } catch (error) {
        update(state => ({
          ...state,
          error: error instanceof Error ? error.message : 'An error occurred',
          loading: false
        }));
      }
    }
  };
}

export const todoStore = createTodoStore();

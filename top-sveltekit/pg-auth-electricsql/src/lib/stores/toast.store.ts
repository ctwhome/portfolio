import { writable } from 'svelte/store';
import toast from 'svelte-french-toast';

function createToastStore() {
  const { subscribe, update } = writable({});

  return {
    subscribe,
    success: (message: string) => {
      update(() => {
        toast.success(message, {
          position: 'top-center',
          duration: 5000
        });
        return {};
      });
    },
    error: (message: string) => {
      update(() => {
        toast.error(message, {
          position: 'top-center',
          duration: 5000
        });
        return {};
      });
    }
  };
}

export const toastStore = createToastStore();
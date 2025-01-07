import { writable } from 'svelte/store';

export const isMenuOpen = writable(false);

export function toggleMenu() {
  isMenuOpen.update(state => !state);
}

export function closeMenu() {
  isMenuOpen.set(false);
}

export function openMenu() {
  isMenuOpen.set(true);
}
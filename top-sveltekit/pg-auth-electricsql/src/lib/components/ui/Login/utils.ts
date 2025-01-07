import type { AuthError } from './types';

export function closeLoginModal() {
  const modalCheckbox = document.getElementById('login-modal') as HTMLInputElement;
  if (modalCheckbox) {
    modalCheckbox.checked = false;
  }
}

export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as AuthError).message;
  }
  return 'An unexpected error occurred';
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  // Add more password validation rules as needed
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

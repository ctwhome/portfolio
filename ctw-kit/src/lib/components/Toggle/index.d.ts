import type { ComponentType } from 'svelte';

export interface ToggleProps {
  checked?: boolean;
  label?: string | undefined;
  className?: any;
  onChange?: (event: { checked: boolean }) => void;
}

declare const Toggle: ComponentType<ToggleProps>;
export default Toggle;

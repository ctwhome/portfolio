export interface TiltOptions {
  max: number;
  perspective: number;
  scale: number;
  speed: number;
  transition: boolean;
  axis: "x" | "y" | null | undefined;  // Fixed to match vanilla-tilt types
  reset: boolean;
  easing: string;
  glare: boolean;
  'max-glare': number;
  'glare-prerender': boolean;
}

export interface TiltContentProps {
  class?: string;
}

export interface TiltEvents {
  click: MouseEvent | KeyboardEvent;
}

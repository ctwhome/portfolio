// Components
export { default as SEO } from './components/SEO/SEO.svelte';
export { default as Hello } from './components/Hello/Hello.svelte';
export { default as Carousel } from './components/Carousel/Carousel.svelte';
export { default as TiltContent } from './components/TiltContent/TiltContent.svelte';
export { default as ThemeChange } from './components/ThemeChange/ThemeChange.svelte';
export { default as SendEmail } from './components/Emails/SendEmail.svelte';
export { default as FeedbackButton } from './components/Feedback/FeedbackButton.svelte';
export { default as Toggle } from './components/Toggle/Toggle.svelte';

// Types
export type { SiteSettings } from './components/SEO';
export type { SendFeedbackOptions } from './components/Feedback/emailService';
export type { ToggleProps } from './components/Toggle';

// Utilities
export { sendFeedback } from './components/Feedback/emailService';

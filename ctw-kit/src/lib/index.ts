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
export type { SiteSettings } from './components/SEO/types';
export type { SendFeedbackOptions, EmailService, SendEmailOptions, SendEmailResult } from './components/Feedback/emailService';
export type { ToggleProps } from './components/Toggle/types';
export type { GalleryItem, CarouselProps } from './components/Carousel/types';
export type { EmailFormData, SendEmailProps } from './components/Emails/types';
export type { UserInfo, BrowserInfo, FeedbackButtonProps, FeedbackResponse } from './components/Feedback/types';
export type { HelloProps } from './components/Hello/types';
export type { Theme, ThemeChangeProps } from './components/ThemeChange/types';
export type { TiltOptions, TiltContentProps, TiltEvents } from './components/TiltContent/types';

// Utilities
export { sendFeedback } from './components/Feedback/emailService';

export interface UserInfo {
  id?: string;
  name?: string;
  email?: string;
  photoURL?: string;
}

export interface BrowserInfo {
  browser: string;
  os: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
}

import type { EmailService, SendEmailResult } from './emailService';

export interface FeedbackButtonProps {
  showButton?: boolean;
  userInfo?: UserInfo | null;
  emailService: EmailService;
  from: string;
  to: string;
}

export type FeedbackResponse = SendEmailResult;

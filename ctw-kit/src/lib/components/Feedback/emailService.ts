import { Resend } from 'resend';

export interface EmailConfig {
  apiKey: string;
  from: string;
  to: string;
}

export interface SendFeedbackOptions {
  emailContent: string;
  config: EmailConfig;
}

export async function sendFeedback({ emailContent, config }: SendFeedbackOptions) {
  try {
    const resend = new Resend(config.apiKey);

    const data = await resend.emails.send({
      from: config.from,
      to: config.to,
      subject: 'Feedback from website',
      html: emailContent
    });

    return { success: true, message: 'Feedback sent successfully', data };
  } catch (error) {
    console.error('Error sending feedback:', error);
    return { success: false, message: 'Failed to send feedback', error };
  }
}

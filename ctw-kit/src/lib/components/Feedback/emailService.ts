export interface EmailService {
  sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
}

export interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  content: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
  data?: unknown;
  error?: unknown;
}

export interface SendFeedbackOptions {
  emailContent: string;
  emailService: EmailService;
  from: string;
  to: string;
}

export async function sendFeedback({ emailContent, emailService, from, to }: SendFeedbackOptions): Promise<SendEmailResult> {
  try {
    const result = await emailService.sendEmail({
      from,
      to,
      subject: 'Feedback from website',
      content: emailContent
    });

    return result;
  } catch (error) {
    console.error('Error sending feedback:', error);
    return {
      success: false,
      message: 'Failed to send feedback',
      error
    };
  }
}

// API functions for top-sveltekit

/**
 * Sends an email with the given subject and content.
 * @param subject The subject of the email
 * @param content The content of the email
 * @returns A promise that resolves with the result of the email sending process
 */
export async function sendEmail(subject: string, content: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return { success: true, message: 'Recieved loud and clear\n Thanks for your feedback!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message || 'Failed to send feedback' };
  }
}
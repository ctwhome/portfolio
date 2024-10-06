import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const AUTH_RESEND_KEY = env.AUTH_RESEND_KEY;

export const POST: RequestHandler = async ({ request }) => {
  const { subject, content } = await request.json();
  const html = `
    ${content}
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + AUTH_RESEND_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'feedback-chatdiamond@ctwhome.com',
        to: 'ctw@ctwhome.com', // Replace with your support email
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Network response was not ok: ${JSON.stringify(errorDetails)}`);
    }

    const data = await response.json();
    console.log('Feedback email sent successfully:', data);
    return json({ success: true, message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return json({ success: false, message: 'Failed to send feedback: ' + error.message }, { status: 500 });
  }
}
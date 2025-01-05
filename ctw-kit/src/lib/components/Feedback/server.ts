import { Resend } from 'resend';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { emailContent } = await request.json();

    const data = await resend.emails.send({
      from: 'Feedback <onboarding@resend.dev>',
      to: 'your-email@example.com', // Replace with your email
      subject: 'Feedback from website',
      html: emailContent
    });

    return json({ success: true, message: 'Feedback sent successfully', data });
  } catch (error) {
    console.error('Error sending feedback:', error);
    return json(
      { success: false, message: 'Failed to send feedback', error },
      { status: 500 }
    );
  }
};

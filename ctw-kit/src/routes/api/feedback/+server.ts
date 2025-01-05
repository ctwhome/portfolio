import { Resend } from 'resend';
import { json, type RequestHandler } from '@sveltejs/kit';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

interface FeedbackRequest {
  emailContent: string;
}

export const POST = (async ({ request }) => {
  try {
    const { emailContent } = await request.json() as FeedbackRequest;

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
}) satisfies RequestHandler;

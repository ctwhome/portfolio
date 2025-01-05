import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const RESEND_API_KEY = env.RESEND_API_KEY;

export const POST: RequestHandler = async ({ request }) => {
  const { email, name, subject } = await request.json();
  const html = `
    <h1>Hello ${name}</h1>
    <p>Thanks for signing up!</p>
    <p>We're excited to have you on board.</p>
    <p>Best,</p>
    <p>Ctwhome.</p>
  `;
  console.log('🎹 email', RESEND_API_KEY);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ctw@ctwhome.com',
        to: email,
        subject: subject || 'Welcome email',
        html: html,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Network response was not ok: ${JSON.stringify(errorDetails)}`);
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    return new Response('Email sent', { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response('Failed to send email: ' + error.message, { status: 500 });
  }
}

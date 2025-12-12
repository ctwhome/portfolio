import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
  const RESEND_API_KEY = env.RESEND_API_KEY;
  const data = await request.formData();
  const name = data.get('name')?.toString();
  const email = data.get('email')?.toString();
  const message = data.get('message')?.toString();

  if (!name || !email || !message) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Contact Form <ctw@ctwhome.com>',
        to: 'ctw@ctwhome.com',
        subject: `New Contact Form Submission from ${name}`,
        html: `
					<h2>New Contact Form Submission</h2>
					<p><strong>Name:</strong> ${name}</p>
					<p><strong>Email:</strong> ${email}</p>
					<p><strong>Message:</strong></p>
					<p>${message}</p>
				`,
        reply_to: email
      })
    });

    if (!response.ok) {
      const resendError = await response.json();
      console.error('Resend API error:', resendError);
      return json({ error: resendError.message || 'Failed to send email' }, { status: response.status });
    }

    const result = await response.json();
    return json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error sending email:', error);
    return json({ error: 'Failed to send email' }, { status: 500 });
  }
}

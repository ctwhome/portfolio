# Feedback Button Component

A self-contained feedback button component that collects user feedback and sends it via email using Resend.

## Features

- Collects and formats user feedback
- Sends formatted HTML emails using Resend (server-side)
- Shows toast notifications using svelte-french-toast
- Collects browser information automatically
- Optional user information support
- Styled with DaisyUI
- All dependencies included (no need to install Resend or svelte-french-toast separately)

## Setup

### 1. Environment Configuration

Add your Resend API key to `.env`:
```env
RESEND_API_KEY=your_resend_api_key_here
```

### 2. Server Endpoint Setup

Create a server endpoint at `/routes/api/feedback/+server.ts`:

```typescript
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
      from: 'Feedback <onboarding@resend.dev>', // Or your verified domain
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
```

Important notes about the server endpoint:
- Replace 'your-email@example.com' with your email address
- The 'from' address can be customized if you have a verified domain in Resend
- The endpoint expects HTML content in the request body
- Returns a JSON response with success/error information

### 3. TypeScript Setup

Add svelte-french-toast types to your `app.d.ts`:
```typescript
/// <reference types="svelte-french-toast" />
```

## Usage

```svelte
<script>
  import { FeedbackButton } from '$lib/components/feedback';

  // Basic usage
  const userInfo = {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    photoURL: "https://example.com/photo.jpg"
  };
</script>

<FeedbackButton {userInfo} />
```

The component will:
- Show a feedback button that opens a modal when clicked
- Collect the user's feedback
- Format it into a nice HTML email with user and browser information
- Send it server-side using Resend
- Show toast notifications for loading/success/error states

## Server Response Format

The server endpoint returns responses in this format:

Success:
```typescript
{
  success: true,
  message: 'Feedback sent successfully',
  data: ResendAPIResponse
}
```

Error:
```typescript
{
  success: false,
  message: 'Failed to send feedback',
  error: ErrorDetails
}
```

All email sending is handled server-side to keep the Resend API key secure. The component includes all necessary dependencies (Resend and svelte-french-toast) so you don't need to install them separately.

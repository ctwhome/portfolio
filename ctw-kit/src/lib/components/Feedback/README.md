# Feedback Component

A customizable feedback button component that collects user feedback and sends it via email using Resend.

## Features

- Modal-based feedback form
- Collects browser and system information
- Optional user information display
- Email notifications using Resend
- Toast notifications for user feedback
- DaisyUI styling

## Usage

```svelte
<script>
  import { FeedbackButton } from 'ctw-kit';

  // Configure email settings
  const emailConfig = {
    apiKey: 'your-resend-api-key',
    from: 'Feedback <feedback@yourdomain.com>',
    to: 'you@yourdomain.com'
  };

  // Optional user information
  const userInfo = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    photoURL: 'https://example.com/photo.jpg'
  };
</script>

<FeedbackButton
  emailConfig={emailConfig}
  userInfo={userInfo}
  showButton={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| emailConfig | `EmailConfig` | required | Configuration for email sending using Resend |
| userInfo | `Object \| null` | `null` | Optional user information to include in feedback |
| showButton | `boolean` | `true` | Whether to show the feedback button |

### EmailConfig Type

```typescript
interface EmailConfig {
  apiKey: string;  // Your Resend API key
  from: string;    // Sender email address
  to: string;      // Recipient email address
}
```

### UserInfo Type

```typescript
interface UserInfo {
  id?: string;
  name?: string;
  email?: string;
  photoURL?: string;
}
```

## Styling

The component uses DaisyUI classes for styling. You can customize the appearance by modifying your DaisyUI theme or overriding the following classes:

- `btn` - Button styling
- `btn-sm` - Small button size
- `btn-ghost` - Ghost button style (when modal is closed)
- `btn-secondary` - Secondary button style (when modal is open)
- `modal` - Modal container
- `modal-box` - Modal content box
- `textarea` - Feedback input field

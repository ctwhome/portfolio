function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function text(value) {
  return String(value ?? '').trim();
}

function buildEmail({ feedback, browserInfo }) {
  const info = browserInfo || {};
  const rows = [
    ['URL', info.url],
    ['Path', info.path],
    ['Browser', info.browser],
    ['User Agent', info.userAgent],
    ['Language', info.language],
    ['Platform', info.platform],
    ['Screen Size', info.screenWidth && info.screenHeight ? `${info.screenWidth}x${info.screenHeight}` : ''],
    ['Viewport', info.viewportWidth && info.viewportHeight ? `${info.viewportWidth}x${info.viewportHeight}` : '']
  ];

  const feedbackHtml = escapeHtml(feedback).replace(/\n/g, '<br>');
  const rowsHtml = rows
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`)
    .join('');

  return `
    <html>
      <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; line-height: 1.55;">
        <h1>Feedback</h1>
        <h2>Feedback:</h2>
        <p style="font-size:18px; white-space: normal;">${feedbackHtml}</p>
        <h2>Browser Information:</h2>
        <ul>${rowsHtml}</ul>
      </body>
    </html>
  `;
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    return sendJson(response, 405, { success: false, message: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return sendJson(response, 500, { success: false, message: 'Feedback email is not configured.' });
  }

  const body = request.body || {};
  const feedback = text(body.feedback);
  if (!feedback) {
    return sendJson(response, 400, { success: false, message: 'Feedback is required.' });
  }
  if (feedback.length > 5000) {
    return sendJson(response, 400, { success: false, message: 'Feedback is too long.' });
  }

  const to = process.env.FEEDBACK_TO || 'ctw@ctwhome.com';
  const from = process.env.RESEND_FROM || 'CTW Studio <contact@ctw.studio>';
  const subject = process.env.FEEDBACK_SUBJECT || 'Feedback from ctw.studio';
  const html = buildEmail({ feedback, browserInfo: body.browserInfo });

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, subject, html })
    });

    const resendBody = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      console.error('Resend feedback error:', resendBody);
      return sendJson(response, 502, { success: false, message: 'Failed to send feedback email.' });
    }

    return sendJson(response, 200, { success: true, message: 'Feedback sent.', id: resendBody.id });
  } catch (error) {
    console.error('Feedback email exception:', error);
    return sendJson(response, 502, { success: false, message: 'Failed to send feedback email.' });
  }
};

(function () {
  if (window.__ctwFeedbackLoaded) return;
  window.__ctwFeedbackLoaded = true;

  const script = document.currentScript;
  const base = script?.getAttribute('data-base') || '/';
  const endpoint = new URL(`${base}api/feedback`, window.location.href).toString();

  const style = document.createElement('style');
  style.textContent = `
    .ctw-feedback-button {
      display: inline-flex;
      align-items: center;
      min-height: 2.75rem;
      border: 0;
      border-bottom: 1px solid currentColor;
      border-radius: 0;
      background: transparent;
      color: #f2efe9;
      padding: 0;
      font: 500 0.9rem/1.3 'Inter', system-ui, sans-serif;
      cursor: pointer;
    }
    .ctw-feedback-entry {
      display: flex;
      justify-content: flex-end;
      padding: 1rem max(1rem, calc((100vw - 75rem) / 2));
      background: #050505;
    }
    .ctw-feedback-button:hover,
    .ctw-feedback-button:focus-visible {
      color: #f7b500;
      outline: 2px solid #f7b500;
      outline-offset: 3px;
    }
    .ctw-feedback-modal[hidden] { display: none; }
    .ctw-feedback-modal {
      position: fixed;
      inset: 0;
      z-index: 280;
      display: grid;
      place-items: center;
      padding: 1.25rem;
      background: rgba(0, 0, 0, 0.66);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
    .ctw-feedback-card {
      width: min(100%, 34rem);
      border: 1px solid rgba(242, 239, 233, 0.14);
      border-radius: 1.35rem;
      background: rgba(12, 12, 10, 0.96);
      color: #f2efe9;
      box-shadow: 0 28px 90px rgba(0, 0, 0, 0.55);
      overflow: hidden;
    }
    .ctw-feedback-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.35rem 1.35rem 0.8rem;
    }
    .ctw-feedback-title {
      margin: 0;
      font-family: 'Clash Display', 'Inter', 'Archivo', system-ui, sans-serif;
      font-size: 1.45rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .ctw-feedback-kicker {
      margin: 0 0 0.35rem;
      color: #f7b500;
      font: 500 0.66rem/1.3 'IBM Plex Mono', ui-monospace, monospace;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .ctw-feedback-close {
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: #f2efe9;
      width: 2.25rem;
      height: 2.25rem;
      cursor: pointer;
      font-size: 1.3rem;
      line-height: 1;
    }
    .ctw-feedback-body { padding: 0 1.35rem 1.35rem; }
    .ctw-feedback-textarea {
      width: 100%;
      min-height: 10rem;
      resize: vertical;
      border: 1px solid rgba(242, 239, 233, 0.16);
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.055);
      color: #f2efe9;
      padding: 1rem;
      font: 400 1rem/1.55 'Inter', 'Archivo', system-ui, sans-serif;
    }
    .ctw-feedback-textarea:focus {
      border-color: rgba(247, 181, 0, 0.72);
      outline: none;
      box-shadow: 0 0 0 3px rgba(247, 181, 0, 0.12);
    }
    .ctw-feedback-meta {
      margin-top: 0.75rem;
      color: rgba(242, 239, 233, 0.58);
      font: 400 0.74rem/1.45 'IBM Plex Mono', ui-monospace, monospace;
      word-break: break-word;
    }
    .ctw-feedback-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.85rem;
      margin-top: 1.1rem;
    }
    .ctw-feedback-action {
      border: 1px solid rgba(242, 239, 233, 0.18);
      border-radius: 999px;
      background: transparent;
      color: #f2efe9;
      padding: 0.78rem 1rem;
      font-weight: 700;
      cursor: pointer;
    }
    .ctw-feedback-submit {
      border-color: #f7b500;
      background: #f7b500;
      color: #0c0c0a;
    }
    .ctw-feedback-submit:disabled { opacity: 0.56; cursor: wait; }
    .ctw-feedback-status {
      min-height: 1.25rem;
      margin-top: 0.9rem;
      color: rgba(242, 239, 233, 0.72);
      font-size: 0.9rem;
    }
    .ctw-feedback-status.is-error { color: #ffb4a8; }
    .ctw-feedback-status.is-success { color: #9fe6b8; }
    @media (max-width: 640px) {
      .ctw-feedback-actions { flex-direction: column-reverse; align-items: stretch; }
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.className = 'ctw-feedback-modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'ctw-feedback-title');
  modal.innerHTML = `
    <div class="ctw-feedback-card" role="document">
      <div class="ctw-feedback-head">
        <div>
          <p class="ctw-feedback-kicker">Feedback</p>
          <h2 class="ctw-feedback-title" id="ctw-feedback-title">What should improve?</h2>
        </div>
        <button class="ctw-feedback-close" type="button" aria-label="Close feedback form">×</button>
      </div>
      <form class="ctw-feedback-body">
        <textarea class="ctw-feedback-textarea" name="feedback" id="ctw-feedback-textarea" rows="6" maxlength="5000" required placeholder="Write your feedback here"></textarea>
        <div class="ctw-feedback-meta" id="ctw-feedback-meta"></div>
        <div class="ctw-feedback-actions">
          <button class="ctw-feedback-action" type="button" data-close>Cancel</button>
          <button class="ctw-feedback-action ctw-feedback-submit" type="submit">Send Feedback</button>
        </div>
        <div class="ctw-feedback-status" role="status" aria-live="polite"></div>
      </form>
    </div>
  `;

  const button = document.createElement('button');
  button.className = 'ctw-feedback-button';
  button.type = 'button';
  button.textContent = 'Feedback';
  button.setAttribute('aria-haspopup', 'dialog');

  document.body.append(modal);
  const contactNav = document.querySelector('.ctw-footer__links[aria-label="Contact destinations"]');
  if (contactNav) {
    contactNav.append(button);
  } else {
    const entry = document.createElement('div');
    entry.className = 'ctw-feedback-entry';
    entry.append(button);
    document.body.append(entry);
  }

  const textarea = modal.querySelector('.ctw-feedback-textarea');
  const form = modal.querySelector('form');
  const status = modal.querySelector('.ctw-feedback-status');
  const meta = modal.querySelector('#ctw-feedback-meta');
  const submit = modal.querySelector('.ctw-feedback-submit');
  let previousFocus = null;

  function detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown Browser';
  }

  function browserInfo() {
    return {
      browser: detectBrowser(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform || 'Unknown Platform',
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      path: window.location.pathname,
      url: window.location.href
    };
  }

  function updateMeta() {
    const info = browserInfo();
    meta.innerHTML = `<div>Page: ${escapeHtml(info.path)}</div><div>Browser: ${escapeHtml(info.browser)} • Platform: ${escapeHtml(info.platform)}</div>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  function setStatus(message, type) {
    status.textContent = message || '';
    status.classList.toggle('is-error', type === 'error');
    status.classList.toggle('is-success', type === 'success');
  }

  function openModal() {
    previousFocus = document.activeElement;
    updateMeta();
    setStatus('');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => { if (!modal.hidden) textarea.focus(); }, 0);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    setStatus('');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  button.addEventListener('click', openModal);
  modal.querySelector('.ctw-feedback-close').addEventListener('click', closeModal);
  modal.querySelector('[data-close]').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (!modal.hidden && event.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const feedback = textarea.value.trim();
    if (!feedback) {
      setStatus('Write a little feedback first.', 'error');
      textarea.focus();
      return;
    }

    submit.disabled = true;
    setStatus('Sending feedback…');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, browserInfo: browserInfo() })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send feedback.');
      }
      textarea.value = '';
      setStatus('Feedback sent. Thank you.', 'success');
      setTimeout(closeModal, 850);
    } catch (error) {
      console.error('Error sending feedback:', error);
      setStatus(error.message || 'Failed to send feedback. Please try again later.', 'error');
    } finally {
      submit.disabled = false;
    }
  });
})();

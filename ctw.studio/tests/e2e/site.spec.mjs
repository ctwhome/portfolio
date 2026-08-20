import { expect, test } from '@playwright/test';

test('home remains substantive without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Interaction Design\s+Engineering/);
  await expect(page.getByRole('link', { name: 'CTW Studio' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Work', exact: true }).first()).toHaveAttribute('href', '/portfolio/');
  await expect(page.getByRole('link', { name: 'contact@ctw.studio' }).first()).toHaveAttribute('href', 'mailto:contact@ctw.studio');
  await expect(page.locator('.studio-offerings li')).toHaveCount(4);
  await expect(page.locator('.studio-process details')).toHaveCount(4);
  await page.locator('.studio-process summary').first().click();
  await expect(page.locator('.studio-process details').first()).toHaveAttribute('open', '');
  await expect(page.locator('.studio-quotes blockquote')).toHaveCount(5);
  await expect(page.locator('.studio-product img')).toHaveCount(5);
  await context.close();
});

for (const viewport of [
  { name: 'wide', width: 1440, height: 900 },
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'tablet-wide', width: 1024, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'compact', width: 390, height: 844 },
  { name: 'compact-short-reflow', width: 390, height: 667, rootFontScale: 1.25 }
]) {
  test(`homepage ${viewport.name} layout stays accessible and error-free`, async ({ page }) => {
    test.setTimeout(60_000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'networkidle' });
    if (viewport.rootFontScale) {
      await page.addStyleTag({ content: `html { font-size: ${viewport.rootFontScale * 100}% !important; }` });
    }

    const feedbackButton = page.locator('body > .ctw-feedback-button');
    await expect(feedbackButton).toHaveCount(1);
    await expect(feedbackButton).toHaveCSS('position', 'fixed');

    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      elements: [...document.querySelectorAll('*')]
        .filter((element) => element.getBoundingClientRect().right > innerWidth + 0.5)
        .map((element) => `${element.tagName.toLowerCase()}.${element.className}`)
        .slice(0, 10)
    }));
    expect(overflow.documentWidth, overflow.elements.join(', ')).toBeLessThanOrEqual(overflow.viewportWidth);

    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);

    const feedbackOverlaps = await page.evaluate(() => {
      const feedback = document.querySelector('.ctw-feedback-button')?.getBoundingClientRect();
      if (!feedback) return ['missing feedback'];
      const intersects = (rect) => rect.left < feedback.right && rect.right > feedback.left && rect.top < feedback.bottom && rect.bottom > feedback.top;
      return [...document.querySelectorAll('.studio-hero__actions a, .studio-facts__links a, .studio-founder a')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return intersects(rect);
        })
        .map((element) => element.className);
    });
    if (!viewport.rootFontScale) expect(feedbackOverlaps).toEqual([]);

    const firstProcess = page.locator('.studio-process details').first();
    const firstProcessSummary = firstProcess.locator('summary');
    await firstProcessSummary.scrollIntoViewIfNeeded();
    await firstProcessSummary.click();
    await expect(firstProcess).toHaveAttribute('open', '');
    await firstProcessSummary.press('Enter');
    await expect(firstProcess).not.toHaveAttribute('open', '');

    const collaborationIntro = page.locator('.studio-collaborations .studio-intro');
    if (viewport.width >= 1024) {
      await expect(collaborationIntro).toHaveCSS('position', 'sticky');
      await page.locator('.studio-collaborations').scrollIntoViewIfNeeded();
      await page.evaluate(() => scrollBy(0, 240));
      expect(await collaborationIntro.evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(112, 0);
    } else {
      await expect(collaborationIntro).toHaveCSS('position', 'static');
    }

    await page.locator('.studio-products').scrollIntoViewIfNeeded();
    for (const image of await page.locator('.studio-product img').all()) {
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
      const geometry = await image.evaluate((element) => {
        const imageRect = element.getBoundingClientRect();
        const cardRect = element.parentElement.getBoundingClientRect();
        return {
          objectFit: getComputedStyle(element).objectFit,
          ratioDelta: Math.abs(imageRect.width / imageRect.height - element.naturalWidth / element.naturalHeight),
          mediaDelta: Math.abs(imageRect.width / imageRect.height - cardRect.width / cardRect.height)
        };
      });
      expect(geometry.objectFit).toBe('contain');
      expect(geometry.ratioDelta).toBeLessThan(0.01);
      expect(geometry.mediaDelta).toBeLessThan(0.01);
    }

    const notes = page.locator('.studio-quotes');
    await expect(notes).toHaveAttribute('role', 'region');
    await expect(notes).toHaveAttribute('aria-labelledby', 'notes-title');
    await notes.scrollIntoViewIfNeeded();
    await notes.focus();
    await expect(notes).toBeFocused();
    const initialNotesScroll = await notes.evaluate((element) => element.scrollLeft);
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => notes.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialNotesScroll);
    expect(await notes.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');

    for (const control of await page.locator('.studio-home .ctw-button, .studio-process summary').all()) {
      const box = await control.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }

    expect(errors).toEqual([]);
  });
}

test('portfolio details remain reachable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/portfolio/');
  await page.locator('[data-project-link="data-storytelling"]').first().click();
  await expect(page).toHaveURL(/#data-storytelling$/);
  await expect(page.locator('#data-storytelling')).toBeVisible();
  await expect(page.locator('#data-storytelling-title')).toHaveText('Data Storytelling');
  await expect(page.getByRole('link', { name: 'Open original image' }).first()).toHaveAttribute(
    'href',
    '/portfolio/projects/data-storytelling/cover.avif'
  );
  await context.close();
});

test('gallery media loads only for opened dialog', async ({ page }) => {
  const galleryRequests = [];
  page.on('request', (request) => {
    const pathname = new URL(request.url()).pathname;
    if (pathname.startsWith('/portfolio/projects/')) galleryRequests.push(pathname);
  });

  await page.goto('/portfolio/', { waitUntil: 'networkidle' });
  expect(galleryRequests).toEqual([]);

  await page.locator('[data-project-link="data-storytelling"]').first().click();
  await page.waitForLoadState('networkidle');
  expect([...new Set(galleryRequests)].sort()).toEqual([
    '/portfolio/projects/data-storytelling/cover.avif',
    '/portfolio/projects/data-storytelling/gallery-1.avif',
    '/portfolio/projects/data-storytelling/gallery-2.avif',
    '/portfolio/projects/data-storytelling/gallery-3.avif',
    '/portfolio/projects/data-storytelling/gallery-4.avif'
  ]);
  expect(galleryRequests.every((path) => path.includes('/data-storytelling/'))).toBe(true);
});

test('Ajax video and poster load only after its dialog opens', async ({ page }) => {
  const targets = new Set([
    '/portfolio/projects/ajax-visual-intelligence/demo.mp4',
    '/portfolio/projects/ajax-visual-intelligence/video-poster.avif'
  ]);
  const requested = [];
  const available = [];
  page.on('request', (request) => {
    const pathname = new URL(request.url()).pathname;
    if (targets.has(pathname)) requested.push(pathname);
  });
  page.on('response', (response) => {
    const pathname = new URL(response.url()).pathname;
    if (targets.has(pathname) && response.ok()) available.push(pathname);
  });

  await page.goto('/portfolio/', { waitUntil: 'networkidle' });
  expect(requested).toEqual([]);
  expect(available).toEqual([]);

  await page.locator('[data-project-link="ajax-visual-intelligence"]').first().click();
  const dialog = page.locator('dialog#ajax-visual-intelligence');
  await expect(dialog.locator('.project-gallery__item').first().locator('video')).toHaveCount(1);
  expect(await dialog.evaluate((element) => {
    const lead = element.querySelector('.project-dialog__lead');
    const gallery = element.querySelector('.project-gallery');
    return Boolean(lead && gallery && (lead.compareDocumentPosition(gallery) & Node.DOCUMENT_POSITION_FOLLOWING));
  })).toBe(true);
  await expect.poll(() => [...new Set(requested)].sort()).toEqual([...targets].sort());
  await expect.poll(() => [...new Set(available)].sort()).toEqual([...targets].sort());
});

test('switching projects pauses Ajax video playback', async ({ page }) => {
  await page.goto('/portfolio/');
  await page.locator('[data-project-link="ajax-visual-intelligence"]').first().click();
  const dialog = page.locator('dialog#ajax-visual-intelligence');
  const video = dialog.locator('video');

  await video.evaluate((element) => element.play());
  await expect(video).toHaveJSProperty('paused', false);

  await dialog.locator('.project-next').click();
  await expect(video).toHaveJSProperty('paused', true);
});

test('native dialog uses one gallery history entry and restores focus on Escape', async ({ page }) => {
  await page.goto('/portfolio/');
  const first = page.locator('[data-project-link="data-storytelling"]').first();
  await first.evaluate((element) => element.scrollIntoView());
  const savedScrollY = await page.evaluate(() => window.scrollY);
  await first.focus();
  await first.click();
  const firstDialog = page.locator('dialog#data-storytelling');
  await expect(firstDialog).toHaveJSProperty('open', true);
  await expect(page).toHaveURL(/#data-storytelling$/);

  await firstDialog.locator('.project-next').click();
  await expect(page.locator('dialog#nlesc-portfolio')).toHaveJSProperty('open', true);
  await expect(page).toHaveURL(/#nlesc-portfolio$/);

  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expect(first).toBeFocused();
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - savedScrollY)).toBeLessThanOrEqual(2);
});

test('browser Back closes switched gallery instead of reopening prior project', async ({ page }) => {
  await page.goto('/portfolio/');
  await page.locator('[data-project-link="data-storytelling"]').first().click();
  await page.locator('dialog#data-storytelling .project-next').click();
  await expect(page).toHaveURL(/#nlesc-portfolio$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});

test('direct project hash closes in place without leaving portfolio', async ({ page }) => {
  await page.goto('/portfolio/#data-storytelling');
  const dialog = page.locator('dialog#data-storytelling');
  await expect(dialog).toHaveJSProperty('open', true);

  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});

for (const malformedHash of ['#%', '#%E0%A4%A']) {
  test(`malformed portfolio hash ${malformedHash} normalizes without breaking interaction`, async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(`/portfolio/${malformedHash}`);
    await expect(page).toHaveURL(/\/portfolio\/$/);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveClass(/project-dialog-open/);

    const card = page.locator('[data-project-link="data-storytelling"]').first();
    await card.click();
    await expect(page.locator('dialog#data-storytelling')).toHaveJSProperty('open', true);

    await page.evaluate((hash) => { location.hash = hash; }, malformedHash);
    await expect(page).toHaveURL(/\/portfolio\/$/);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveClass(/project-dialog-open/);

    await card.click();
    await expect(page.locator('dialog#data-storytelling')).toHaveJSProperty('open', true);
    await expect(page).toHaveURL(/#data-storytelling$/);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
}

test('home and portfolio use full document navigation with one feedback control', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.ctw-feedback-button')).toHaveCount(1);
  await expect(page.locator('.ctw-feedback-modal')).toHaveCount(1);
  await page.evaluate(() => { window.__ctwNavigationMarker = 'home'; });
  await page.getByRole('link', { name: 'Work', exact: true }).first().click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  expect(await page.evaluate(() => window.__ctwNavigationMarker)).toBeUndefined();
  await expect(page.locator('.ctw-feedback-button')).toHaveCount(1);
  await expect(page.locator('.ctw-feedback-modal')).toHaveCount(1);

  await page.evaluate(() => { window.__ctwNavigationMarker = 'portfolio'; });
  await page.getByRole('link', { name: 'CTW Studio' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Interaction Design\s+Engineering/);
  expect(await page.evaluate(() => window.__ctwNavigationMarker)).toBeUndefined();
  await expect(page.locator('.ctw-feedback-button')).toHaveCount(1);
  await expect(page.locator('.ctw-feedback-modal')).toHaveCount(1);
});

test('homepage contact targets the founder and canvas title stays static with lightweight hover', async ({ page }) => {
  await page.goto('/');
  const navigation = page.locator('.ctw-primary-nav');
  await expect(navigation.getByRole('link', { name: 'Founder', exact: true })).toHaveCount(0);
  const contact = navigation.getByRole('link', { name: 'Contact', exact: true });
  await expect(contact).toHaveAttribute('href', '/#about');
  await contact.click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator('#about')).toBeInViewport();

  await page.goto('/');
  const canvas = page.locator('.canvas-smoke-title__canvas');
  await expect(canvas).toHaveCSS('opacity', '0');
  await expect.poll(
    () => page.locator('.studio-title-glyph').first().evaluate((element) => getComputedStyle(element).animationName),
    { timeout: 1_000 }
  ).toBe('studio-title-smoke-reveal');
  const title = page.locator('.studio-hero__title');
  await expect(title).not.toHaveClass(/is-canvas-smoke-active/);
  await title.hover();
  await page.waitForTimeout(250);
  expect(await title.evaluate((heading) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(heading).transform);
    return Math.hypot(matrix.a, matrix.b);
  })).toBeCloseTo(1, 2);
  await page.mouse.move(10, 10);
  await expect(page.locator('body')).toHaveClass(/studio-hero-complete/, { timeout: 5_000 });
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute('data-render-mode', 'canvas');
  await expect(canvas).toHaveAttribute('data-frame-ready', 'true');
  await expect(canvas).toHaveAttribute('data-handoff-ready', 'true');
  await expect(canvas).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('.studio-title-line').first()).toHaveCSS('transition-duration', '0s');
  expect(await page.locator('.studio-hero__title').evaluate((heading) => {
    const canvasBounds = heading.querySelector('canvas')?.getBoundingClientRect();
    const glyphBounds = [...heading.querySelectorAll('[data-canvas-smoke-glyph]')]
      .map((glyph) => glyph.getBoundingClientRect());
    if (!canvasBounds || !glyphBounds.length) return false;
    return Math.min(
      Math.min(...glyphBounds.map((bounds) => bounds.left)) - canvasBounds.left,
      canvasBounds.right - Math.max(...glyphBounds.map((bounds) => bounds.right)),
      Math.min(...glyphBounds.map((bounds) => bounds.top)) - canvasBounds.top,
      canvasBounds.bottom - Math.max(...glyphBounds.map((bounds) => bounds.bottom))
    ) >= 40;
  })).toBe(true);
  expect(await page.locator('.studio-hero__title').evaluate((heading) => {
    const top = heading.getBoundingClientRect().top;
    const htmlBaselines = [...heading.querySelectorAll('[data-canvas-smoke-baseline]')]
      .map((marker) => Number((marker.getBoundingClientRect().top - top).toFixed(2)));
    const canvasBaselines = JSON.parse(heading.querySelector('canvas')?.dataset.baselines ?? '[]');
    return htmlBaselines.every((baseline, index) => Math.abs(baseline - canvasBaselines[index]) < 0.5);
  })).toBe(true);
  expect(await page.locator('.studio-title-line').evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    return { visibility: style.visibility, userSelect: style.userSelect };
  }))).toEqual([
    { visibility: 'hidden', userSelect: 'none' },
    { visibility: 'hidden', userSelect: 'none' },
    { visibility: 'hidden', userSelect: 'none' }
  ]);
  const glyph = page.locator('.studio-title-glyph').nth(4);
  const glyphBounds = await glyph.boundingBox();
  await page.mouse.move(
    (glyphBounds?.x ?? 0) + (glyphBounds?.width ?? 0) / 2,
    (glyphBounds?.y ?? 0) + (glyphBounds?.height ?? 0) / 2
  );
  await expect(canvas).toHaveAttribute('data-smoke-active', 'false');
  await expect(canvas).not.toHaveAttribute('data-smoke-x', /.+/);
  await expect(canvas).not.toHaveAttribute('data-smoke-y', /.+/);
  await expect.poll(() => title.evaluate((heading) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(heading).transform);
    return Math.hypot(matrix.a, matrix.b);
  })).toBeCloseTo(1.025, 2);
  await page.waitForTimeout(750);
  await expect(canvas).toHaveAttribute('data-smoke-active', 'false');
  await expect(canvas).not.toHaveAttribute('data-smoke-x', /.+/);
  await expect(canvas).not.toHaveAttribute('data-smoke-y', /.+/);
});

test('homepage smoke intro and touch interaction run on mobile', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect.poll(
    () => page.locator('.studio-title-glyph').first().evaluate((element) => getComputedStyle(element).animationName),
    { timeout: 1_000 }
  ).toBe('studio-title-smoke-reveal');

  const fluid = page.locator('.studio-page-fluid');
  await expect(fluid).toBeVisible();
  await expect(fluid).toHaveAttribute('data-motion-mode', 'touch-scroll');
  const canvas = page.locator('.canvas-smoke-title__canvas');
  await expect(page.locator('body')).toHaveClass(/studio-hero-complete/, { timeout: 5_000 });
  const firstGlyph = page.locator('.studio-title-glyph').nth(2);
  const laterGlyph = page.locator('.studio-title-glyph').nth(10);
  const firstBounds = await firstGlyph.boundingBox();
  const laterBounds = await laterGlyph.boundingBox();
  const firstX = (firstBounds?.x ?? 0) + (firstBounds?.width ?? 0) / 2;
  const firstY = (firstBounds?.y ?? 0) + (firstBounds?.height ?? 0) / 2;
  const laterX = (laterBounds?.x ?? 0) + (laterBounds?.width ?? 0) / 2;
  const laterY = (laterBounds?.y ?? 0) + (laterBounds?.height ?? 0) / 2;
  const touchPointer = { bubbles: true, isPrimary: true, pointerId: 1, pointerType: 'touch' };
  await firstGlyph.dispatchEvent('pointerdown', {
    ...touchPointer,
    buttons: 1,
    clientX: firstX,
    clientY: firstY,
    pressure: 0.5
  });
  await expect(canvas).toHaveAttribute('data-smoke-active', 'true');
  const firstSmokeX = Number(await canvas.getAttribute('data-smoke-x'));
  await laterGlyph.dispatchEvent('pointermove', {
    ...touchPointer,
    buttons: 1,
    clientX: laterX,
    clientY: laterY,
    pressure: 0.5
  });
  await expect.poll(async () => Number(await canvas.getAttribute('data-smoke-x'))).toBeGreaterThan(firstSmokeX + 60);
  await expect(canvas).toHaveAttribute('data-smoke-active', 'true');
  await laterGlyph.dispatchEvent('pointerup', {
    ...touchPointer,
    buttons: 0,
    clientX: laterX,
    clientY: laterY,
    pressure: 0
  });
  await expect(canvas).toHaveAttribute('data-smoke-active', 'false', { timeout: 5_000 });

  const scrollReveal = page.locator('.studio-products-section .ctw-lede');
  await expect(scrollReveal).toHaveClass(/studio-scroll-reveal/);
  await expect(scrollReveal).toHaveCSS('opacity', '0');
  await scrollReveal.scrollIntoViewIfNeeded();
  await expect(scrollReveal).toHaveClass(/is-visible/);
  await expect(scrollReveal).toHaveCSS('opacity', '1');
  await expect.poll(async () => Number(await fluid.getAttribute('data-scroll-progress'))).toBeGreaterThan(0.1);
  await context.close();
});

test('homepage motion preference can override the device setting', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  await page.goto('/');
  const preference = page.getByLabel('Motion preference');
  await expect(preference).toHaveValue('system');
  expect((await preference.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  await expect(page.locator('html')).toHaveAttribute('data-motion-preference', 'system');
  await expect(page.locator('.studio-title-glyph').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.studio-page-fluid')).toHaveCount(0);

  await Promise.all([
    page.waitForEvent('load'),
    preference.selectOption('full')
  ]);
  await expect(page.locator('html')).toHaveAttribute('data-motion-preference', 'full');
  await expect(page.getByLabel('Motion preference')).toHaveValue('full');
  await expect(page.locator('.studio-title-glyph').first()).toHaveCSS('animation-name', 'studio-title-smoke-reveal');
  await expect(page.locator('.studio-page-fluid')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/studio-hero-complete/, { timeout: 5_000 });
  const card = page.locator('.studio-offerings li').first();
  await expect(card).toHaveClass(/studio-scroll-reveal/);
  await expect(card).toHaveCSS('opacity', '0');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/is-visible/);
  await expect(card).toHaveCSS('opacity', '1');

  await Promise.all([
    page.waitForEvent('load'),
    page.getByLabel('Motion preference').selectOption('reduced')
  ]);
  await expect(page.locator('html')).toHaveAttribute('data-motion-preference', 'reduced');
  await expect(page.locator('.studio-title-glyph').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.studio-page-fluid')).toHaveCount(0);
  await context.close();
});

test('portfolio away and Back restore without duplicate handlers or body lock', async ({ page }) => {
  await page.goto('/portfolio/');
  const first = page.locator('[data-project-link="data-storytelling"]').first();
  const away = page.locator('.ctw-footer').getByRole('link', { name: 'Signals' });
  await away.evaluate((element) => element.scrollIntoView());
  const savedScrollY = await page.evaluate(() => window.scrollY);

  await away.click();
  await expect(page).toHaveURL(/\/signals\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('body')).not.toHaveClass(/project-dialog-open/);
  await expect(page.locator('.ctw-feedback-button')).toHaveCount(1);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - savedScrollY)).toBeLessThanOrEqual(2);

  await first.click();
  await page.locator('dialog#data-storytelling .project-next').click();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/project-dialog-open/);
});

test('reduced motion disables nonessential animation', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/portfolio/');
  const duration = await page.locator('.project-card__image').first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(['0s', '0.00001s', '1e-05s']).toContain(duration);
  await context.close();
});

test('mobile layout has no horizontal overflow and key targets meet 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/portfolio/');
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    overflowing: [...document.querySelectorAll('*')]
      .filter((element) => element.getBoundingClientRect().right > window.innerWidth + 0.5)
      .map((element) => `${element.tagName.toLowerCase()}.${element.className}`)
      .slice(0, 10)
  }));
  expect(dimensions.documentWidth, dimensions.overflowing.join(', ')).toBeLessThanOrEqual(dimensions.viewportWidth);
  const first = await page.locator('[data-project-link]').first().boundingBox();
  expect(first?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(first?.width ?? 0).toBeGreaterThanOrEqual(44);

  await page.locator('[data-project-link]').first().click();
  const close = await page.locator('.project-dialog__close').first().boundingBox();
  expect(close?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(close?.width ?? 0).toBeGreaterThanOrEqual(44);
});

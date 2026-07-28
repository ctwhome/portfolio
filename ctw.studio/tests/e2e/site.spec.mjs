import { expect, test } from '@playwright/test';

test('home remains substantive without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Applied research software.');
  await expect(page.getByRole('link', { name: 'Projects' }).first()).toHaveAttribute('href', '/portfolio/');
  await expect(page.getByRole('link', { name: 'contact@ctw.studio' }).first()).toHaveAttribute('href', 'mailto:contact@ctw.studio');
  await context.close();
});

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
  await page.getByRole('link', { name: 'Projects' }).first().click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  expect(await page.evaluate(() => window.__ctwNavigationMarker)).toBeUndefined();
  await expect(page.locator('.ctw-feedback-button')).toHaveCount(1);
  await expect(page.locator('.ctw-feedback-modal')).toHaveCount(1);

  await page.evaluate(() => { window.__ctwNavigationMarker = 'portfolio'; });
  await page.getByRole('link', { name: 'CTW Studio' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Applied research software.');
  expect(await page.evaluate(() => window.__ctwNavigationMarker)).toBeUndefined();
  await expect(page.locator('.ctw-feedback-button')).toHaveCount(1);
  await expect(page.locator('.ctw-feedback-modal')).toHaveCount(1);
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

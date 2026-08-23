import { expect, test } from '@playwright/test';
import { writingRoutes } from '../personal-portfolio-routes.mjs';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'compact', width: 320, height: 568 }
];

for (const viewport of viewports) {
  test(`Writing ${viewport.name} shell is readable, ordered, and error-free`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });

    await page.setViewportSize(viewport);
    await page.goto('/writing/', { waitUntil: 'networkidle' });
    await expect(page.locator('.writing-index__item')).toHaveCount(17);
    const navigationLabels = await page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('aria-label') ?? link.textContent.trim()));
    expect(navigationLabels).toEqual(['Work', 'Writing', 'Signals', 'Contact']);
    await expect(page.getByRole('link', { name: 'Writing', exact: true }).first()).toHaveAttribute('aria-current', 'page');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);

    for (const control of await page.locator('.ctw-wordmark, .ctw-primary-nav__link').all()) {
      expect((await control.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
    }

    await page.goto('/writing/2025-05-30-call-me-jesse/', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1, name: 'Call Me Jesse' })).toBeVisible();
    await expect(page.locator('.writing-article__cover')).toHaveJSProperty('complete', true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    expect(errors).toEqual([]);
  });
}

test('Writing remains substantive and navigable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 568 } });
  const page = await context.newPage();
  await page.goto('/writing/');
  await expect(page.getByRole('heading', { level: 1, name: 'Writing' })).toBeVisible();
  await expect(page.locator('.writing-index__item')).toHaveCount(17);
  await expect(page.getByRole('link', { name: 'Jesse Gonzalez, home' })).toBeVisible();
  await page.getByRole('link', { name: 'Call Me Jesse' }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Call Me Jesse' })).toBeVisible();
  expect((await page.locator('.writing-prose').innerText()).length).toBeGreaterThan(1_000);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await context.close();
});

test('Writing index content clears the floating feedback control', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/writing/', { waitUntil: 'networkidle' });

  const overlaps = await page.evaluate(() => {
    const feedback = document.querySelector('.ctw-feedback-button')?.getBoundingClientRect();
    if (!feedback) return ['missing feedback control'];
    return [...document.querySelectorAll('.writing-index__title, .writing-index__meta')]
      .filter((element) => {
        const content = element.getBoundingClientRect();
        return content.left < feedback.right && content.right > feedback.left
          && content.top < feedback.bottom && content.bottom > feedback.top;
      })
      .map((element) => element.textContent.trim());
  });

  expect(overlaps).toEqual([]);
});

test('all Writing routes expose article metadata and reachable local media', async ({ request }) => {
  for (const { slug, date } of writingRoutes) {
    const pathname = `/writing/${slug}/`;
    const response = await request.get(pathname);
    expect(response.ok(), slug).toBe(true);
    const html = await response.text();
    expect(html).toContain(`<link rel="canonical" href="https://ctw.studio${pathname}">`);
    expect(html).toContain('<meta property="og:type" content="article">');
    expect(html).toContain('<meta property="article:author" content="Jesse Gonzalez">');
    expect(html).toContain(`<meta property="article:published_time" content="${date}T00:00:00.000Z">`);
    expect(html).toMatch(/<meta property="og:image" content="https:\/\/ctw\.studio\/writing\/.+\/media\/.+">/);
    expect(html).toMatch(/<meta property="og:image:alt" content="[^"]+">/);
    expect(html).toMatch(/<meta property="og:image:width" content="\d+">/);
    expect(html).toMatch(/<meta property="og:image:height" content="\d+">/);
    expect((html.match(/<h1\b/g) ?? []).length).toBe(1);
    for (const [image] of html.matchAll(/<img\b[^>]*>/gi)) {
      expect(image, `${slug}: image alt`).toMatch(/\balt="[^"]+"/);
      expect(image, `${slug}: image width`).toMatch(/\bwidth="\d+"/);
      expect(image, `${slug}: image height`).toMatch(/\bheight="\d+"/);
      if (!image.includes('writing-article__cover')) expect(image, `${slug}: image lazy`).toContain('loading="lazy"');
    }
    for (const [, path] of html.matchAll(/(?:src|href)="(\/writing\/[^"#?]+\.(?:avif|gif|jpe?g|png|webp|pdf|mp4))"/gi)) {
      expect((await request.get(path)).ok(), path).toBe(true);
    }
  }
});

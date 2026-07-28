import { expect, test } from '@playwright/test';

const pages = [
  {
    path: '/workshop/',
    canonical: 'https://ctw.studio/workshop/',
    heading: 'AI Literacy Workshop',
    copy: 'Academic workflows you can actually use'
  },
  {
    path: '/workshop/privacy/',
    canonical: 'https://ctw.studio/workshop/privacy/',
    heading: 'Privacy Notice',
    copy: 'Data Controller'
  },
  {
    path: '/workshop/terms/',
    canonical: 'https://ctw.studio/workshop/terms/',
    heading: 'Terms & Conditions',
    copy: 'Cancellation Policy'
  },
  {
    path: '/design-system/',
    canonical: 'https://ctw.studio/design-system/',
    heading: /Design for decisions/,
    copy: 'Privacy is a trigger'
  }
];

for (const route of pages) {
  test(`${route.path} is substantive, canonical, responsive, and error-free`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route.path, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(new RegExp(`${route.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
    await expect(page.locator('body')).toContainText(route.copy);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', route.canonical);

    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth
    }));
    expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth);

    const skip = page.getByRole('link', { name: /Skip to/ });
    expect((await skip.boundingBox())?.bottom ?? 0).toBeLessThanOrEqual(0);
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect.poll(async () => (await skip.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('workshop and guide controls remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/workshop/');
  const inquiry = page.getByRole('link', { name: /Get in Touch —/ });
  await expect(inquiry).toHaveAttribute('href', /mailto:contact@ctw\.studio/);
  const inquiryBox = await inquiry.boundingBox();
  expect(inquiryBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  const faqItem = page.locator('details.faq-item').first();
  const faq = faqItem.locator('summary');
  const faqBox = await faq.boundingBox();
  expect(faqBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  await expect(faqItem).toHaveAttribute('open', '');
  await faq.click();
  await expect(faqItem).not.toHaveAttribute('open', '');
  await expect(faqItem.locator('.faq-answer')).not.toBeVisible();
  await faq.click();
  await expect(faqItem).toHaveAttribute('open', '');
  await expect(faqItem.locator('.faq-answer')).toBeVisible();

  for (const legal of ['/workshop/privacy/', '/workshop/terms/']) {
    await page.goto(legal);
    const back = page.getByRole('link', { name: 'Back to Workshop' });
    const box = await back.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    await back.click();
    await expect(page).toHaveURL(/\/workshop\/$/);
  }

  await page.goto('/design-system/');
  const action = page.getByRole('link', { name: 'Inspect components' });
  const actionBox = await action.boundingBox();
  expect(actionBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  await action.click();
  await expect(page).toHaveURL(/#components$/);
  await expect(page.getByLabel('Decision under review')).toBeEditable();
});

test('workshop, legal, and guide remain substantive without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of pages) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
    await expect(page.locator('body')).toContainText(route.copy);
  }
  await page.goto('/workshop/');
  await expect(page.locator('details.faq-item .faq-answer').first()).toBeVisible();
  await context.close();
});

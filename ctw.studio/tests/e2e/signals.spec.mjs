import { expect, test } from '@playwright/test';

const briefs = [
  {
    path: '/signals/food/',
    heading: /What does eating animals cost/,
    prose: /The scale is enormous/,
    source: /FAO slaughter/
  },
  {
    path: '/signals/housing/',
    heading: /ordinary life becoming less attainable/,
    prose: /There is no single housing market/,
    source: /OECD/
  },
  {
    path: '/signals/financial-fragility/',
    heading: /resilience become financial stress/,
    prose: /Resilient aggregates/,
    source: /BIS credit/
  }
];

test('Signals atlas and representative briefs remain substantive without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/signals/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Important questions');
  await expect(page.getByText('Ten long-horizon subjects', { exact: false }).first()).toBeVisible();
  await expect(page.locator('.subject-menu')).toHaveCount(1);
  await expect(page.locator('.subject-menu__option')).toHaveCount(10);

  for (const brief of briefs) {
    await page.goto(brief.path);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(brief.heading);
    await expect(page.getByText(brief.prose).first()).toBeVisible();
    await expect(page.getByRole('link', { name: brief.source }).first()).toBeVisible();
    await expect(page.locator('main')).toContainText('Sources');
  }

  await expect(page.locator('#table-householdCredit')).toBeVisible();
  await expect(page.locator('#table-householdCredit tbody tr')).not.toHaveCount(0);
  await context.close();
});

test('Signals runtimes enhance committed data without browser errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/signals/');
  await expect(page.locator('html')).toHaveClass(/subject-menu-ready/);
  await expect(page.locator('.subject-menu__trigger')).toHaveCount(1);

  await page.goto('/signals/food/');
  await expect(page.locator('#food-data-date')).not.toHaveText('—');
  await expect(page.locator('#species-table tbody tr')).not.toHaveCount(0);

  await page.goto('/signals/housing/');
  await expect(page.locator('#housing-price-table tbody tr')).not.toHaveCount(0);

  await page.goto('/signals/financial-fragility/');
  await expect(page.locator('#source-ledger article')).not.toHaveCount(0);

  expect(errors).toEqual([]);
});

test('Signals subject links force a full reload', async ({ page }) => {
  await page.goto('/signals/food/');
  await page.evaluate(() => { window.__ctwNavigationMarker = 'alive'; });
  await page.locator('.subject-menu__option[href="/signals/housing/"]').click();
  await expect(page).toHaveURL(/\/signals\/housing\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ordinary life');
  expect(await page.evaluate(() => window.__ctwNavigationMarker)).toBeUndefined();
});

test('Signals compact routes avoid overflow and expose usable 44px controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ['/signals/', ...briefs.map(({ path }) => path)]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      elements: [...document.querySelectorAll('*')]
        .filter((element) => element.getBoundingClientRect().right > innerWidth + 0.5)
        .map((element) => `${element.tagName.toLowerCase()}.${element.className}`)
        .slice(0, 10)
    }));
    expect(overflow.documentWidth, `${path}: ${overflow.elements.join(', ')}`).toBeLessThanOrEqual(overflow.viewportWidth);

    const trigger = await page.locator('.subject-menu__trigger').boundingBox();
    expect(trigger?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(trigger?.width ?? 0).toBeGreaterThanOrEqual(44);
  }

  await page.goto('/signals/financial-fragility/');
  const tab = await page.locator('[data-series-tab]').first().boundingBox();
  expect(tab?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(tab?.width ?? 0).toBeGreaterThanOrEqual(44);
  await expect(page.locator('.proximate-citation a[href^="https://"]').first()).toBeVisible();
});

test('Signals skip links stay hidden until keyboard focus, then work', async ({ page }) => {
  for (const path of ['/signals/', '/signals/food/']) {
    await page.goto(path);
    const skip = page.locator('a[href="#main-content"]').first();
    expect((await skip.boundingBox())?.y ?? 0).toBeLessThan(0);
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect.poll(async () => (await skip.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(0);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  }
});

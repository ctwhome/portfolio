import { expect, test } from '@playwright/test';

test('@visual portfolio wide and compact layouts render', async ({ page }, testInfo) => {
  const prepareCapture = async (checkKeyboardFocus = true) => {
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(320, innerHeight * 0.75)) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      await Promise.all([...document.querySelectorAll('.project-card__image')].map((image) => {
        if (image.complete && image.naturalWidth > 0) return;
        return new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
      }));
      scrollTo(0, 0);
      document.activeElement?.blur();
    });
    const skip = page.locator('.ctw-skip-link');
    expect((await skip.boundingBox())?.bottom ?? 0).toBeLessThanOrEqual(0);
    if (checkKeyboardFocus) {
      await page.keyboard.press('Tab');
      await expect(skip).toBeFocused();
      await expect.poll(async () => (await skip.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(0);
      await page.keyboard.press('Escape');
      await page.evaluate(() => document.activeElement?.blur());
    }
  };

  const layout = async () => page.evaluate(() => {
    const feedback = document.querySelector('.ctw-feedback-button')?.getBoundingClientRect();
    const grid = document.querySelector('.portfolio-grid')?.getBoundingClientRect();
    const cards = [...document.querySelectorAll('.project-card')].slice(0, 4).map((card) => {
      const rect = card.getBoundingClientRect();
      const media = card.querySelector('.project-card__media')?.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        mediaRatio: media ? media.width / media.height : 0
      };
    });
    return {
      cardCount: document.querySelectorAll('.project-card').length,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      feedbackWidth: feedback?.width ?? 0,
      feedbackHeight: feedback?.height ?? 0,
      feedbackPosition: getComputedStyle(document.querySelector('.ctw-feedback-button')).position,
      gridWidth: grid?.width ?? 0,
      cards
    };
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/portfolio/');
  await expect(page.locator('.ctw-feedback-button')).toBeVisible();
  const wideLayout = await layout();
  expect(wideLayout.cardCount).toBe(21);
  expect(wideLayout.documentWidth).toBeLessThanOrEqual(wideLayout.viewportWidth);
  expect(wideLayout.cards).toHaveLength(4);
  expect(Math.max(...wideLayout.cards.map(({ width }) => width)) - Math.min(...wideLayout.cards.map(({ width }) => width))).toBeLessThanOrEqual(2);
  expect(wideLayout.cards[1].left - wideLayout.cards[0].right).toBeGreaterThanOrEqual(20);
  expect(wideLayout.cards[0].width).toBeLessThan(wideLayout.gridWidth - 20);
  expect(Math.abs(wideLayout.cards[0].top - wideLayout.cards[1].top)).toBeLessThanOrEqual(2);
  expect(Math.abs(wideLayout.cards[2].top - wideLayout.cards[3].top)).toBeLessThanOrEqual(2);
  expect(Math.abs(wideLayout.cards[0].left - wideLayout.cards[2].left)).toBeLessThanOrEqual(2);
  expect(Math.abs(wideLayout.cards[1].left - wideLayout.cards[3].left)).toBeLessThanOrEqual(2);
  for (const card of wideLayout.cards) expect(card.mediaRatio).toBeCloseTo(1.5, 2);
  expect(wideLayout.feedbackWidth).toBeGreaterThanOrEqual(44);
  expect(wideLayout.feedbackHeight).toBeGreaterThanOrEqual(44);
  await prepareCapture();
  const wide = await page.screenshot({ path: testInfo.outputPath('portfolio-wide.png'), animations: 'disabled', fullPage: true });
  expect(wide.byteLength).toBeGreaterThan(50_000);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const compactLayout = await layout();
  expect(compactLayout.documentWidth).toBeLessThanOrEqual(compactLayout.viewportWidth);
  expect(compactLayout.cards).toHaveLength(4);
  expect(Math.max(...compactLayout.cards.map(({ width }) => width)) - Math.min(...compactLayout.cards.map(({ width }) => width))).toBeLessThanOrEqual(2);
  expect(Math.abs(compactLayout.cards[0].width - compactLayout.gridWidth)).toBeLessThanOrEqual(2);
  for (const card of compactLayout.cards) {
    expect(card.left).toBeGreaterThanOrEqual(0);
    expect(card.right).toBeLessThanOrEqual(compactLayout.viewportWidth + 1);
    expect(card.mediaRatio).toBeCloseTo(1.5, 2);
  }
  expect(compactLayout.feedbackWidth).toBeGreaterThanOrEqual(44);
  expect(compactLayout.feedbackHeight).toBeGreaterThanOrEqual(44);
  expect(compactLayout.feedbackPosition).toBe('fixed');

  await page.locator('[data-project-link="data-storytelling"]').first().click();
  const controls = await page.evaluate(() => {
    const feedback = document.querySelector('.ctw-feedback-button')?.getBoundingClientRect();
    const close = document.querySelector('dialog[open] .project-dialog__close')?.getBoundingClientRect();
    const intersects = (a, b) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    return {
      closeWidth: close?.width ?? 0,
      closeHeight: close?.height ?? 0,
      feedbackOverlapsClose: feedback && close ? intersects(feedback, close) : true
    };
  });
  expect(controls.closeWidth).toBeGreaterThanOrEqual(44);
  expect(controls.closeHeight).toBeGreaterThanOrEqual(44);
  expect(controls.feedbackOverlapsClose).toBe(false);
  await page.keyboard.press('Escape');

  await prepareCapture(false);
  const compact = await page.screenshot({ path: testInfo.outputPath('portfolio-compact.png'), animations: 'disabled', fullPage: true });
  expect(compact.byteLength).toBeGreaterThan(20_000);
});

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
    const visibleCopies = [...document.querySelectorAll('.project-card__copy')]
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.bottom > 0 && rect.top < innerHeight);
    const intersects = (a, b) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const firstCard = document.querySelector('.project-card')?.getBoundingClientRect();
    const grid = document.querySelector('.portfolio-grid')?.getBoundingClientRect();
    const rows = [...document.querySelectorAll('.project-card')].reduce((result, card) => {
      const rect = card.getBoundingClientRect();
      const row = result.find((items) => Math.abs(items[0].top - rect.top) < 2);
      if (row) row.push(rect);
      else result.push([rect]);
      return result;
    }, []);
    return {
      cardCount: document.querySelectorAll('.project-card').length,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      feedbackWidth: feedback?.width ?? 0,
      feedbackHeight: feedback?.height ?? 0,
      feedbackOverlapsCopy: feedback ? visibleCopies.some((copy) => intersects(feedback, copy)) : true,
      firstCardWidth: firstCard?.width ?? 0,
      gridWidth: grid?.width ?? 0,
      incompleteRows: rows.filter((row) => {
        const left = Math.min(...row.map((rect) => rect.left));
        const right = Math.max(...row.map((rect) => rect.right));
        return Math.abs((right - left) - ((grid?.width ?? 0) - 2)) > 3;
      }).length
    };
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/portfolio/');
  await expect(page.locator('.ctw-feedback-button')).toBeVisible();
  const wideLayout = await layout();
  expect(wideLayout.cardCount).toBe(19);
  expect(wideLayout.documentWidth).toBeLessThanOrEqual(wideLayout.viewportWidth);
  expect(Math.abs(wideLayout.firstCardWidth - wideLayout.gridWidth)).toBeLessThanOrEqual(3);
  expect(wideLayout.incompleteRows).toBe(0);
  expect(wideLayout.feedbackWidth).toBeGreaterThanOrEqual(44);
  expect(wideLayout.feedbackHeight).toBeGreaterThanOrEqual(44);
  await prepareCapture();
  const wide = await page.screenshot({ path: testInfo.outputPath('portfolio-wide.png'), animations: 'disabled', fullPage: true });
  expect(wide.byteLength).toBeGreaterThan(50_000);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const compactLayout = await layout();
  expect(compactLayout.documentWidth).toBeLessThanOrEqual(compactLayout.viewportWidth);
  expect(compactLayout.feedbackWidth).toBeGreaterThanOrEqual(44);
  expect(compactLayout.feedbackHeight).toBeGreaterThanOrEqual(44);
  expect(compactLayout.feedbackOverlapsCopy).toBe(false);

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

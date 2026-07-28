import { expect, test } from '@playwright/test';

async function revealWholePage(page) {
  for (const reveal of await page.locator('.reveal').all()) {
    await reveal.scrollIntoViewIfNeeded();
    await page.waitForTimeout(35);
  }
  await page.evaluate(() => {
    scrollTo(0, 0);
    document.activeElement?.blur();
  });
  await page.waitForTimeout(750);
}

for (const [name, path] of [['atlas', '/signals/'], ['food', '/signals/food/']]) {
  test(`@visual Signals ${name} wide and compact full pages render`, async ({ page }, testInfo) => {
    for (const viewport of [
      { label: 'wide', width: 1440, height: 1000, minimumBytes: 50_000 },
      { label: 'compact', width: 390, height: 844, minimumBytes: 20_000 }
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(path);
      await revealWholePage(page);

      const state = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        blankReveals: [...document.querySelectorAll('.reveal')]
          .filter((element) => Number.parseFloat(getComputedStyle(element).opacity) < 0.9)
          .map((element) => `${element.tagName.toLowerCase()}#${element.id}.${element.className}`),
        skipBottom: document.querySelector('a[href="#main-content"]')?.getBoundingClientRect().bottom ?? 0
      }));
      expect(state.documentWidth).toBeLessThanOrEqual(state.viewportWidth);
      expect(state.blankReveals).toEqual([]);
      expect(state.skipBottom).toBeLessThanOrEqual(0);

      const screenshot = await page.screenshot({
        path: testInfo.outputPath(`${name}-${viewport.label}.png`),
        animations: 'disabled',
        fullPage: true
      });
      expect(screenshot.byteLength).toBeGreaterThan(viewport.minimumBytes);
    }
  });
}

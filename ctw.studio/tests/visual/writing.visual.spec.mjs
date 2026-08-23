import { expect, test } from '@playwright/test';

const pages = [
  { name: 'home', path: '/' },
  { name: 'writing-index', path: '/writing/' },
  { name: 'call-me-jesse', path: '/writing/2025-05-30-call-me-jesse/' },
  { name: 'avif-article', path: '/writing/2024-04-26-the-future-of-image-and-video-format/' },
  { name: 'long-article', path: '/writing/2025-10-05-remote-work-drives-productivity-and-wellbeing-while-cutting-costs-dramatically/' }
];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
  { width: 320, height: 568 }
];

for (const pageCase of pages) {
  for (const viewport of viewports) {
    test(`@visual ${pageCase.name} ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(pageCase.path, { waitUntil: 'networkidle' });
      await expect(page.locator('main')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      await page.evaluate(async () => {
        for (let top = 0; top < document.documentElement.scrollHeight; top += window.innerHeight) {
          window.scrollTo(0, top);
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }
        window.scrollTo(0, 0);
      });
      const screenshotPath = testInfo.outputPath(`${pageCase.name}-${viewport.width}x${viewport.height}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
      await testInfo.attach(`${pageCase.name} ${viewport.width}x${viewport.height}`, { path: screenshotPath, contentType: 'image/png' });
    });
  }
}

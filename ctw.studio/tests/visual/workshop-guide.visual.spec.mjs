import { expect, test } from '@playwright/test';

for (const route of [
  { name: 'workshop', path: '/workshop/', heading: 'AI Literacy Workshop' },
  { name: 'design-guide', path: '/design-system/', heading: /Design for decisions/ }
]) {
  test(`@visual ${route.name} wide and compact full pages render`, async ({ page }, testInfo) => {
    for (const viewport of [
      { name: 'wide', width: 1440, height: 900, minimum: 50_000 },
      { name: 'compact', width: 390, height: 844, minimum: 20_000 }
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
      await page.evaluate(() => {
        scrollTo(0, 0);
        document.activeElement?.blur();
      });
      const skip = page.getByRole('link', { name: /Skip to/ });
      expect((await skip.boundingBox())?.bottom ?? 0).toBeLessThanOrEqual(0);
      const image = await page.screenshot({
        path: testInfo.outputPath(`${route.name}-${viewport.name}.png`),
        animations: 'disabled',
        fullPage: true
      });
      expect(image.byteLength).toBeGreaterThan(viewport.minimum);
    }
  });
}

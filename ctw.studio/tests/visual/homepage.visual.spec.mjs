import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'wide', width: 1440, height: 900, minimumBytes: 80_000 },
  { name: 'tablet', width: 768, height: 1024, minimumBytes: 55_000 },
  { name: 'compact', width: 390, height: 844, minimumBytes: 35_000 }
];

for (const viewport of viewports) {
  test(`@visual homepage ${viewport.name} historical composition renders`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(320, innerHeight * 0.75)) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      await Promise.all([...document.querySelectorAll('.studio-product img')].map((image) => {
        if (image.complete && image.naturalWidth > 0) return;
        return new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
      }));
      scrollTo(0, 0);
      document.activeElement?.blur();
    });

    const state = await page.evaluate(() => {
      const hero = document.querySelector('.studio-hero__title')?.getBoundingClientRect();
      const products = document.querySelector('.studio-products')?.getBoundingClientRect();
      const quotes = document.querySelector('.studio-quotes');
      const feedback = document.querySelector('.ctw-feedback-button')?.getBoundingClientRect();
      const protectedRegions = [...document.querySelectorAll('.studio-hero__actions a, .studio-facts__links a, .studio-founder a')]
        .map((element) => ({ selector: element.className, rect: element.getBoundingClientRect() }));
      const intersects = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      const productGeometry = [...document.querySelectorAll('.studio-product')].map((card) => {
        const image = card.querySelector('img');
        const cardRect = card.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        return {
          cardWidth: cardRect.width,
          cardRatio: cardRect.width / cardRect.height,
          imageRatio: imageRect.width / imageRect.height,
          naturalRatio: image.naturalWidth / image.naturalHeight,
          objectFit: getComputedStyle(image).objectFit,
          contained: imageRect.left >= cardRect.left - 1 && imageRect.right <= cardRect.right + 1
            && imageRect.top >= cardRect.top - 1 && imageRect.bottom <= cardRect.bottom + 1
        };
      });
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        heroWidth: hero?.width ?? 0,
        productsWidth: products?.width ?? 0,
        quoteScrolls: (quotes?.scrollWidth ?? 0) > (quotes?.clientWidth ?? 0),
        feedbackWidth: feedback?.width ?? 0,
        feedbackHeight: feedback?.height ?? 0,
        feedbackOverlaps: feedback
          ? protectedRegions.filter(({ rect }) => intersects(feedback, rect)).map(({ selector }) => selector)
          : ['missing feedback'],
        productBottomDelta: productGeometry.length === 5
          ? Math.abs(document.querySelector('.studio-product--primary').getBoundingClientRect().bottom
            - document.querySelectorAll('.studio-product')[4].getBoundingClientRect().bottom)
          : Infinity,
        productGeometry,
        loadedImages: [...document.querySelectorAll('.studio-product img')]
          .filter((image) => image.complete && image.naturalWidth > 0).length
      };
    });

    expect(state.documentWidth).toBeLessThanOrEqual(state.viewportWidth);
    expect(state.heroWidth).toBeGreaterThan(state.viewportWidth * 0.5);
    expect(state.heroWidth).toBeLessThanOrEqual(state.viewportWidth);
    expect(state.productsWidth).toBeGreaterThan(state.viewportWidth * 0.8);
    expect(state.quoteScrolls).toBe(true);
    expect(state.feedbackWidth).toBeGreaterThanOrEqual(44);
    expect(state.feedbackHeight).toBeGreaterThanOrEqual(44);
    expect(state.feedbackOverlaps).toEqual([]);
    expect(state.loadedImages).toBe(5);
    for (const geometry of state.productGeometry) {
      expect(geometry.objectFit).toBe('contain');
      expect(geometry.contained).toBe(true);
      expect(Math.abs(geometry.cardRatio - geometry.imageRatio)).toBeLessThan(0.01);
      expect(Math.abs(geometry.imageRatio - geometry.naturalRatio)).toBeLessThan(0.01);
    }
    if (viewport.name === 'compact') {
      expect(Math.max(...state.productGeometry.map(({ cardWidth }) => cardWidth))
        - Math.min(...state.productGeometry.map(({ cardWidth }) => cardWidth))).toBeLessThan(1);
    } else {
      expect(state.productGeometry[0].cardWidth / state.productGeometry[1].cardWidth).toBeGreaterThan(1.8);
    }
    if (viewport.name === 'wide') expect(state.productBottomDelta).toBeLessThan(2);

    const screenshotPath = testInfo.outputPath(`homepage-${viewport.name}-${viewport.width}x${viewport.height}.png`);
    const screenshot = await page.screenshot({ path: screenshotPath, animations: 'disabled', fullPage: true });
    expect(screenshot.byteLength).toBeGreaterThan(viewport.minimumBytes);
    await testInfo.attach(`homepage ${viewport.name} full page`, { path: screenshotPath, contentType: 'image/png' });
  });
}

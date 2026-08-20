import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const studio = join(dirname(fileURLToPath(import.meta.url)), '../..');
const imageNames = ['signal-poster', 'beauty-material', 'restaurant-material', 'home-services-material'];

async function loadStandOut(page, { runScript = true, loadStyles = true } = {}) {
  let html = await readFile(join(studio, 'dist/stand-out/index.html'), 'utf8');
  const stylesheetUrls = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((match) => match[1]);
  const scriptUrl = html.match(/<script type="module" src="([^"]+)"><\/script>/)?.[1];
  const styles = [];

  for (const asset of imageNames) {
    const bytes = await readFile(join(studio, `dist/stand-out/${asset}.avif`));
    html = html.replaceAll(`/stand-out/${asset}.avif`, `data:image/avif;base64,${bytes.toString('base64')}`);
  }

  for (const url of loadStyles ? stylesheetUrls : []) {
    let css = await readFile(join(studio, 'dist', url.slice(1)), 'utf8');
    for (const asset of imageNames) {
      const bytes = await readFile(join(studio, `dist/stand-out/${asset}.avif`));
      css = css.replaceAll(`/stand-out/${asset}.avif`, `data:image/avif;base64,${bytes.toString('base64')}`);
    }
    styles.push(css);
  }

  html = html
    .replaceAll(/<link rel="stylesheet" href="[^"]+">/g, '')
    .replaceAll(/<script type="module" src="[^"]+"><\/script>/g, '')
    .replace('</head>', `<style>${styles.join('\n')}</style></head>`);
  await page.setContent(html, { waitUntil: 'load' });

  if (runScript && scriptUrl) {
    await page.addScriptTag({ type: 'module', content: await readFile(join(studio, 'dist', scriptUrl.slice(1)), 'utf8') });
  }
}

const sizes = [
  { name: 'small', width: 320, height: 700 },
  { name: 'compact', width: 360, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'wide', width: 1440, height: 900 },
];

for (const viewport of sizes) {
  test(`stand-out ${viewport.name} stays complete, responsive, and error-free`, async ({ page }, testInfo) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await loadStandOut(page);

    await expect(page).toHaveTitle('Stand Out — Bring your real business online');
    await expect(page.getByRole('heading', { level: 1, name: /What you built in person should not disappear online/i })).toBeVisible();
    await expect(page.locator('body')).toHaveAttribute('data-motion', 'ready');
    await expect(page.locator('[data-entry-order="1"]')).toHaveCount(1);
    await expect(page.locator('[data-entry-order="2"]')).toHaveCount(2);
    await expect(page.locator('[data-entry-order="3"]')).toHaveCount(2);
    await expect(page.locator('[data-entry-order="4"]')).toHaveCount(2);
    await expect(page.locator('body')).toHaveAttribute('data-entry-state', 'settled', { timeout: 5000 });

    const scenes = page.locator('[data-story-panel]');
    await expect(scenes).toHaveCount(4);
    for (const id of ['seen-title', 'understood-title', 'chosen-title', 'remembered-title']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.locator('.so-story__progress')).toHaveAttribute('aria-label', 'Transformation chapters');
    await expect(page.locator('.so-story__progress [aria-current="step"]')).toHaveCount(1);

    const images = page.locator('.so-scene__figure img');
    await expect(images).toHaveCount(3);
    for (let index = 0; index < await images.count(); index += 1) {
      await images.nth(index).scrollIntoViewIfNeeded();
      await expect(images.nth(index)).toHaveJSProperty('complete', true);
      await expect.poll(() => images.nth(index).evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
    }

    if (viewport.width < 1024) {
      await expect(page.locator('[data-story]')).not.toHaveClass(/so-story--enhanced/);
      await expect(page.locator('body')).not.toHaveAttribute('data-smooth-scroll', 'active');
    }

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowing: [...document.querySelectorAll('body *')]
        .filter((element) => {
          const box = element.getBoundingClientRect();
          return box.right > document.documentElement.clientWidth + 1 || box.left < -1;
        })
        .slice(0, 8)
        .map((element) => element.className || element.tagName),
    }));
    expect(dimensions.scrollWidth, dimensions.overflowing.join(', ')).toBeLessThanOrEqual(dimensions.clientWidth);
    expect(errors).toEqual([]);

    for (const link of await page.locator('.so-header a, .so-action, .so-contact__email').all()) {
      const box = await link.boundingBox();
      if (box) expect(box.height).toBeGreaterThanOrEqual(44);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      animations: 'disabled',
      path: testInfo.outputPath(`stand-out-${viewport.name}-hero.png`),
    });
  });
}

test('stand-out desktop runs ordered entry, pinned chapters, and reactive WebGL hooks', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loadStandOut(page);

  await expect(page.locator('body')).toHaveAttribute('data-entry-state', 'settled', { timeout: 5000 });
  await expect(page.locator('body')).toHaveAttribute('data-smooth-scroll', 'active');
  await expect(page.locator('[data-story]')).toHaveClass(/so-story--enhanced/);
  await expect(page.locator('[data-canvas-stage]')).toHaveAttribute('data-webgl', /ready|failed/);
  if (await page.locator('[data-canvas-stage]').getAttribute('data-webgl') === 'ready') {
    await expect(page.locator('[data-canvas-stage]')).toHaveAttribute('data-webgl-inputs', 'pointer scroll chapter');
    await expect(page.locator('[data-canvas-stage]')).toHaveAttribute('data-webgl-dpr-cap', '1.5');
  }

  await page.locator('[data-story-stage]').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 1800);
  await expect(page.locator('[data-story]')).toHaveAttribute('data-active-chapter', /[1-3]/, { timeout: 5000 });
  await page.waitForTimeout(1200);
  const panelOpacities = await page.locator('[data-story-panel]').evaluateAll((panels) =>
    panels.map((panel) => Number.parseFloat(getComputedStyle(panel).opacity)),
  );
  expect(panelOpacities.filter((opacity) => opacity >= 0.99)).toHaveLength(1);
  expect(panelOpacities.filter((opacity) => opacity > 0.01)).toHaveLength(1);
  await page.screenshot({
    animations: 'disabled',
    path: testInfo.outputPath('stand-out-wide-story.png'),
  });
});

test('stand-out reduced motion renders settled content without smooth scroll or canvas animation', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await loadStandOut(page);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('body')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('html')).not.toHaveClass(/so-motion/);
  await expect(page.locator('body')).not.toHaveAttribute('data-smooth-scroll', 'active');
  await expect(page.locator('[data-signal-canvas]')).toHaveCSS('display', 'none');
  await expect(page.locator('[data-entry="headline"]').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-story-panel]')).toHaveCount(4);
  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: testInfo.outputPath('stand-out-mobile-reduced-full.png'),
  });
  await context.close();
});

test('stand-out retains full readable story without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await loadStandOut(page, { runScript: false });

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-story-panel]')).toHaveCount(4);
  await expect(page.locator('main')).toContainText('You already did the hard part');
  await expect(page.locator('main')).toContainText('fewer dead ends, smoother first contact');
  await expect(page.locator('main')).toContainText('AI-assisted or illustrative imagery never stands in');
  await expect(page.getByRole('link', { name: /Write to Jesse/ })).toBeVisible();
  for (const scene of await page.locator('[data-story-panel]').all()) await expect(scene).toBeVisible();
  await context.close();
});

test('stand-out coarse-pointer mobile keeps native scrolling and 44px controls', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await loadStandOut(page);

  await expect(page.locator('body')).not.toHaveAttribute('data-smooth-scroll', 'active');
  await expect(page.locator('[data-story]')).not.toHaveClass(/so-story--enhanced/);
  const action = page.locator('.so-action');
  const box = await action.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

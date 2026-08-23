import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const routes = ['/', '/portfolio/', '/writing/', '/signals/', '/workshop/'];

test('shared header exposes one native Contact link with decorative liquid layers', async ({ page }) => {
  const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  expect({ ...packageJson.dependencies, ...packageJson.devDependencies }).not.toHaveProperty('react');

  for (const route of routes) {
    await page.goto(route);
    const contact = page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Contact', exact: true });

    await expect(contact).toHaveCount(1);
    await expect(contact).toHaveAttribute('href', '/#about');
    await expect(contact).toHaveClass(/ctw-liquid-contact/);
    await expect(contact).toHaveAttribute('data-liquid-contact', '');
    await expect(contact.locator('[aria-hidden="true"]')).toHaveCount(4);
    await expect(contact.locator('.ctw-liquid-contact__plus')).toHaveText('+');
    await expect(contact.locator('.ctw-liquid-contact__plus')).toHaveAttribute('aria-hidden', 'true');
    await expect(contact.locator('.ctw-liquid-contact__label')).toHaveText('Contact');
    await expect(contact.locator('canvas')).toHaveCount(0);
  }

  await page.goto('/portfolio/');
  await page.getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator('#about')).toBeInViewport();
});

test('fine pointer tracks metal position and clears active state on leave', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');
  const box = await contact.boundingBox();

  expect(box?.width ?? 0).toBeGreaterThanOrEqual(43.99);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(43.99);
  expect(Number.parseFloat(await contact.evaluate((element) => getComputedStyle(element).borderRadius)))
    .toBeGreaterThanOrEqual((box?.height ?? 0) / 2);
  await expect(contact).toHaveAttribute('data-liquid-mode', 'dynamic');
  await expect(contact).toHaveAttribute('data-liquid-active', 'false');

  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) * 0.15, (box?.y ?? 0) + (box?.height ?? 0) * 0.3);
  await expect(contact).toHaveAttribute('data-liquid-active', 'true');
  const left = await contact.evaluate((element) => ({
    x: Number(element.dataset.liquidX),
    y: Number(element.dataset.liquidY),
    cssX: Number.parseFloat(getComputedStyle(element).getPropertyValue('--ctw-liquid-x')),
    cssY: Number.parseFloat(getComputedStyle(element).getPropertyValue('--ctw-liquid-y'))
  }));

  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) * 0.85, (box?.y ?? 0) + (box?.height ?? 0) * 0.7);
  const right = await contact.evaluate((element) => ({
    x: Number(element.dataset.liquidX),
    y: Number(element.dataset.liquidY),
    cssX: Number.parseFloat(getComputedStyle(element).getPropertyValue('--ctw-liquid-x')),
    cssY: Number.parseFloat(getComputedStyle(element).getPropertyValue('--ctw-liquid-y'))
  }));
  expect(right.x - left.x).toBeGreaterThan(50);
  expect(right.y - left.y).toBeGreaterThan(20);
  expect(right.cssX - left.cssX).toBeGreaterThan(50);
  expect(right.cssY - left.cssY).toBeGreaterThan(20);

  await page.mouse.move(4, 400);
  await expect(contact).toHaveAttribute('data-liquid-active', 'false');
  await expect(contact).toHaveAttribute('data-liquid-x', '50');
  await expect(contact).toHaveAttribute('data-liquid-y', '50');
  expect(await contact.evaluate((element) => getComputedStyle(element).getPropertyValue('--ctw-liquid-x').trim())).toBe('50%');
  expect(await contact.evaluate((element) => getComputedStyle(element).getPropertyValue('--ctw-liquid-y').trim())).toBe('50%');
});

test('pointer press ripple uses current coordinates and always clears', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');
  const dispatchPointer = (type, buttons) => contact.evaluate((element, event) => {
    const x = 32;
    const y = 72;
    const bounds = element.getBoundingClientRect();
    const clientX = bounds.left + bounds.width * x / 100;
    const clientY = bounds.top + bounds.height * y / 100;
    element.dispatchEvent(new PointerEvent(event.type, {
      bubbles: true,
      buttons: event.buttons,
      pointerId: 7,
      pointerType: 'mouse',
      clientX,
      clientY
    }));
    return { clientX, clientY, x, y };
  }, { type, buttons });

  const expected = await dispatchPointer('pointerdown', 1);
  await expect(contact).toHaveAttribute('data-liquid-pressing', 'true');
  expect(Math.abs(Number(await contact.getAttribute('data-liquid-x')) - expected.x)).toBeLessThan(1);
  expect(Math.abs(Number(await contact.getAttribute('data-liquid-y')) - expected.y)).toBeLessThan(1);
  await dispatchPointer('pointerup', 0);
  await expect(contact).toHaveAttribute('data-liquid-pressing', 'false');

  await dispatchPointer('pointerdown', 1);
  await dispatchPointer('pointercancel', 0);
  await expect(contact).toHaveAttribute('data-liquid-pressing', 'false');
});

test('keyboard focus keeps centered metal highlight and clear outline', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');

  for (let index = 0; index < 7; index += 1) {
    await page.keyboard.press('Tab');
    if (await contact.evaluate((element) => element === document.activeElement)) break;
  }

  await expect(contact).toBeFocused();
  await expect(contact).toHaveAttribute('data-liquid-active', 'false');
  const focusStyle = await contact.evaluate((element) => {
    const style = getComputedStyle(element);
    const surface = getComputedStyle(element.querySelector('.ctw-liquid-contact__surface'));
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      x: style.getPropertyValue('--ctw-liquid-x').trim(),
      y: style.getPropertyValue('--ctw-liquid-y').trim(),
      surfaceImage: surface.backgroundImage
    };
  });
  expect(focusStyle.outlineStyle).not.toBe('none');
  expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(2);
  expect(focusStyle.x).toBe('50%');
  expect(focusStyle.y).toBe('50%');
  expect(focusStyle.surfaceImage).toContain('radial-gradient');
});

test('reduced motion and coarse pointers stay static without press mutation', async ({ browser }) => {
  for (const options of [
    { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
    { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }
  ]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    await page.goto('/');
    const contact = page.locator('[data-liquid-contact]');
    const box = await contact.boundingBox();
    const pointer = {
      bubbles: true,
      pointerId: 3,
      pointerType: options.hasTouch ? 'touch' : 'mouse',
      clientX: (box?.x ?? 0) + 8,
      clientY: (box?.y ?? 0) + 8
    };

    await expect(contact).toHaveAttribute('data-liquid-mode', 'static');
    await contact.dispatchEvent('pointermove', { ...pointer, buttons: 0 });
    await contact.dispatchEvent('pointerdown', { ...pointer, buttons: 1 });
    await expect(contact).toHaveAttribute('data-liquid-active', 'false');
    await expect(contact).toHaveAttribute('data-liquid-pressing', 'false');
    await expect(contact).toHaveAttribute('data-liquid-x', '50');
    await expect(contact).toHaveAttribute('data-liquid-y', '50');
    await expect(contact.locator('.ctw-liquid-contact__ripple')).toHaveCSS('animation-name', 'none');
    await context.close();
  }
});

for (const route of routes) {
  for (const expectation of [
    { stored: 'full', reducedMotion: 'reduce', mode: 'dynamic' },
    { stored: 'reduced', reducedMotion: 'no-preference', mode: 'static' }
  ]) {
    test(`${route} honors stored ${expectation.stored} motion over system ${expectation.reducedMotion}`, async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: expectation.reducedMotion });
      await context.addInitScript((stored) => localStorage.setItem('ctw-motion-preference', stored), expectation.stored);
      const page = await context.newPage();
      await page.goto(route);
      const contact = page.locator('[data-liquid-contact]');
      const surface = contact.locator('.ctw-liquid-contact__surface');
      const ripple = contact.locator('.ctw-liquid-contact__ripple');

      await expect(page.locator('html')).toHaveAttribute('data-motion-preference', expectation.stored);
      await expect(contact).toHaveAttribute('data-liquid-mode', expectation.mode);
      await expect(surface).toHaveCSS('transition-duration', expectation.mode === 'dynamic' ? '0.14s' : '0s');
      if (expectation.mode === 'dynamic') {
        const box = await contact.boundingBox();
        const pointer = {
          bubbles: true,
          buttons: 1,
          pointerId: 9,
          pointerType: 'mouse',
          clientX: (box?.x ?? 0) + 8,
          clientY: (box?.y ?? 0) + 8
        };
        await contact.dispatchEvent('pointerdown', pointer);
        await expect(ripple).toHaveCSS('animation-name', 'ctw-liquid-contact-ripple');
        await expect(ripple).toHaveCSS('animation-duration', '0.36s');
        await contact.dispatchEvent('pointercancel', { ...pointer, buttons: 0 });
      } else {
        await expect(ripple).toHaveCSS('animation-name', 'none');
      }
      await context.close();
    });
  }
}

test('persisted pagehide resets state without consuming pointer listeners', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');
  const move = () => contact.dispatchEvent('pointermove', {
    bubbles: true,
    buttons: 0,
    pointerId: 11,
    pointerType: 'mouse',
    clientX: 20,
    clientY: 20
  });

  await move();
  await expect(contact).toHaveAttribute('data-liquid-active', 'true');
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  await expect(contact).toHaveAttribute('data-liquid-active', 'false');
  await expect(contact).toHaveAttribute('data-liquid-pressing', 'false');

  await move();
  await expect(contact).toHaveAttribute('data-liquid-active', 'true');
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false })));
  await expect(contact).toHaveAttribute('data-liquid-active', 'false');
  await move();
  await expect(contact).toHaveAttribute('data-liquid-active', 'false');
});

test('active metal and ripple cap white hotspots while preserving white label contrast', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');
  await contact.dispatchEvent('pointerdown', {
    bubbles: true,
    buttons: 1,
    pointerId: 12,
    pointerType: 'mouse',
    clientX: 20,
    clientY: 20
  });

  const contrast = await contact.evaluate((element) => {
    const maxWhiteAlpha = (image) => Math.max(0, ...(image.match(/rgba?\([^)]*\)/g) ?? [])
      .map((color) => color.slice(color.indexOf('(') + 1, -1).split(/[,\s/]+/).filter(Boolean))
      .filter(([red, green, blue]) => red === '255' && green === '255' && blue === '255')
      .map(([, , , alpha = '1']) => alpha.endsWith('%') ? Number.parseFloat(alpha) / 100 : Number.parseFloat(alpha)));
    const surface = getComputedStyle(element.querySelector('.ctw-liquid-contact__surface'));
    const ripple = getComputedStyle(element.querySelector('.ctw-liquid-contact__ripple'));
    const label = getComputedStyle(element.querySelector('.ctw-liquid-contact__label'));
    return {
      surfaceHotspotAlpha: maxWhiteAlpha(surface.backgroundImage),
      rippleHotspotAlpha: maxWhiteAlpha(ripple.backgroundImage),
      labelColor: label.color,
      labelShadow: label.textShadow
    };
  });

  // 40% white over near-black keeps moving highlights subordinate to white text.
  expect(contrast.surfaceHotspotAlpha).toBeLessThanOrEqual(0.4);
  expect(contrast.rippleHotspotAlpha).toBeLessThanOrEqual(0.4);
  expect(contrast.labelColor).toBe('rgb(255, 255, 255)');
  expect(contrast.labelShadow).not.toBe('none');
});

for (const width of [390, 320]) {
  test(`${width}px header keeps Contact readable and all navigation in bounds`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      hasTouch: true,
      isMobile: true
    });
    const page = await context.newPage();
    await page.goto('/');
    const contact = page.locator('[data-liquid-contact]');
    const box = await contact.boundingBox();
    const geometry = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      overflowing: [...document.querySelectorAll('.ctw-masthead--studio *')]
        .filter((element) => element.getBoundingClientRect().right > innerWidth + 0.5)
        .map((element) => element.className)
    }));

    expect(geometry.documentWidth, geometry.overflowing.join(', ')).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(43.99);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(43.99);
    expect(await contact.locator('.ctw-liquid-contact__label').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    const navigationLabels = await page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('aria-label') ?? link.textContent.trim()));
    expect(navigationLabels).toEqual(['Work', 'Writing', 'Signals', 'Contact']);
    await context.close();
  });
}

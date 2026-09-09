import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const routes = ['/', '/portfolio/', '/writing/', '/signals/', '/workshop/'];

test('shared header exposes one native Contact link with a liquid-metal canvas', async ({ page }) => {
  const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  expect({ ...packageJson.dependencies, ...packageJson.devDependencies }).not.toHaveProperty('react');

  for (const route of routes) {
    await page.goto(route);
    const contact = page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Contact', exact: true });

    await expect(contact).toHaveCount(1);
    await expect(contact).toHaveAttribute('draggable', 'false');
    await expect(contact).toHaveAttribute('href', '/#about');
    await expect(contact).toHaveClass(/ctw-liquid-contact/);
    await expect(contact).toHaveAttribute('data-liquid-contact', '');
    await expect(contact.locator('[aria-hidden="true"]')).toHaveCount(5);
    await expect(contact.locator('svg.ctw-liquid-contact__plus')).toHaveAttribute('viewBox', '0 0 115 115');
    await expect(contact.locator('.ctw-liquid-contact__plus path')).toHaveCount(2);
    await expect(contact.locator('.ctw-liquid-contact__plus')).toHaveAttribute('aria-hidden', 'true');
    await expect(contact.locator('.ctw-liquid-contact__label')).toHaveText('Contact');
    await expect(contact.locator('canvas')).toHaveCount(1);

    const standOut = page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Stand Out', exact: true });
    await expect(standOut).toHaveCount(1);
    await expect(standOut).toHaveAttribute('href', '/stand-out/');
  }

  await page.goto('/portfolio/');
  await page.getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator('#about')).toBeInViewport();
});

test('shared header Stand Out link opens the canonical landing page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Stand Out', exact: true })
    .click();
  await expect(page).toHaveURL(/\/stand-out\/$/);
  await expect(page).toHaveTitle('Stand Out — Bring your real business online');
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

test('persisted restore re-lights a Contact link that remains keyboard-focused', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');
  await page.getByRole('link', { name: 'Stand Out' }).focus();
  await page.keyboard.press('Tab');
  await expect(contact).toBeFocused();
  await expect(contact).toHaveAttribute('data-liquid-hot', 'true');
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  await expect(contact).toHaveAttribute('data-liquid-hot', 'false');
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await expect(contact).toHaveAttribute('data-liquid-hot', 'true');
});

test('static CSS fallback caps white hotspots while preserving white label contrast', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
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

  await expect(contact).toHaveAttribute('data-liquid-mode', 'static');
  await expect(contact.locator('canvas')).toBeHidden();
  await expect(contact.locator('.ctw-liquid-contact__surface')).toBeVisible();

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

for (const width of [1440, 1024, 768, 390, 320]) {
  for (const hasTouch of [true, false]) {
  test(`${width}px ${hasTouch ? 'static' : 'WebGL'} header keeps Contact readable and all navigation in bounds`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      hasTouch,
      isMobile: hasTouch
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
    expect(geometry.overflowing).toEqual([]);
    await expect(contact).toHaveAttribute('data-liquid-mode', hasTouch ? 'static' : 'dynamic');
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(43.99);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(43.99);
    expect(await contact.locator('.ctw-liquid-contact__label').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    const contactCopy = await contact.locator('.ctw-liquid-contact__label').evaluate((element) => ({
      fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
      compactContent: getComputedStyle(element, '::after').content
    }));
    expect(contactCopy.fontSize).toBeGreaterThan(0);
    expect(contactCopy.compactContent).toBe('none');
    const navigationLabels = await page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('aria-label') ?? link.textContent.trim()));
    expect(navigationLabels).toEqual(['Work', 'Writing', 'Signals', 'Stand Out', 'Contact']);
    const navigationBoxes = await page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => {
        const box = link.getBoundingClientRect();
        return { name: link.getAttribute('aria-label') ?? link.textContent.trim(), width: box.width, height: box.height };
      }));
    for (const target of navigationBoxes) {
      expect(target.width, target.name).toBeGreaterThanOrEqual(43.99);
      expect(target.height, target.name).toBeGreaterThanOrEqual(43.99);
    }
    const standOut = page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Stand Out', exact: true });
    await expect(standOut).toHaveCSS('white-space', 'nowrap');
    expect(await standOut.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.screenshot({ path: `/tmp/ctw-contact-${width}-${hasTouch ? 'static' : 'webgl'}.png` });
    await context.close();
  });
}

}

for (const failure of ['unavailable', 'compile', 'link', 'framebuffer']) {
  test(`WebGL2 ${failure} failure keeps static native Contact`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(failure => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type !== 'webgl2' || !this.matches('.ctw-liquid-contact__canvas')) return getContext.call(this, type, ...args);
        if (failure === 'unavailable') return null;
        const gl = getContext.call(this, type, ...args);
        if (!gl) throw new Error('Test needs WebGL2');
        if (failure === 'compile') gl.getShaderParameter = () => false;
        if (failure === 'link') gl.getProgramParameter = () => false;
        if (failure === 'framebuffer') gl.checkFramebufferStatus = () => gl.FRAMEBUFFER_UNSUPPORTED;
        return gl;
      };
    }, failure);
    await page.goto('/portfolio/');
    const contact = page.locator('[data-liquid-contact]');
    await expect(contact).toHaveAttribute('data-liquid-mode', 'static');
    await expect(contact.locator('canvas')).toBeHidden();
    await expect(contact.locator('.ctw-liquid-contact__surface')).toBeVisible();
    await contact.click();
    await expect(page).toHaveURL(/\/#about$/);
    expect(errors).toEqual([]);
  });
}

test('WebGL renders pixels, survives persisted restore, and falls back on context loss', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');
  await expect(contact).toHaveAttribute('data-liquid-renderer', 'webgl2');
  await contact.hover();
  await page.waitForTimeout(500);
  const pixels = await contact.locator('canvas').evaluate(canvas => new Promise(resolve => {
    requestAnimationFrame(() => {
      const gl = canvas.getContext('webgl2');
      const rgba = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
      const canvasBox = canvas.getBoundingClientRect();
      const buttonBox = canvas.closest('[data-liquid-contact]').getBoundingClientRect();
      const scaleX = canvas.width / canvasBox.width;
      const scaleY = canvas.height / canvasBox.height;
      const centerX = buttonBox.left + buttonBox.width / 2;
      const centerY = buttonBox.top + buttonBox.height / 2;
      let upper = 0, lower = 0, upperCount = 0, lowerCount = 0, spectral = 0, bright = 0;
      for (let py = 0; py < canvas.height; py += 1) {
        const pageY = canvasBox.bottom - (py + 0.5) / scaleY;
        for (let px = 0; px < canvas.width; px += 1) {
          const pageX = canvasBox.left + (px + 0.5) / scaleX;
          const qx = Math.abs(pageX - centerX) - (buttonBox.width - buttonBox.height) / 2;
          if (Math.hypot(Math.max(qx, 0), pageY - centerY) > buttonBox.height / 2) continue;
          const index = (py * canvas.width + px) * 4;
          const red = rgba[index], green = rgba[index + 1], blue = rgba[index + 2];
          const peak = Math.max(red, green, blue);
          if (pageY < centerY) { upper += peak; upperCount += 1; }
          else { lower += peak; lowerCount += 1; }
          if (peak > 72 && peak - Math.min(red, green, blue) > 24) spectral += 1;
          if (peak > 190) bright += 1;
        }
      }
      resolve({
        lit: rgba.filter((value, index) => index % 4 !== 3 && value > 20).length,
        error: gl.getError(),
        upper: upper / upperCount,
        lower: lower / lowerCount,
        spectral,
        bright
      });
    });
  }));
  expect(pixels.error).toBe(0);
  expect(pixels.lit).toBeGreaterThan(100);
  expect(pixels.lower).toBeGreaterThan(pixels.upper * 1.35);
  expect(pixels.spectral).toBeGreaterThan(100);
  expect(pixels.bright).toBeGreaterThan(100);
  await page.screenshot({ path: '/tmp/ctw-contact-hover.png' });
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.screenshot({ path: '/tmp/ctw-contact-press.png' });
  await page.mouse.move(4, 400);
  await page.mouse.up();
  await expect(contact).toHaveAttribute('data-liquid-pressing', 'false');
  await page.evaluate(() => {
    dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await contact.hover();
  await expect(contact).toHaveAttribute('data-liquid-active', 'true');
  expect(await page.locator('body').evaluate(el => el.classList.contains('hot') || el.classList.contains('press'))).toBe(false);
  await contact.locator('canvas').evaluate(canvas => canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await expect(contact).toHaveAttribute('data-liquid-mode', 'static');
  await expect(contact.locator('canvas')).toBeHidden();
  expect(errors).toEqual([]);
});

test('no JavaScript preserves Contact and keyboard activation stays native', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const staticPage = await context.newPage();
  await staticPage.goto('/portfolio/');
  await staticPage.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(staticPage).toHaveURL(/\/#about$/);
  await context.close();
  await page.goto('/portfolio/');
  const contact = page.locator('[data-liquid-contact]');
  await contact.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/#about$/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/portfolio/');
  const staticContact = page.locator('[data-liquid-contact]');
  await expect(staticContact).toHaveAttribute('data-liquid-mode', 'static');
  await staticContact.focus();
  await page.keyboard.press(' ');
  await expect(page).toHaveURL(/\/#about$/);
});

test('system motion full -> reduced -> full restarts renderer', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');
  await expect(contact).toHaveAttribute('data-liquid-renderer', 'webgl2');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(contact).toHaveAttribute('data-liquid-mode', 'static');
  await expect(contact.locator('canvas')).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(contact).toHaveAttribute('data-liquid-renderer', 'webgl2');
});

test('live renderer restart preserves an existing keyboard highlight', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('[data-liquid-contact]');
  await page.getByRole('link', { name: 'Stand Out' }).focus();
  await page.keyboard.press('Tab');
  await expect(contact).toBeFocused();
  await expect(contact).toHaveAttribute('data-liquid-hot', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(contact).toHaveAttribute('data-liquid-mode', 'static');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(contact).toHaveAttribute('data-liquid-renderer', 'webgl2');
  await expect(contact).toHaveAttribute('data-liquid-hot', 'true');
});

for (const initial of ['full', 'reduced']) {
  test(`Motion preference ${initial} session can enable renderer live`, async ({ page }) => {
    await page.addInitScript(initial => localStorage.setItem('ctw-motion-preference', initial), initial);
    await page.goto('/');
    const contact = page.locator('[data-liquid-contact]');
    const setMotion = value => page.evaluate(value => { document.documentElement.dataset.motionPreference = value; }, value);
    if (initial === 'full') {
      await expect(contact).toHaveAttribute('data-liquid-renderer', 'webgl2');
      await setMotion('reduced');
    }
    await expect(contact).toHaveAttribute('data-liquid-mode', 'static');
    await expect(contact.locator('canvas')).toBeHidden();
    await setMotion('full');
    await expect(contact).toHaveAttribute('data-liquid-renderer', 'webgl2');
    await expect(contact.locator('canvas')).toBeVisible();
    await contact.hover();
    await expect(contact).toHaveAttribute('data-liquid-active', 'true');
    await contact.click();
    await expect(page).toHaveURL(/\/#about$/);
  });
}


test('authored desktop geometry and plate deepen on hover, tighten on press', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const contact = page.locator('[data-liquid-contact]');
  const style = () => contact.evaluate(el => {
    const s = getComputedStyle(el);
    return { background: s.backgroundColor, shadow: s.boxShadow, size: parseFloat(s.fontSize), weight: s.fontWeight, font: s.fontFamily };
  });
  const box = await contact.boundingBox();
  expect(box.height).toBeCloseTo(52, 3);
  expect(box.width / box.height).toBeCloseTo(1407 / 516, 2);
  const rest = await style();
  expect(rest.size).toBeCloseTo(52 * 207 / 516, 1);
  expect(rest.weight).toBe('500');
  expect(rest.font).toContain('Inter');
  expect((await contact.locator('svg').boundingBox()).width).toBeCloseTo(52 * 115 / 516, 1);
  await contact.hover();
  await expect.poll(async () => (await style()).background).toBe('rgb(8, 9, 10)');
  const hot = await style();
  expect(hot.shadow).not.toBe(rest.shadow);
  await page.mouse.down();
  await expect.poll(async () => (await style()).background).toBe('rgb(7, 8, 9)');
  expect((await style()).shadow).not.toBe(hot.shadow);
  await page.mouse.move(4, 400);
  await page.mouse.up();
  await expect.poll(async () => (await style()).background).toBe('rgb(11, 12, 14)');
});

test('drag and pointer/keyboard ripples reach authored shader uniforms', async ({ page }) => {
  await page.addInitScript(() => {
    const proto = WebGL2RenderingContext.prototype;
    const locate = proto.getUniformLocation;
    const names = new Map();
    window.liquidUniforms = {};
    proto.getUniformLocation = function(program, name) {
      const location = locate.call(this, program, name);
      names.set(location, name.replace('[0]', ''));
      return location;
    };
    for (const method of ['uniform4f', 'uniform4fv']) {
      const original = proto[method];
      proto[method] = function(location, ...values) {
        window.liquidUniforms[names.get(location)] = method === 'uniform4fv' ? Array.from(values[0]) : values;
        return original.call(this, location, ...values);
      };
    }
  });
  await page.goto('/');
  await page.waitForTimeout(1200);
  const contact = page.locator('[data-liquid-contact]');
  await expect(contact).toHaveAttribute('data-liquid-renderer', 'webgl2');
  const b = await contact.boundingBox();
  await page.mouse.move(b.x + b.width * .2, b.y + b.height * .7);
  await expect.poll(() => page.evaluate(() => window.liquidUniforms.uPtr[0])).toBeLessThan(-.5);
  await page.mouse.down();
  await expect.poll(() => page.evaluate(() => window.liquidUniforms.uRip[3])).toBe(1);
  const ripple = await page.evaluate(() => window.liquidUniforms.uRip.slice(0, 4));
  expect(ripple[0]).toBeCloseTo(-.3 * b.width / b.height, 1);
  expect(ripple[1]).toBeCloseTo(.2, 1);
  await page.mouse.move(b.x + b.width * .85, b.y + b.height * .3);
  await expect.poll(() => page.evaluate(() => window.liquidUniforms.uPtr[0])).toBeGreaterThan(.5);
  expect(await page.evaluate(() => window.liquidUniforms.uRip.slice(0, 4))).toEqual(ripple);
  expect(await page.evaluate(() => window.liquidUniforms.uRipK2)).toEqual([.18, 6, 1.15, .45]);
  await page.mouse.move(4, 400);
  await page.mouse.up();
  // Suppress navigation only in this test so Enter's held state can be inspected.
  await contact.evaluate(el => el.addEventListener('click', e => e.preventDefault()));
  await contact.focus();
  for (const [index, key] of ['Enter', 'Space'].entries()) {
    await page.keyboard.down(key);
    await expect(contact).toHaveAttribute('data-liquid-pressing', 'true');
    await expect.poll(() => page.evaluate(i => window.liquidUniforms.uRip[i * 4 + 3], index + 1)).toBe(1);
    expect(await page.evaluate(i => window.liquidUniforms.uRip.slice(i * 4, i * 4 + 2), index + 1)).toEqual([0, 0]);
    await page.keyboard.up(key);
    await expect(contact).toHaveAttribute('data-liquid-pressing', 'false');
  }
  await expect(contact).toHaveAttribute('href', '/#about');
});

export type CanvasSmokeTitleOptions = {
  activateAfter?: number;
  animateIntro?: boolean;
  interactive?: boolean;
  onActivate?: () => void;
};

type Glyph = {
  character: string;
  x: number;
  baseline: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  color: string;
  delay: number;
  hoverSmoke: number;
};

export const mountCanvasSmokeTitle = (
  heading: HTMLElement,
  options: CanvasSmokeTitleOptions = {}
) => {
  const {
    activateAfter = 0,
    animateIntro = true,
    interactive = true,
    onActivate,
  } = options;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const lines = [...heading.querySelectorAll<HTMLElement>('[data-canvas-smoke-line]')];
  if (!lines.length) return () => {};

  let glyphIndex = 0;
  for (const line of lines) {
    const characters = Array.from(line.textContent ?? '');
    const glyphElements = characters.map((character) => {
      const glyph = document.createElement('span');
      glyph.className = 'canvas-smoke-title__glyph studio-title-glyph';
      glyph.textContent = character === ' ' ? '\u00a0' : character;
      glyph.dataset.canvasSmokeGlyph = `${glyphIndex}`;
      glyph.style.setProperty('--ctw-canvas-smoke-delay', `${90 + glyphIndex * 43}ms`);
      glyphIndex += 1;
      return glyph;
    });
    const baselineMarker = document.createElement('span');
    baselineMarker.className = 'canvas-smoke-title__baseline';
    baselineMarker.dataset.canvasSmokeBaseline = '';
    baselineMarker.setAttribute('aria-hidden', 'true');
    baselineMarker.style.cssText = 'display:inline-block;width:0;height:0;margin:0;padding:0;border:0;overflow:hidden;';
    line.replaceChildren(...glyphElements, baselineMarker);
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'canvas-smoke-title__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.renderMode = 'canvas';
  canvas.dataset.smokeActive = 'false';
  canvas.dataset.frameReady = 'false';
  const context = canvas.getContext('2d');
  if (!context) return () => {};
  heading.append(canvas);

  let glyphs: Glyph[] = [];
  let font = '';
  let fontSize = 0;
  let overscan = 0;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerEnergy = 0;
  let hasPointer = false;
  let pointerActive = false;
  let introStart = 0;
  let lastRenderTime = 0;
  let activated = false;
  let disposed = false;
  let touchReleaseTimer = 0;
  const introDuration = 1350;
  const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
  const easeOut = (value: number) => 1 - Math.pow(1 - value, 4);

  const layout = () => {
    const bounds = heading.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio, 1.5);
    const style = getComputedStyle(heading);
    fontSize = Number.parseFloat(style.fontSize);
    overscan = Math.min(160, Math.max(64, fontSize * 1.5));
    const canvasWidth = bounds.width + overscan * 2;
    const canvasHeight = bounds.height + overscan * 2;
    canvas.style.setProperty('--ctw-canvas-smoke-overscan', `${overscan}px`);
    canvas.width = Math.max(1, Math.round(canvasWidth * scale));
    canvas.height = Math.max(1, Math.round(canvasHeight * scale));
    context.setTransform(scale, 0, 0, scale, 0, 0);

    font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.font = font;
    context.textBaseline = 'alphabetic';
    const baselineByLine = new Map(lines.map((line) => {
      const marker = line.querySelector<HTMLElement>('[data-canvas-smoke-baseline]');
      return [line, (marker?.getBoundingClientRect().top ?? line.getBoundingClientRect().bottom) - bounds.top];
    }));
    canvas.dataset.baselines = JSON.stringify([...baselineByLine.values()].map((value) => Number(value.toFixed(2))));
    glyphs = [...heading.querySelectorAll<HTMLElement>('[data-canvas-smoke-glyph]')].map((glyph, index) => {
      const glyphBounds = glyph.getBoundingClientRect();
      const line = glyph.closest<HTMLElement>('[data-canvas-smoke-line]') ?? glyph;
      return {
        character: glyph.textContent ?? '',
        x: glyphBounds.left - bounds.left + overscan,
        baseline: (baselineByLine.get(line) ?? glyphBounds.bottom - bounds.top) + overscan,
        left: glyphBounds.left - bounds.left,
        right: glyphBounds.right - bounds.left,
        top: glyphBounds.top - bounds.top,
        bottom: glyphBounds.bottom - bounds.top,
        color: getComputedStyle(glyph).color,
        delay: 90 + index * 43,
        hoverSmoke: glyphs[index]?.hoverSmoke ?? 0,
      };
    });
  };

  const drawGlyph = (glyph: Glyph, alpha: number, smoke: number) => {
    context.save();
    context.font = font;
    context.textBaseline = 'alphabetic';
    context.fillStyle = glyph.color;

    if (smoke > 0.01) {
      const smokeLayers = [
        { blur: 0.24, alpha: 0.22 },
        { blur: 0.52, alpha: 0.14 },
        { blur: 0.82, alpha: 0.08 },
      ];
      context.shadowColor = glyph.color;
      smokeLayers.forEach((layer) => {
        context.globalAlpha = smoke * layer.alpha;
        context.shadowBlur = fontSize * layer.blur * smoke;
        context.filter = `blur(${fontSize * 0.08 * smoke}px)`;
        context.fillText(glyph.character, glyph.x, glyph.baseline);
      });
    }

    context.globalAlpha = alpha;
    context.shadowColor = glyph.color;
    context.shadowBlur = smoke * fontSize * 0.3;
    context.filter = smoke > 0.01 ? `blur(${fontSize * 0.12 * smoke}px)` : 'none';
    context.fillText(glyph.character, glyph.x, glyph.baseline);
    context.restore();
  };

  const drawSmokeField = (strength: number, color: string) => {
    if (strength <= 0.01) return;
    const [red = 255, green = 255, blue = 255] = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
    const radius = fontSize * 1.05;
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0.2)`);
    gradient.addColorStop(0.38, `rgba(${red}, ${green}, ${blue}, 0.11)`);
    gradient.addColorStop(0.72, `rgba(${red}, ${green}, ${blue}, 0.035)`);
    gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

    context.save();
    context.translate(pointerX + overscan, pointerY + overscan);
    context.scale(1.45, 0.78);
    context.globalAlpha = strength;
    context.filter = `blur(${fontSize * 0.09 * strength}px)`;
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  };

  const render = (now: number) => {
    frame = 0;
    const deltaTime = lastRenderTime ? Math.min(1000, Math.max(0, now - lastRenderTime)) : 16.67;
    lastRenderTime = now;
    context.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    let hoverActive = false;
    let fieldStrength = 0;
    let fieldColor = glyphs[0]?.color ?? 'rgb(255, 255, 255)';
    let nearestDistance = Number.POSITIVE_INFINITY;
    const preparedGlyphs: Array<{ glyph: Glyph; alpha: number; smoke: number }> = [];

    glyphs.forEach((glyph) => {
      let alpha = 1;
      let smoke = 0;

      if (!reducedMotion.matches && animateIntro) {
        const intro = clamp01((now - introStart - glyph.delay) / introDuration);
        if (intro < 1) active = true;
        alpha = easeOut(intro);
        smoke = Math.sin(Math.PI * intro) * (1 - intro * 0.25);
      }

      if (!reducedMotion.matches) {
        const centerX = (glyph.left + glyph.right) / 2;
        const centerY = (glyph.top + glyph.bottom) / 2;
        const distance = Math.hypot(centerX - pointerX, centerY - pointerY);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          fieldColor = glyph.color;
        }
        const radiusX = Math.max(fontSize * 1.12, 64);
        const radiusY = Math.max(fontSize * 0.72, 52);
        const dx = (centerX - pointerX) / radiusX;
        const dy = (centerY - pointerY) / radiusY;
        const targetSmoke = pointerActive ? Math.exp(-(dx * dx + dy * dy) * 1.55) * pointerEnergy : 0;
        const difference = targetSmoke - glyph.hoverSmoke;
        if (Math.abs(difference) > 0.008) {
          const responseTime = difference > 0 ? 70 : 180;
          glyph.hoverSmoke += difference * (1 - Math.exp(-deltaTime / responseTime));
          active = true;
        } else {
          glyph.hoverSmoke = targetSmoke;
        }
        if (glyph.hoverSmoke > 0.015) {
          hoverActive = true;
          fieldStrength = Math.max(fieldStrength, glyph.hoverSmoke);
          smoke = Math.max(smoke, glyph.hoverSmoke);
          alpha *= 1 - glyph.hoverSmoke * 0.38;
        }
      }

      preparedGlyphs.push({ glyph, alpha, smoke });
    });

    drawSmokeField(fieldStrength, fieldColor);
    preparedGlyphs.forEach(({ glyph, alpha, smoke }) => drawGlyph(glyph, alpha, smoke));

    canvas.dataset.smokeActive = hoverActive ? 'true' : 'false';
    canvas.dataset.frameReady = 'true';
    if (active && !document.hidden && !disposed) frame = requestAnimationFrame(render);
  };

  const start = () => {
    if (!frame && !document.hidden && !disposed) frame = requestAnimationFrame(render);
  };

  const onPointerInput = ({ clientX, clientY, pointerType }: PointerEvent) => {
    const touchInput = pointerType === 'touch';
    if (!activated || !interactive || reducedMotion.matches || (!touchInput && !precisePointer.matches)) return;
    const bounds = heading.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    const velocity = hasPointer ? Math.hypot(x - pointerX, y - pointerY) : 0;
    pointerX = x;
    pointerY = y;
    if (touchInput) window.clearTimeout(touchReleaseTimer);
    hasPointer = true;
    pointerActive = true;
    canvas.dataset.smokeX = x.toFixed(1);
    canvas.dataset.smokeY = y.toFixed(1);
    pointerEnergy = Math.min(1, (touchInput ? 0.82 : 0.68) + velocity / 24);
    start();
  };

  const releasePointer = () => {
    pointerActive = false;
    hasPointer = false;
    start();
  };
  const scheduleTouchRelease = () => {
    window.clearTimeout(touchReleaseTimer);
    touchReleaseTimer = window.setTimeout(releasePointer, 650);
  };
  const onPointerLeave = ({ pointerType }: PointerEvent) => {
    if (pointerType === 'touch') scheduleTouchRelease();
    else releasePointer();
  };
  const onPointerEnd = ({ pointerType }: PointerEvent) => {
    if (pointerType === 'touch') scheduleTouchRelease();
  };
  const resize = () => {
    layout();
    if (activated) start();
  };
  const resizeObserver = new ResizeObserver(resize);

  document.fonts.ready.then(() => {
    if (disposed) return;
    layout();
    resizeObserver.observe(heading);
    window.setTimeout(() => {
      if (disposed) return;
      introStart = performance.now();
      render(introStart);
      window.requestAnimationFrame(() => {
        if (disposed) return;
        canvas.dataset.handoffReady = canvas.dataset.frameReady;
        activated = true;
        heading.classList.add('is-canvas-smoke-active');
        start();
        onActivate?.();
      });
    }, reducedMotion.matches ? 0 : activateAfter);
  });

  heading.addEventListener('pointerdown', onPointerInput);
  heading.addEventListener('pointermove', onPointerInput);
  heading.addEventListener('pointerleave', onPointerLeave);
  heading.addEventListener('pointerup', onPointerEnd);
  heading.addEventListener('pointercancel', onPointerEnd);

  return () => {
    disposed = true;
    window.clearTimeout(touchReleaseTimer);
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    heading.removeEventListener('pointerdown', onPointerInput);
    heading.removeEventListener('pointermove', onPointerInput);
    heading.removeEventListener('pointerleave', onPointerLeave);
    heading.removeEventListener('pointerup', onPointerEnd);
    heading.removeEventListener('pointercancel', onPointerEnd);
    canvas.remove();
  };
};

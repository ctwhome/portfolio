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
  const context = canvas.getContext('2d');
  if (!context) return () => {};
  heading.append(canvas);

  let glyphs: Glyph[] = [];
  let font = '';
  let fontSize = 0;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let hasPointer = false;
  let introStart = 0;
  let activated = false;
  let disposed = false;
  const introDuration = 1350;
  const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
  const easeOut = (value: number) => 1 - Math.pow(1 - value, 4);

  const layout = () => {
    const bounds = heading.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio, 1.5);
    const style = getComputedStyle(heading);
    fontSize = Number.parseFloat(style.fontSize);
    const overscan = Math.min(160, Math.max(64, fontSize * 1.5));
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

  const drawGlyph = (glyph: Glyph, alpha: number, smoke: number, index: number) => {
    context.save();
    context.font = font;
    context.textBaseline = 'alphabetic';
    context.fillStyle = glyph.color;

    if (smoke > 0.01) {
      const verticalDirection = index % 2 ? -1 : 1;
      const smokeLayers = [
        { x: -0.34, y: -0.08 * verticalDirection, blur: 0.46, alpha: 0.24 },
        { x: -0.8, y: 0, blur: 1.1, alpha: 0.15 },
        { x: -1.15, y: 0.16 * verticalDirection, blur: 1.15, alpha: 0.1 },
      ];
      context.shadowColor = glyph.color;
      smokeLayers.forEach((layer) => {
        context.globalAlpha = smoke * layer.alpha;
        context.shadowBlur = fontSize * layer.blur * smoke;
        context.fillText(
          glyph.character,
          glyph.x + fontSize * layer.x * smoke,
          glyph.baseline + fontSize * layer.y * smoke
        );
      });
    }

    context.globalAlpha = alpha;
    context.shadowColor = glyph.color;
    context.shadowBlur = smoke * fontSize * 0.42;
    context.fillText(glyph.character, glyph.x, glyph.baseline);
    context.restore();
  };

  const render = (now: number) => {
    frame = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    let hoverActive = false;

    glyphs.forEach((glyph, index) => {
      let alpha = 1;
      let smoke = 0;

      if (!reducedMotion.matches && animateIntro) {
        const intro = clamp01((now - introStart - glyph.delay) / introDuration);
        if (intro < 1) active = true;
        alpha = easeOut(intro);
        smoke = Math.sin(Math.PI * intro) * (1 - intro * 0.25);
      }

      if (!reducedMotion.matches && glyph.hoverSmoke > 0.025) {
        active = true;
        hoverActive = true;
        smoke = Math.max(smoke, glyph.hoverSmoke);
        alpha *= 1 - glyph.hoverSmoke * 0.86;
        glyph.hoverSmoke *= 0.84;
      } else {
        glyph.hoverSmoke = 0;
      }

      drawGlyph(glyph, alpha, smoke, index);
    });

    canvas.dataset.smokeActive = hoverActive ? 'true' : 'false';
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
    hasPointer = true;
    canvas.dataset.smokeX = x.toFixed(1);
    canvas.dataset.smokeY = y.toFixed(1);
    const energy = Math.min(1, (touchInput ? 0.78 : 0.56) + velocity / 20);

    glyphs.forEach((glyph) => {
      const centerX = (glyph.left + glyph.right) / 2;
      const centerY = (glyph.top + glyph.bottom) / 2;
      const radiusX = Math.max(34, (glyph.right - glyph.left) * 2.15);
      const radiusY = Math.max(48, (glyph.bottom - glyph.top) * 0.92);
      const dx = (centerX - x) / radiusX;
      const dy = (centerY - y) / radiusY;
      const influence = Math.exp(-(dx * dx + dy * dy) * 2.2);
      glyph.hoverSmoke = Math.max(glyph.hoverSmoke, influence * energy);
    });
    start();
  };

  const onPointerLeave = () => { hasPointer = false; };
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
      heading.classList.add('is-canvas-smoke-handoff');
      start();
      window.setTimeout(() => {
        if (disposed) return;
        activated = true;
        heading.classList.remove('is-canvas-smoke-handoff');
        heading.classList.add('is-canvas-smoke-active');
        onActivate?.();
      }, reducedMotion.matches ? 0 : 180);
    }, reducedMotion.matches ? 0 : activateAfter);
  });

  heading.addEventListener('pointerdown', onPointerInput);
  heading.addEventListener('pointermove', onPointerInput);
  heading.addEventListener('pointerleave', onPointerLeave);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    heading.removeEventListener('pointerdown', onPointerInput);
    heading.removeEventListener('pointermove', onPointerInput);
    heading.removeEventListener('pointerleave', onPointerLeave);
    canvas.remove();
  };
};

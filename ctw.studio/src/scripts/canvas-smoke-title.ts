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
  hoverStart: number;
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
    line.replaceChildren(...characters.map((character) => {
      const glyph = document.createElement('span');
      glyph.className = 'canvas-smoke-title__glyph studio-title-glyph';
      glyph.textContent = character === ' ' ? '\u00a0' : character;
      glyph.dataset.canvasSmokeGlyph = `${glyphIndex}`;
      glyph.style.setProperty('--ctw-canvas-smoke-delay', `${90 + glyphIndex * 43}ms`);
      glyphIndex += 1;
      return glyph;
    }));
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
  let frame = 0;
  let lastIndex = -1;
  let introStart = 0;
  let activated = false;
  let disposed = false;
  const introDuration = 1350;
  const hoverDuration = 780;
  const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
  const easeOut = (value: number) => 1 - Math.pow(1 - value, 4);

  const layout = () => {
    const bounds = heading.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio, 1.5);
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    context.setTransform(scale, 0, 0, scale, 0, 0);

    const style = getComputedStyle(heading);
    font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.font = font;
    context.textBaseline = 'alphabetic';
    const metrics = context.measureText('Hg');

    glyphs = [...heading.querySelectorAll<HTMLElement>('[data-canvas-smoke-glyph]')].map((glyph, index) => {
      const glyphBounds = glyph.getBoundingClientRect();
      const line = glyph.closest<HTMLElement>('[data-canvas-smoke-line]') ?? glyph;
      const lineBounds = line.getBoundingClientRect();
      return {
        character: glyph.textContent ?? '',
        x: glyphBounds.left - bounds.left,
        baseline: lineBounds.top - bounds.top + lineBounds.height / 2
          + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2,
        left: glyphBounds.left - bounds.left,
        right: glyphBounds.right - bounds.left,
        top: glyphBounds.top - bounds.top,
        bottom: glyphBounds.bottom - bounds.top,
        color: getComputedStyle(glyph).color,
        delay: 90 + index * 43,
        hoverStart: glyphs[index]?.hoverStart ?? -1,
      };
    });
  };

  const drawGlyph = (glyph: Glyph, alpha: number, smoke: number, index: number) => {
    context.save();
    context.font = font;
    context.textBaseline = 'alphabetic';
    context.fillStyle = glyph.color;

    if (smoke > 0.01) {
      const direction = index % 2 ? -1 : 1;
      context.shadowColor = glyph.color;
      context.shadowBlur = 8 + smoke * 22;
      for (let layer = 0; layer < 3; layer += 1) {
        context.globalAlpha = smoke * (0.12 - layer * 0.025);
        const drift = smoke * (5 + layer * 7);
        context.fillText(
          glyph.character,
          glyph.x + direction * drift,
          glyph.baseline + (layer - 1) * smoke * 3
        );
      }
    }

    context.globalAlpha = alpha;
    context.shadowColor = glyph.color;
    context.shadowBlur = smoke * 10;
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

      if (!reducedMotion.matches && glyph.hoverStart >= 0) {
        const hover = clamp01((now - glyph.hoverStart) / hoverDuration);
        if (hover < 1) {
          active = true;
          hoverActive = true;
        } else {
          glyph.hoverStart = -1;
        }
        const hoverSmoke = Math.sin(Math.PI * hover);
        smoke = Math.max(smoke, hoverSmoke);
        alpha *= 1 - hoverSmoke * 0.72;
      }

      drawGlyph(glyph, alpha, smoke, index);
    });

    canvas.dataset.smokeActive = hoverActive ? 'true' : 'false';
    if (active && !document.hidden && !disposed) frame = requestAnimationFrame(render);
  };

  const start = () => {
    if (!frame && !document.hidden && !disposed) frame = requestAnimationFrame(render);
  };

  const triggerSmoke = (index: number, delay = 0) => {
    const glyph = glyphs[index];
    if (!glyph) return;
    glyph.hoverStart = performance.now() + delay;
    start();
  };

  const onPointerMove = ({ clientX, clientY }: PointerEvent) => {
    if (!activated || !interactive || !precisePointer.matches || reducedMotion.matches) return;
    const bounds = heading.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    const index = glyphs.findIndex((glyph) => x >= glyph.left && x <= glyph.right && y >= glyph.top && y <= glyph.bottom);
    if (index < 0 || index === lastIndex) return;
    lastIndex = index;
    triggerSmoke(index);
    triggerSmoke(index - 1, 55);
    triggerSmoke(index + 1, 95);
  };

  const onPointerLeave = () => { lastIndex = -1; };
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
      activated = true;
      introStart = performance.now();
      heading.classList.add('is-canvas-smoke-active');
      start();
      onActivate?.();
    }, reducedMotion.matches ? 0 : activateAfter);
  });

  heading.addEventListener('pointermove', onPointerMove);
  heading.addEventListener('pointerleave', onPointerLeave);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    heading.removeEventListener('pointermove', onPointerMove);
    heading.removeEventListener('pointerleave', onPointerLeave);
    canvas.remove();
  };
};

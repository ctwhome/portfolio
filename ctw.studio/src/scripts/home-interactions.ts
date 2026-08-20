const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector<HTMLElement>('.studio-hero');
const title = document.querySelector<HTMLElement>('.studio-hero__title');

if (hero && precisePointer.matches && !reducedMotion.matches) {
  hero.addEventListener('pointermove', ({ clientX, clientY }) => {
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty('--studio-hero-x', `${clientX - bounds.left}px`);
    hero.style.setProperty('--studio-hero-y', `${clientY - bounds.top}px`);
  });
}

const initPageFluid = () => {
  if (!precisePointer.matches || reducedMotion.matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'studio-page-fluid';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  if (!gl) return;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };

  const vertex = compile(gl.VERTEX_SHADER, `#version 300 es
    in vec2 aPosition;
    out vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `);
  const fragment = compile(gl.FRAGMENT_SHADER, `#version 300 es
    precision highp float;
    in vec2 vUv;
    out vec4 outColor;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uEnergy;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      mat2 rotation = mat2(0.8, 0.6, -0.6, 0.8);
      for (int octave = 0; octave < 4; octave++) {
        value += amplitude * noise(p);
        p = rotation * p * 2.03 + 0.17;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      vec2 p = vUv;
      p.x *= aspect;
      vec2 drift = vec2(uTime * 0.025, -uTime * 0.018);
      vec2 turbulence = vec2(
        fbm(p * 1.65 + drift),
        fbm(p * 1.65 + drift + vec2(4.7, 1.9))
      );
      float current = fbm(p * 2.15 + turbulence * 1.85 - drift * 0.7);
      float filament = smoothstep(0.54, 0.88, current);

      vec2 pointer = uPointer;
      pointer.x *= aspect;
      vec2 delta = p - pointer;
      float radius = exp(-dot(delta, delta) * 5.5);
      float wake = radius * uEnergy;
      float ripple = 0.5 + 0.5 * sin(length(delta) * 22.0 - uTime * 1.8 + current * 5.0);

      float alpha = filament * 0.075 + wake * (0.055 + ripple * 0.07);
      vec3 amber = vec3(0.969, 0.710, 0.0);
      vec3 ember = vec3(0.55, 0.18, 0.02);
      vec3 color = mix(ember, amber, smoothstep(0.42, 0.9, current));
      outColor = vec4(color * alpha, alpha);
    }
  `);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const position = gl.getAttribLocation(program, 'aPosition');
  const resolution = gl.getUniformLocation(program, 'uResolution');
  const pointer = gl.getUniformLocation(program, 'uPointer');
  const time = gl.getUniformLocation(program, 'uTime');
  const energy = gl.getUniformLocation(program, 'uEnergy');
  const buffer = gl.createBuffer();
  if (position < 0 || !resolution || !pointer || !time || !energy || !buffer) return;

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  document.body.prepend(canvas);

  let targetX = 0.5;
  let targetY = 0.46;
  let currentX = targetX;
  let currentY = targetY;
  let pointerEnergy = 0;
  let elapsed = 0;
  let lastTimestamp = 0;
  let lastRendered = 0;
  let frame = 0;
  let running = false;

  const resize = () => {
    const scale = Math.min(devicePixelRatio, 1.25);
    canvas.width = Math.max(1, Math.round(innerWidth * scale));
    canvas.height = Math.max(1, Math.round(innerHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const render = (timestamp: number) => {
    if (!running) return;
    frame = requestAnimationFrame(render);
    if (timestamp - lastRendered < 33) return;
    if (lastTimestamp) elapsed += Math.min(timestamp - lastTimestamp, 50) / 1000;
    lastTimestamp = timestamp;
    lastRendered = timestamp;
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    pointerEnergy *= 0.955;
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform2f(pointer, currentX, 1 - currentY);
    gl.uniform1f(time, elapsed);
    gl.uniform1f(energy, pointerEnergy);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const syncRendering = () => {
    const shouldRun = !document.hidden;
    if (shouldRun === running) return;
    running = shouldRun;
    lastTimestamp = 0;
    if (running) frame = requestAnimationFrame(render);
    else cancelAnimationFrame(frame);
  };

  addEventListener('pointermove', ({ clientX, clientY }) => {
    targetX = clientX / innerWidth;
    targetY = clientY / innerHeight;
    pointerEnergy = Math.min(1, pointerEnergy + 0.24);
  });
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncRendering);
  resize();
  syncRendering();
};

initPageFluid();

const initTitleCanvas = (heading: HTMLElement) => {
  const lines = [...heading.querySelectorAll<HTMLElement>('.studio-title-line')];
  if (!lines.length) return;

  let glyphIndex = 0;
  for (const line of lines) {
    const characters = Array.from(line.textContent ?? '');
    line.replaceChildren(...characters.map((character) => {
      const glyph = document.createElement('span');
      glyph.className = 'studio-title-glyph';
      glyph.textContent = character === ' ' ? '\u00a0' : character;
      glyph.dataset.glyphIndex = `${glyphIndex}`;
      glyphIndex += 1;
      return glyph;
    }));
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'studio-title-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.renderMode = 'canvas';
  canvas.dataset.smokeActive = 'false';
  const context = canvas.getContext('2d');
  if (!context) return;
  heading.append(canvas);

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

  let glyphs: Glyph[] = [];
  let font = '';
  let frame = 0;
  let lastIndex = -1;
  let introStart = 0;
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

    glyphs = [...heading.querySelectorAll<HTMLElement>('.studio-title-glyph')].map((glyph, index) => {
      const glyphBounds = glyph.getBoundingClientRect();
      const line = glyph.closest<HTMLElement>('.studio-title-line') ?? glyph;
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

      if (!reducedMotion.matches) {
        const intro = clamp01((now - introStart - glyph.delay) / introDuration);
        if (intro < 1) active = true;
        alpha = easeOut(intro);
        smoke = Math.sin(Math.PI * intro) * (1 - intro * 0.25);

        if (glyph.hoverStart >= 0) {
          const hover = clamp01((now - glyph.hoverStart) / hoverDuration);
          if (hover < 1) {
            active = true;
            hoverActive = true;
          }
          else glyph.hoverStart = -1;
          const hoverSmoke = Math.sin(Math.PI * hover);
          smoke = Math.max(smoke, hoverSmoke);
          alpha *= 1 - hoverSmoke * 0.72;
        }
      }

      drawGlyph(glyph, alpha, smoke, index);
    });

    canvas.dataset.smokeActive = hoverActive ? 'true' : 'false';

    if (active && !document.hidden) frame = requestAnimationFrame(render);
  };

  const start = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  };

  const triggerSmoke = (index: number, delay = 0) => {
    const glyph = glyphs[index];
    if (!glyph) return;
    glyph.hoverStart = performance.now() + delay;
    start();
  };

  const onPointerMove = ({ clientX, clientY }: PointerEvent) => {
    if (!precisePointer.matches || reducedMotion.matches || !document.body.classList.contains('studio-hero-complete')) return;
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
    start();
  };

  document.fonts.ready.then(() => {
    layout();
    introStart = performance.now();
    heading.classList.add('has-title-canvas');
    start();
    setTimeout(() => {
      document.body.classList.add('studio-hero-complete');
      dispatchEvent(new Event('studio-hero-complete'));
    }, reducedMotion.matches ? 0 : 2900);
  });

  heading.addEventListener('pointermove', onPointerMove);
  heading.addEventListener('pointerleave', onPointerLeave);
  new ResizeObserver(resize).observe(heading);
};

if (title) {
  initTitleCanvas(title);

  let scrollFrame = 0;
  const updateTitleOnScroll = () => {
    scrollFrame = 0;
    const progress = Math.min(scrollY / 420, 1);
    title.style.setProperty('--studio-title-shift', `${progress * -10}px`);
    title.style.setProperty('--studio-title-spacing', `${-0.03 - progress * 0.012}em`);
  };
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateTitleOnScroll);
  }, { passive: true });
}

const initProductLens = () => {
  if (reducedMotion.matches) return;

  const cards = [...document.querySelectorAll<HTMLElement>('.studio-product')];
  if (!cards.length) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'studio-product__webgl';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power'
  });
  if (!gl) return;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };

  const vertex = compile(gl.VERTEX_SHADER, `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `);
  const fragment = compile(gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform sampler2D uImage;
    uniform vec2 uPointer;
    uniform float uAspect;
    uniform float uStrength;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec2 delta = vUv - uPointer;
      delta.x *= uAspect;
      float distanceToPointer = length(delta);
      float influence = smoothstep(0.42, 0.0, distanceToPointer) * uStrength;
      vec2 direction = normalize(delta + vec2(0.0001));
      direction.x /= uAspect;
      float ripple = sin(distanceToPointer * 38.0 - uTime * 2.8) * 0.0035 * influence;
      vec2 offset = direction * (0.022 * influence + ripple);
      float split = 0.0035 * influence;
      vec4 base = texture2D(uImage, vUv + offset);
      float red = texture2D(uImage, vUv + offset + direction * split).r;
      float blue = texture2D(uImage, vUv + offset - direction * split).b;
      gl_FragColor = vec4(red, base.g, blue, 1.0);
    }
  `);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const position = gl.getAttribLocation(program, 'aPosition');
  const pointerUniform = gl.getUniformLocation(program, 'uPointer');
  const aspectUniform = gl.getUniformLocation(program, 'uAspect');
  const strengthUniform = gl.getUniformLocation(program, 'uStrength');
  const timeUniform = gl.getUniformLocation(program, 'uTime');
  const imageUniform = gl.getUniformLocation(program, 'uImage');
  if (position < 0 || !pointerUniform || !aspectUniform || !strengthUniform || !timeUniform || !imageUniform) return;

  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  if (!buffer || !texture) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.uniform1i(imageUniform, 0);

  let activeCard: HTMLElement | null = null;
  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let energy = 0;
  let frame = 0;

  const draw = (time: number) => {
    frame = 0;
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    energy *= 0.94;
    gl.uniform2f(pointerUniform, currentX, currentY);
    gl.uniform1f(strengthUniform, energy);
    gl.uniform1f(timeUniform, time / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (activeCard && (energy > 0.01 || Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.002)) {
      frame = requestAnimationFrame(draw);
    }
  };

  const startDrawing = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const setPointer = (card: HTMLElement, clientX: number, clientY: number) => {
    const bounds = card.getBoundingClientRect();
    targetX = (clientX - bounds.left) / bounds.width;
    targetY = 1 - (clientY - bounds.top) / bounds.height;
  };

  for (const card of cards) {
    const image = card.querySelector<HTMLImageElement>('img');
    if (!image) continue;

    card.addEventListener('pointerenter', async (event) => {
      activeCard = card;
      setPointer(card, event.clientX, event.clientY);
      if (!image.complete) await image.decode().catch(() => undefined);
      if (activeCard !== card || !image.naturalWidth) return;

      card.append(canvas);
      const bounds = card.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio, 1.5);
      canvas.width = Math.round(bounds.width * scale);
      canvas.height = Math.round(bounds.height * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(aspectUniform, bounds.width / bounds.height);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      currentX = targetX;
      currentY = targetY;
      energy = 0.78;
      canvas.classList.add('is-active');
      startDrawing();
    });

    card.addEventListener('pointermove', (event) => {
      if (activeCard !== card) return;
      setPointer(card, event.clientX, event.clientY);
      energy = Math.min(1, energy + 0.42);
      startDrawing();
    });

    card.addEventListener('pointerleave', () => {
      if (activeCard !== card) return;
      activeCard = null;
      energy = 0;
      canvas.classList.remove('is-active');
    });
  }
};

const initScrollReveals = () => {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const elements = document.querySelectorAll<HTMLElement>([
    '.studio-section .ctw-section-number',
    '.studio-section .ctw-heading-lg',
    '.studio-founder',
    '.studio-mission > *',
    '.studio-intro > *',
    '.studio-offerings li',
    '.studio-process details',
    '.studio-products-section .ctw-lede',
    '.studio-product',
    '.studio-notes__cue',
    '.studio-quotes blockquote',
    '.studio-partners',
    '.studio-contact > *',
    '.studio-home .ctw-footer--complete > *'
  ].join(','));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  elements.forEach((element, index) => {
    element.classList.add('studio-scroll-reveal');
    element.style.setProperty('--studio-reveal-delay', `${index % 4 * 55}ms`);
  });
  const start = () => elements.forEach((element) => observer.observe(element));
  if (document.body.classList.contains('studio-hero-complete')) {
    start();
  } else {
    addEventListener('studio-hero-complete', start, { once: true });
  }
};

initProductLens();
initScrollReveals();

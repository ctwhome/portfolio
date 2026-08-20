import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const body = document.body;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const desktopStory = window.matchMedia('(min-width: 64rem) and (min-height: 38rem)');
const cleanups: Array<() => void> = [];
let chapterTarget = 0;
let pageProgressTarget = 0;
let velocityTarget = 0;

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

function setActiveChapter(index: number) {
  chapterTarget = index;
  const story = document.querySelector<HTMLElement>('[data-story]');
  story?.setAttribute('data-active-chapter', String(index));
  document.querySelectorAll<HTMLElement>('.so-story__progress li').forEach((item, itemIndex) => {
    if (itemIndex === index) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
}

function splitWords(element: HTMLElement) {
  if (element.dataset.motionSplit === 'true') return;
  const label = element.textContent?.trim();
  if (!label) return;
  element.textContent = '';
  element.setAttribute('aria-label', label);
  for (const part of label.split(/(\s+)/)) {
    if (!part.trim()) {
      element.append(document.createTextNode(part));
      continue;
    }
    const mask = document.createElement('span');
    const word = document.createElement('span');
    mask.className = 'so-word-mask';
    mask.setAttribute('aria-hidden', 'true');
    word.className = 'so-word';
    word.textContent = part;
    mask.append(word);
    element.append(mask);
  }
  element.dataset.motionSplit = 'true';
}

function initMotion() {
  if (reducedMotion.matches) {
    body.dataset.motion = 'reduced';
    return;
  }

  const story = document.querySelector<HTMLElement>('[data-story]');
  const stage = document.querySelector<HTMLElement>('[data-story-stage]');
  const panels = gsap.utils.toArray<HTMLElement>('[data-story-panel]');
  let lenis: Lenis | undefined;
  let lenisRaf: ((time: number) => void) | undefined;
  let fallbackTimer = 0;

  try {
    document.querySelectorAll<HTMLElement>('[data-motion-lines]').forEach(splitWords);
    root.classList.add('so-motion');
    body.dataset.motion = 'ready';

    const entry = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onStart: () => { body.dataset.entryState = 'playing'; },
      onComplete: () => { body.dataset.entryState = 'settled'; },
    });
    entry
      .from('[data-entry="signal"]', { autoAlpha: 0, duration: 0.55 }, 0)
      .from('[data-entry="signal"] span:nth-child(1)', { scaleX: 0, duration: 1.15 }, 0.04)
      .from('[data-entry="signal"] span:nth-child(2)', { scale: 0, duration: 0.55 }, 0.42)
      .from('[data-entry="signal"] span:nth-child(3)', { scale: 0.25, autoAlpha: 0, duration: 0.8 }, 0.48)
      .from('[data-entry="identity"]', { y: -18, autoAlpha: 0, duration: 0.72, stagger: 0.08 }, 0.28)
      .from('[data-entry="headline"]', { yPercent: 112, autoAlpha: 0, duration: 1.02, stagger: 0.12 }, 0.68)
      .from('[data-entry="intro"]', { y: 24, autoAlpha: 0, duration: 0.82, stagger: 0.12 }, 1.42);

    fallbackTimer = window.setTimeout(() => {
      gsap.set('[data-entry]', { clearProps: 'opacity,visibility' });
      body.dataset.entryState = 'settled';
    }, 3200);

    for (const element of gsap.utils.toArray<HTMLElement>('[data-motion-lines]')) {
      gsap.from(element.querySelectorAll('.so-word'), {
        yPercent: 110,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.045,
        scrollTrigger: { trigger: element, start: 'top 82%', once: true },
      });
    }

    for (const element of gsap.utils.toArray<HTMLElement>('[data-reveal]')) {
      gsap.from(element, {
        y: 32,
        autoAlpha: 0,
        duration: 0.88,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 84%', once: true },
      });
    }

    for (const figure of gsap.utils.toArray<HTMLElement>('[data-image-reveal]')) {
      const image = figure.querySelector('img');
      if (!image) continue;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: figure, start: 'top 84%', once: true },
      });
      timeline
        .from(figure, { clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'power4.out' })
        .from(image, { scale: 1.08, duration: 1.15, ease: 'power4.out' }, 0);
      gsap.fromTo(image, { yPercent: 0 }, {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
      });
    }

    if (story && stage && panels.length === 4 && desktopStory.matches) {
      story.classList.add('so-story--enhanced');
      gsap.set(panels, { autoAlpha: 0, y: 34 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });

      const storyTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3.5}`,
          pin: stage,
          scrub: 1.05,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => {
            let activeIndex = 0;
            let activeOpacity = -1;
            panels.forEach((panel, index) => {
              const opacity = Number(gsap.getProperty(panel, 'opacity'));
              if (opacity > activeOpacity) {
                activeIndex = index;
                activeOpacity = opacity;
              }
            });
            setActiveChapter(activeIndex);
          },
        },
      });
      for (let index = 1; index < panels.length; index += 1) {
        const position = index - 1;
        storyTimeline
          .set(panels[index - 1], { autoAlpha: 0, y: -24 }, position + 0.5)
          .set(panels[index], { autoAlpha: 1, y: 0 }, position + 0.5);
      }
    } else if (panels.length) {
      const observer = new IntersectionObserver((entries) => {
        const mostVisible = [...entries]
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveChapter(Number((mostVisible.target as HTMLElement).dataset.chapter || 0));
      }, { threshold: [0.35, 0.55, 0.75] });
      panels.forEach((panel) => observer.observe(panel));
      cleanups.push(() => observer.disconnect());
    }

    if (finePointer.matches && desktopStory.matches) {
      lenis = new Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.88, anchors: true });
      body.dataset.smoothScroll = 'active';
      lenis.on('scroll', ScrollTrigger.update);
      lenisRaf = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);
    }

    if (finePointer.matches) {
      for (const element of gsap.utils.toArray<HTMLElement>('[data-magnetic]')) {
        const xTo = gsap.quickTo(element, 'x', { duration: 0.45, ease: 'power3.out' });
        const yTo = gsap.quickTo(element, 'y', { duration: 0.45, ease: 'power3.out' });
        const move = (event: PointerEvent) => {
          const bounds = element.getBoundingClientRect();
          xTo((event.clientX - bounds.left - bounds.width / 2) * 0.14);
          yTo((event.clientY - bounds.top - bounds.height / 2) * 0.18);
        };
        const leave = () => { xTo(0); yTo(0); };
        element.addEventListener('pointermove', move);
        element.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerleave', leave);
        });
      }
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
    cleanups.push(() => window.removeEventListener('load', refresh));
  } catch (error) {
    root.classList.remove('so-motion');
    story?.classList.remove('so-story--enhanced');
    gsap.set('[data-entry], [data-reveal], [data-motion-lines], [data-story-panel], [data-image-reveal], [data-image-reveal] img', { clearProps: 'all' });
    body.dataset.motion = 'fallback';
    body.dataset.entryState = 'settled';
    console.warn('Stand Out motion fell back to static content.', error);
  }

  cleanups.push(() => {
    window.clearTimeout(fallbackTimer);
    if (lenisRaf) gsap.ticker.remove(lenisRaf);
    lenis?.destroy();
    delete body.dataset.smoothScroll;
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf('*');
    root.classList.remove('so-motion');
    story?.classList.remove('so-story--enhanced');
  });
}

function initScrollInputs() {
  let previousY = window.scrollY;
  let previousTime = performance.now();
  const update = () => {
    const now = performance.now();
    const y = window.scrollY;
    const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    pageProgressTarget = clamp(y / maximum, 0, 1);
    velocityTarget = clamp(((y - previousY) / Math.max(16, now - previousTime)) * 0.15, -1.5, 1.5);
    previousY = y;
    previousTime = now;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', update));
}

function initCanvas() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-signal-canvas]');
  const stage = document.querySelector<HTMLElement>('[data-canvas-stage]');
  const zones = [...document.querySelectorAll<HTMLElement>('[data-field-zone]')];
  if (!canvas || !stage || !zones.length || reducedMotion.matches) return;

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
  });
  if (!gl) {
    stage.dataset.webgl = 'failed';
    return;
  }

  const vertexSource = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `;
  const fragmentSource = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 pointer;
    uniform float time;
    uniform float pageProgress;
    uniform float scrollVelocity;
    uniform float chapter;

    float hash(vec2 point) {
      return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
    }

    vec3 chapterColor(float value) {
      vec3 rouge = vec3(0.82, 0.10, 0.22);
      vec3 gold = vec3(0.95, 0.48, 0.12);
      vec3 blue = vec3(0.04, 0.46, 0.58);
      vec3 signal = vec3(1.0, 0.18, 0.02);
      if (value < 1.0) return mix(rouge, gold, value);
      if (value < 2.0) return mix(gold, blue, value - 1.0);
      return mix(blue, signal, value - 2.0);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      vec2 point = uv * 2.0 - 1.0;
      point.x *= resolution.x / resolution.y;
      vec2 attention = pointer * 2.0 - 1.0;
      attention.x *= resolution.x / resolution.y;

      float speed = abs(scrollVelocity);
      float warp = sin(point.y * 4.0 + time * 0.18 + pageProgress * 8.0) * (0.08 + speed * 0.16);
      float distanceToAttention = length(point - attention + vec2(warp, 0.0));
      float core = smoothstep(0.72 + speed * 0.2, 0.015, distanceToAttention);
      float rings = sin(distanceToAttention * (19.0 + speed * 11.0) - time * (0.7 + speed)) * 0.5 + 0.5;
      rings *= smoothstep(1.25, 0.08, distanceToAttention);

      float ribbonY = -0.32 + sin(point.x * 1.55 + time * 0.16 + chapter * 0.9) * 0.11;
      float ribbon = smoothstep(0.085 + speed * 0.06, 0.0, abs(point.y - ribbonY));
      float fieldA = sin((point.x + point.y * 0.72) * 6.0 - time * 0.22 + chapter) * 0.5 + 0.5;
      float fieldB = sin((point.x * 0.35 - point.y) * 11.0 + time * 0.13 - pageProgress * 5.0) * 0.5 + 0.5;
      float layers = fieldA * fieldB * 0.11;

      vec3 coal = vec3(0.027, 0.026, 0.022);
      vec3 accent = chapterColor(chapter);
      vec3 color = coal + accent * (core * 0.52 + rings * 0.13 + ribbon * 0.3 + layers);
      color += vec3(1.0, 0.25, 0.04) * speed * rings * 0.16;
      color += (hash(gl_FragCoord.xy + time) - 0.5) * 0.022;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (!program || !vertex || !fragment) {
    stage.dataset.webgl = 'failed';
    if (program) gl.deleteProgram(program);
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    stage.dataset.webgl = 'failed';
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return;
  }

  const buffer = gl.createBuffer();
  const position = gl.getAttribLocation(program, 'position');
  const uniforms = {
    resolution: gl.getUniformLocation(program, 'resolution'),
    pointer: gl.getUniformLocation(program, 'pointer'),
    time: gl.getUniformLocation(program, 'time'),
    pageProgress: gl.getUniformLocation(program, 'pageProgress'),
    scrollVelocity: gl.getUniformLocation(program, 'scrollVelocity'),
    chapter: gl.getUniformLocation(program, 'chapter'),
  };
  const pointerTarget = { x: 0.72, y: 0.66 };
  const pointerCurrent = { ...pointerTarget };
  let chapterCurrent = 0;
  let progressCurrent = pageProgressTarget;
  let velocityCurrent = 0;
  let frame = 0;
  let disposed = false;
  const visibleZones = new Set<Element>();

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(uniforms.resolution, width, height);
  };

  const render = (now: number) => {
    frame = 0;
    if (disposed || document.hidden || visibleZones.size === 0) return;
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.065;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.065;
    chapterCurrent += (chapterTarget - chapterCurrent) * 0.045;
    progressCurrent += (pageProgressTarget - progressCurrent) * 0.08;
    velocityCurrent += (velocityTarget - velocityCurrent) * 0.16;
    velocityTarget *= 0.91;
    gl.uniform2f(uniforms.pointer, pointerCurrent.x, pointerCurrent.y);
    gl.uniform1f(uniforms.time, now * 0.001);
    gl.uniform1f(uniforms.pageProgress, progressCurrent);
    gl.uniform1f(uniforms.scrollVelocity, velocityCurrent);
    gl.uniform1f(uniforms.chapter, chapterCurrent);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    frame = requestAnimationFrame(render);
  };

  const start = () => {
    if (!frame && !disposed && !document.hidden && visibleZones.size > 0) frame = requestAnimationFrame(render);
  };
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
  const onVisibility = () => document.hidden ? stop() : start();
  const onPointerMove = (event: PointerEvent) => {
    pointerTarget.x = clamp(event.clientX / window.innerWidth, 0, 1);
    pointerTarget.y = clamp(1 - event.clientY / window.innerHeight, 0, 1);
  };
  const onPointerLeave = () => {
    pointerTarget.x = 0.72;
    pointerTarget.y = 0.66;
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    stage.dataset.webgl = 'failed';
  };

  const resizeObserver = new ResizeObserver(() => { resize(); start(); });
  const zoneObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleZones.add(entry.target);
      else visibleZones.delete(entry.target);
    }
    visibleZones.size ? start() : stop();
  }, { rootMargin: '15% 0px' });

  resizeObserver.observe(canvas);
  zones.forEach((zone) => zoneObserver.observe(zone));
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost);
  if (finePointer.matches) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
  }

  stage.dataset.webgl = 'ready';
  stage.dataset.webglInputs = 'pointer scroll chapter';
  stage.dataset.webglDprCap = '1.5';
  resize();
  start();

  cleanups.push(() => {
    disposed = true;
    stop();
    resizeObserver.disconnect();
    zoneObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  });
}

initScrollInputs();
initMotion();
initCanvas();

window.addEventListener('pagehide', () => {
  while (cleanups.length) cleanups.pop()?.();
}, { once: true });

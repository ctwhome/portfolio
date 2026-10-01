// /home2/ interactions: the original homepage smoke/ripple title and an
// exploded-view toggle with pointer tilt on CSS 3D plates.
// No dependencies and no animation loop at rest; frames are requested only while a
// mouse or pen moves. The head script adds `h2-motion` only when motion is allowed.

import { mountCanvasSmokeTitle } from './canvas-smoke-title';
import { mountTitleRipple } from './title-ripple';

const motion = document.documentElement.classList.contains('h2-motion');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const listeners = new AbortController();
const { signal } = listeners;

const title = document.querySelector<HTMLElement>('.h2-hero__title');
if (title) {
  let disposeRipple = () => {};
  const disposeSmoke = mountCanvasSmokeTitle(title, {
    animateIntro: true,
    interactive: true,
    onActivate: () => {
      const source = title.querySelector<HTMLCanvasElement>('.canvas-smoke-title__canvas');
      if (source) disposeRipple = mountTitleRipple(title, source);
    }
  });
  addEventListener('pagehide', (event) => {
    if (!event.persisted) {
      disposeRipple();
      disposeSmoke();
    }
  }, { signal });
}

const stack = document.querySelector<HTMLElement>('[data-h2-stack]');
const toggle = stack?.querySelector<HTMLButtonElement>('[data-h2-toggle]');

if (stack && toggle) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const exploded = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(exploded));
    toggle.textContent = exploded ? 'Stack layers' : 'Show layers';
    stack.dataset.state = exploded ? 'exploded' : 'collapsed';
  }, { signal });
}

const trackPointer = (
  surface: HTMLElement,
  write: (x: number, y: number) => void,
  onEnter?: () => void,
  onLeave?: () => void
) => {
  let frame = 0;
  let x = 0;
  let y = 0;
  const flush = () => {
    frame = 0;
    write(x, y);
  };

  surface.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') onEnter?.();
  }, { signal });
  surface.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = surface.getBoundingClientRect();
    x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
    y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
    if (!frame) frame = requestAnimationFrame(flush);
  }, { signal });
  surface.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    x = 0;
    y = 0;
    write(0, 0);
    onLeave?.();
  }, { signal });
};

if (motion && finePointer.matches) {
  const stage = stack?.querySelector<HTMLElement>('.h2-stack__stage');
  if (stage && stack) {
    trackPointer(stage, (x, y) => {
      stack.style.setProperty('--h2-tilt-x', x.toFixed(3));
      stack.style.setProperty('--h2-tilt-y', y.toFixed(3));
    });
  }

  for (const item of document.querySelectorAll<HTMLElement>('[data-h2-case]')) {
    const media = item.querySelector<HTMLElement>('.h2-case__media');
    const plate = item.querySelector<HTMLElement>('.h2-case__plate');
    if (!media || !plate) continue;
    trackPointer(
      media,
      (x, y) => {
        plate.style.setProperty('--h2-px', x.toFixed(3));
        plate.style.setProperty('--h2-py', y.toFixed(3));
      },
      () => item.classList.add('is-lifted'),
      () => item.classList.remove('is-lifted')
    );
  }
}

addEventListener('pagehide', (event) => {
  if (!event.persisted) listeners.abort();
}, { signal });

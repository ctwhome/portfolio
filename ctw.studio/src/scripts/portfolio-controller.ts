const html = document.documentElement;
const dialogs = new Map(
  [...document.querySelectorAll<HTMLDialogElement>('[data-project-dialog]')]
    .map((dialog) => [dialog.dataset.projectDialog ?? '', dialog])
);
let active: HTMLDialogElement | null = null;
let returnFocus: HTMLElement | null = null;
let savedScrollY = 0;
let syncingHistory = false;
const galleryStateKey = 'portfolioGallery';
const focusStateKey = 'portfolioReturnFocus';
const scrollStateKey = 'portfolioScrollY';

html.classList.add('portfolio-enhanced');

function idFromHash() {
  const hash = location.hash.slice(1);
  if (!hash) return '';
  try {
    return decodeURIComponent(hash);
  } catch {
    history.replaceState(history.state, '', `${location.pathname}${location.search}`);
    closeActive(false);
    return '';
  }
}

function restoreOriginFromHistory() {
  const id = history.state?.[focusStateKey];
  const scrollY = history.state?.[scrollStateKey];
  if (idFromHash() || typeof id !== 'string' || typeof scrollY !== 'number') return;
  const state = { ...history.state };
  delete state[focusStateKey];
  delete state[scrollStateKey];
  history.replaceState(state, '', location.href);
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY);
    document.querySelector<HTMLElement>(`[data-project-link="${CSS.escape(id)}"]`)
      ?.focus({ preventScroll: true });
  });
}

function loadDialogMedia(dialog: HTMLDialogElement) {
  dialog.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((image) => {
    image.src = image.dataset.src ?? '';
    image.removeAttribute('data-src');
  });
  dialog.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    source.src = source.dataset.src ?? '';
    source.removeAttribute('data-src');
    source.closest('video')?.load();
  });
}

function closeActive(restoreFocus = true) {
  if (!active) {
    document.body.classList.remove('project-dialog-open');
    return;
  }
  const closing = active;
  const focusTarget = returnFocus;
  const scrollY = savedScrollY;
  active = null;
  syncingHistory = true;
  if (closing.open) closing.close();
  syncingHistory = false;
  document.body.classList.remove('project-dialog-open');
  window.scrollTo(0, scrollY);
  if (restoreFocus) {
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      focusTarget?.focus({ preventScroll: true });
    });
  }
}

function openProject(id: string, navigate = false, trigger?: HTMLElement | null) {
  const dialog = dialogs.get(id);
  if (!dialog) return;
  const switching = Boolean(active);
  if (!active) {
    savedScrollY = window.scrollY;
    returnFocus = trigger ?? document.querySelector<HTMLElement>(`[data-project-link="${CSS.escape(id)}"]`);
  } else if (active !== dialog) {
    syncingHistory = true;
    active.close();
    syncingHistory = false;
  }
  active = dialog;
  document.body.classList.add('project-dialog-open');
  loadDialogMedia(dialog);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  if (navigate && idFromHash() !== id) {
    if (switching) {
      history.replaceState(history.state, '', `#${id}`);
    } else {
      const baseState = {
        ...history.state,
        [focusStateKey]: id,
        [scrollStateKey]: savedScrollY
      };
      history.replaceState(baseState, '', location.href);
      history.pushState({ ...baseState, [galleryStateKey]: true }, '', `#${id}`);
    }
  }
}

function syncFromLocation() {
  const id = idFromHash();
  if (id && dialogs.has(id)) openProject(id);
  else closeActive();
}

function onClick(event: MouseEvent) {
  const target = event.target as Element | null;
  const link = target?.closest<HTMLAnchorElement>('a[data-project-link]');
  if (!link) return;
  const id = link.dataset.projectLink;
  if (!id || !dialogs.has(id)) return;
  event.preventDefault();
  openProject(id, true, link);
}

function onDialogClose(event: Event) {
  if (syncingHistory || event.target !== active) return;
  if (idFromHash() && history.state?.[galleryStateKey]) {
    history.back();
    return;
  }
  active = null;
  document.body.classList.remove('project-dialog-open');
  window.scrollTo(0, savedScrollY);
  returnFocus?.focus({ preventScroll: true });
  if (!idFromHash()) return;
  history.replaceState(history.state, '', `${location.pathname}${location.search}`);
}

document.addEventListener('click', onClick, true);
dialogs.forEach((dialog) => dialog.addEventListener('close', onDialogClose));
window.addEventListener('hashchange', syncFromLocation);
syncFromLocation();
restoreOriginFromHistory();

(() => {
  const mobile = matchMedia('(max-width: 760px)');

  document.querySelectorAll('.atlas-topics, .topic-switcher, .evidence-topics').forEach((nav, index) => {
    const brand = nav.querySelector(':scope > .signals-home');
    const links = [...nav.querySelectorAll(':scope > a:not(.signals-home)')];
    if (!brand || links.length !== 10) return;

    const current = links.find((link) => link.getAttribute('aria-current') === 'location');
    const panel = document.createElement('div');
    const trigger = document.createElement('button');
    const label = document.createElement('span');
    const icon = document.createElement('span');
    const panelId = `signals-subject-panel-${index + 1}`;

    panel.id = panelId;
    panel.className = 'subject-menu__panel';
    panel.setAttribute('aria-hidden', String(mobile.matches));
    links.forEach((link) => panel.append(link));

    trigger.type = 'button';
    trigger.className = 'subject-menu__trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panelId);
    label.className = 'subject-menu__trigger-label';
    label.textContent = current?.textContent.trim() || 'Explore subjects';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '▾';
    trigger.append(label, icon);

    nav.classList.add('subject-menu');
    nav.append(trigger, panel);

    const sizePanel = () => {
      if (!mobile.matches) {
        panel.style.removeProperty('max-height');
        return;
      }
      panel.style.maxHeight = `${Math.max(44, innerHeight - nav.getBoundingClientRect().bottom - 24)}px`;
    };

    const close = (restoreFocus = false) => {
      trigger.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', String(mobile.matches));
      document.documentElement.classList.remove('subject-menu-open');
      if (restoreFocus) trigger.focus();
    };

    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      if (open) sizePanel();
      trigger.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      document.documentElement.classList.toggle('subject-menu-open', open);
    });
    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) close();
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target)) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') close(true);
    });
    mobile.addEventListener('change', () => close());
    addEventListener('resize', () => {
      if (trigger.getAttribute('aria-expanded') === 'true') sizePanel();
    });
  });

  document.documentElement.classList.add('subject-menu-ready');
})();

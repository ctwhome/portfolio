(() => {
  document.querySelectorAll('.subject-menu').forEach((nav, index) => {
    if (nav.dataset.subjectMenuEnhanced === 'true') return;

    const brand = nav.querySelector(':scope > .subject-menu__brand');
    const options = [...nav.children].filter((option) =>
      option.matches('.subject-menu__option')
    );
    if (!brand || options.length !== 10) return;

    nav.dataset.subjectMenuEnhanced = 'true';

    const current = options.find((option) => option.matches('a[aria-current="location"]'));
    const currentIcon = current?.querySelector('.subject-menu__icon');
    const currentClass = [...(current?.classList || [])].find((name) =>
      name.startsWith('subject-menu__option--')
    );
    const panel = document.createElement('div');
    const trigger = document.createElement('button');
    const label = document.createElement('span');
    const icon = document.createElement('span');
    const panelId = `signals-subject-panel-${index + 1}`;

    panel.id = panelId;
    panel.className = 'subject-menu__panel';
    panel.setAttribute('aria-hidden', 'true');
    options.forEach((option) => panel.append(option));

    trigger.type = 'button';
    trigger.className = 'subject-menu__trigger';
    if (currentClass) trigger.classList.add(currentClass);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panelId);
    label.className = 'subject-menu__trigger-label';
    label.textContent = current?.textContent.trim() || 'Explore subjects';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '▾';
    if (currentIcon) trigger.append(currentIcon.cloneNode(true));
    trigger.append(label, icon);

    nav.append(trigger, panel);

    const sizePanel = () => {
      panel.style.maxHeight = `${Math.max(44, innerHeight - nav.getBoundingClientRect().bottom - 24)}px`;
    };

    const close = (restoreFocus = false) => {
      trigger.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
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
    addEventListener('resize', () => {
      if (trigger.getAttribute('aria-expanded') === 'true') sizePanel();
    });
  });

  document.documentElement.classList.remove('subject-menu-pending');
  document.documentElement.classList.add('subject-menu-ready');
})();

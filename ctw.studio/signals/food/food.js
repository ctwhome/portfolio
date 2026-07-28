(() => {
  'use strict';

  const DATA_URL = '../data/food-system.json';

  const compact = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  });
  const integer = new Intl.NumberFormat('en');
  const dateFormat = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const node = byId(id);
    if (node) node.textContent = value;
  }

  function safeHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function formatDate(value) {
    const parsed = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? value : dateFormat.format(parsed);
  }

  function createTable(headers, rows) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headers.forEach((header) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = header;
      headRow.append(th);
    });
    thead.append(headRow);

    const tbody = document.createElement('tbody');
    rows.forEach((row) => {
      const tr = document.createElement('tr');
      row.forEach((value, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td');
        if (index === 0) cell.scope = 'row';
        cell.textContent = value;
        tr.append(cell);
      });
      tbody.append(tr);
    });
    table.append(thead, tbody);
    return table;
  }

  function renderSpecies(data) {
    const chart = byId('species-chart');
    const tableHost = byId('species-table');
    if (!chart || !tableHost) return;
    chart.replaceChildren();
    tableHost.replaceChildren();
    if (!Array.isArray(data) || !data.length) {
      chart.textContent = 'No species observations are available.';
      return;
    }

    const max = Math.max(...data.map((item) => item.daily));
    data.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'species-row';

      const label = document.createElement('span');
      label.className = 'species-name';
      label.textContent = item.name;

      const track = document.createElement('div');
      track.className = 'species-track';
      const bar = document.createElement('span');
      bar.className = 'species-bar';
      bar.style.setProperty('--bar-width', `${(item.daily / max) * 100}%`);
      bar.style.setProperty('--bar-delay', `${index * 55}ms`);
      track.append(bar);

      const value = document.createElement('strong');
      value.textContent = compact.format(item.daily);
      value.title = integer.format(item.daily);

      row.append(label, track, value);
      chart.append(row);
    });

    tableHost.append(createTable(
      ['Species', 'Annual count', 'Average per day'],
      data.map((item) => [item.name, integer.format(item.annual), integer.format(item.daily)])
    ));
  }

  function renderFootprints(data) {
    const chart = byId('footprint-chart');
    const tableHost = byId('footprint-table');
    if (!chart || !tableHost) return;
    chart.replaceChildren();
    tableHost.replaceChildren();
    if (!Array.isArray(data) || !data.length) {
      chart.textContent = 'No product-footprint observations are available.';
      return;
    }

    const max = Math.max(...data.map((item) => item.kgCO2ePerKgFood));
    data.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = `footprint-row ${index >= data.length - 2 ? 'plant-row' : ''}`;

      const label = document.createElement('span');
      label.className = 'footprint-name';
      label.textContent = item.product.replace(' (beef herd)', '');

      const track = document.createElement('div');
      track.className = 'footprint-track';
      const bar = document.createElement('span');
      bar.className = 'footprint-bar';
      bar.style.setProperty('--bar-width', `${(item.kgCO2ePerKgFood / max) * 100}%`);
      bar.style.setProperty('--bar-delay', `${index * 55}ms`);
      track.append(bar);

      const value = document.createElement('strong');
      value.textContent = item.kgCO2ePerKgFood.toFixed(1);

      row.append(label, track, value);
      chart.append(row);
    });

    tableHost.append(createTable(
      ['Food', 'kg CO₂e per kg food', 'Reference year'],
      data.map((item) => [item.product, item.kgCO2ePerKgFood.toFixed(2), String(item.year)])
    ));
  }

  function renderSources(sources) {
    const host = byId('food-source-list');
    if (!host) return;
    host.replaceChildren();

    sources.forEach((source, index) => {
      const item = document.createElement('article');
      item.className = 'source-item';
      item.id = `source-${source.id}`;

      const number = document.createElement('span');
      number.className = 'source-number';
      number.textContent = String(index + 1).padStart(2, '0');

      const body = document.createElement('div');
      const title = document.createElement('h3');
      const sourceUrl = safeHttpsUrl(source.url);
      const link = document.createElement(sourceUrl ? 'a' : 'span');
      if (sourceUrl) {
        link.href = sourceUrl;
        link.target = '_blank';
        link.rel = 'noreferrer';
      }
      link.textContent = sourceUrl ? source.title : `${source.title} — URL unavailable`;
      if (sourceUrl) {
        link.append(Object.assign(document.createElement('span'), {
          className: 'sr-only',
          textContent: ' (opens in a new tab)'
        }));
      }
      title.append(link);

      const meta = document.createElement('p');
      meta.className = 'source-meta';
      meta.textContent = `${source.publisher} · ${source.publicationDate}`;

      const role = document.createElement('p');
      role.className = 'source-role';
      role.textContent = source.role;

      const kind = document.createElement('span');
      kind.className = 'source-kind';
      kind.textContent = source.kind;

      body.append(title, meta, role, kind);
      item.append(number, body);
      host.append(item);
    });
  }

  function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    document.documentElement.classList.add('has-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    items.forEach((item) => observer.observe(item));
  }

  function setupStoryIndex() {
    const links = new Map(
      Array.from(document.querySelectorAll('[data-chapter]')).map((link) => [link.dataset.chapter, link])
    );
    const sections = document.querySelectorAll('[data-observe-chapter]');
    if (!links.size || !sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.remove('active'));
      links.get(visible.target.id)?.classList.add('active');
    }, { rootMargin: '-24% 0px -58% 0px', threshold: [0.01, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }

  function showDataError(error) {
    console.error('Could not load the food-system data:', error);
    document.querySelectorAll('.loading-message').forEach((node) => {
      node.textContent = 'The baked data could not be loaded. Source links remain available in the page markup and repository data file.';
    });
  }

  async function init() {
    setupReveal();
    setupStoryIndex();

    try {
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      setText('food-data-date', formatDate(data.meta.dataUpdated));
      setText('slaughter-year', data.slaughter.year);
      setText('hero-land-daily', compact.format(data.slaughter.dailyTracked));
      setText('daily-land-exact', integer.format(data.slaughter.dailyTracked));
      setText('per-minute-exact', integer.format(data.slaughter.perMinuteTracked));

      renderSpecies(data.slaughter.species);
      renderFootprints(data.productFootprints);
      renderSources(data.sources);
    } catch (error) {
      showDataError(error);
    }
  }

  init();
})();

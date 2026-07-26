(() => {
  'use strict';

  const DATA_URL = '../data/science.json';
  const LABELS = { WLD: 'World', NLD: 'Netherlands', USA: 'United States', KOR: 'Korea' };
  const byId = (id) => document.getElementById(id);

  function safeHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function createCell(value, header = false) {
    const cell = document.createElement(header ? 'th' : 'td');
    if (header) cell.scope = 'row';
    cell.textContent = value;
    return cell;
  }

  function renderSeries(data, key) {
    const series = data.series[key];
    const latest = Object.entries(series.latest);
    const max = Math.max(...latest.map(([, item]) => item.value));
    const title = byId('science-series-title');
    const bars = byId('science-bars');
    const table = byId('science-data-table');
    const citation = byId('science-series-citation');
    if (!series || !title || !bars || !table) return;

    title.textContent = `${series.label} · latest available`;
    bars.setAttribute(
      'aria-label',
      `${series.label}, latest available: ${latest.map(([code, item]) => `${LABELS[code]} ${item.value} ${series.unit} in ${item.year}`).join('; ')}`
    );
    bars.replaceChildren(...latest.map(([code, item]) => {
      const row = document.createElement('div');
      row.className = 'bar-row';
      const label = document.createElement('span');
      label.textContent = LABELS[code];
      const track = document.createElement('div');
      track.className = 'bar-row__track';
      const fill = document.createElement('i');
      fill.style.width = `${(item.value / max) * 100}%`;
      track.append(fill);
      const value = document.createElement('strong');
      value.textContent = key === 'rdIntensity'
        ? `${item.value.toFixed(2)}%`
        : new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(item.value);
      row.append(label, track, value);
      return row;
    }));

    table.querySelector('caption').textContent = `${series.label}, latest available observations`;
    table.querySelector('tbody').replaceChildren(...latest.map(([code, item]) => {
      const row = document.createElement('tr');
      row.append(
        createCell(LABELS[code], true),
        createCell(String(item.year)),
        createCell(String(item.value)),
        createCell(series.unit)
      );
      return row;
    }));
    if (citation) {
      const source = data.sources.find((item) => item.id === series.sourceId);
      const external = citation.querySelector('a[target="_blank"]');
      const ledger = citation.querySelector('a[href^="#source-"]');
      citation.dataset.citationSourceId = series.sourceId;
      citation.closest('.evidence-bearing').dataset.sourceId = series.sourceId;
      if (external && source) {
        external.textContent = `${source.institution}, ${source.title}, ${source.period} ↗`;
        external.href = safeHttpsUrl(source.url) || '#sources';
      }
      if (ledger) ledger.href = `#source-${series.sourceId}`;
    }
  }

  function renderSources(sources) {
    const host = byId('science-source-list');
    if (!host) return;
    host.replaceChildren(...sources.map((source) => {
      const article = document.createElement('article');
      article.id = `source-${source.id}`;
      const title = document.createElement('h3');
      title.textContent = source.title;
      const meta = document.createElement('p');
      meta.textContent = `${source.institution} · ${source.evidenceType} · ${source.date}`;
      const link = document.createElement('a');
      const url = safeHttpsUrl(source.url);
      link.textContent = url ? 'Open source ↗' : 'Invalid source URL';
      if (url) {
        link.href = url;
        link.target = '_blank';
        link.rel = 'noreferrer';
      }
      const details = document.createElement('dl');
      for (const [label, value] of [
        ['Scope', source.geographyPopulation],
        ['Period / unit', `${source.period} · ${source.denominatorUnit}`],
        ['Role', source.role],
        ['Interpretation', source.interpretation],
        ['Caveat', source.caveat]
      ]) {
        const group = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = label;
        dd.textContent = value;
        group.append(dt, dd);
        details.append(group);
      }
      article.append(title, meta, link, details);
      return article;
    }));
  }

  function setupSwitcher(data) {
    const buttons = [...document.querySelectorAll('[data-series]')];
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        renderSeries(data, button.dataset.series);
      });
    });
  }

  async function init() {
    const response = await fetch(DATA_URL, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Science data request failed: ${response.status}`);
    const data = await response.json();
    if (Math.round((data.aiPublications.observations.at(-1).count / data.aiPublications.observations.at(-2).count - 1) * 1000) / 10 !== 6.3) {
      throw new Error('Stanford 2024 publication growth no longer rounds to 6.3%');
    }
    byId('science-data-date').textContent = data.meta.dataUpdated;
    renderSeries(data, 'rdIntensity');
    renderSources(data.sources);
    setupSwitcher(data);
  }

  init().catch((error) => {
    console.error(error);
    document.documentElement.dataset.dataError = 'science';
  });
})();

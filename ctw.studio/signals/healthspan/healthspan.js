(() => {
  'use strict';

  const DATA_URL = '../data/healthspan.json';
  const LABELS = { WLD: 'World', NLD: 'Netherlands', JPN: 'Japan', USA: 'United States' };
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
    const title = byId('health-series-title');
    const bars = byId('health-bars');
    const table = byId('health-data-table');
    const citation = byId('health-series-citation');
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
      value.textContent = item.value.toFixed(2);
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
      const links = citation.querySelectorAll('a');
      citation.dataset.citationSourceId = series.sourceId;
      citation.closest('.evidence-bearing').dataset.sourceId = series.sourceId;
      if (source && links.length === 2) {
        links[0].href = safeHttpsUrl(source.url) || '#sources';
        links[0].textContent = `${source.institution}, ${source.title}, ${source.period} ↗`;
        links[1].href = `#source-${series.sourceId}`;
      }
    }
  }

  function renderHealthyYears(data) {
    const bars = byId('health-years-bars');
    const table = byId('health-years-table');
    if (!bars || !table) return;
    const observations = data.healthyLifeYears.observations;
    const rows = observations.flatMap((item) => [
      { label: `${item.geography === 'NL' ? 'NL' : 'EU'} lifespan`, value: item.lifeExpectancyYears },
      { label: `${item.geography === 'NL' ? 'NL' : 'EU'} healthy`, value: item.healthyLifeYears }
    ]);
    const max = Math.max(...rows.map((item) => item.value));
    bars.replaceChildren(...rows.map((item) => {
      const row = document.createElement('div');
      row.className = 'bar-row';
      const label = document.createElement('span');
      label.textContent = item.label;
      const track = document.createElement('div');
      track.className = 'bar-row__track';
      const fill = document.createElement('i');
      fill.style.width = `${(item.value / max) * 100}%`;
      track.append(fill);
      const value = document.createElement('strong');
      value.textContent = item.value.toFixed(1);
      row.append(label, track, value);
      return row;
    }));
    table.querySelector('tbody').replaceChildren(...observations.map((item) => {
      const row = document.createElement('tr');
      row.append(
        createCell(item.label, true),
        createCell(`${item.lifeExpectancyYears.toFixed(1)} years`),
        createCell(`${item.healthyLifeYears.toFixed(1)} years`),
        createCell(`${item.yearsWithActivityLimitation.toFixed(1)} years`)
      );
      return row;
    }));
  }

  function renderSources(sources) {
    const host = byId('health-source-list');
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
    if (!response.ok) throw new Error(`Healthspan data request failed: ${response.status}`);
    const data = await response.json();
    byId('health-data-date').textContent = data.meta.dataUpdated;
    renderSeries(data, 'lifeExpectancy');
    renderHealthyYears(data);
    renderSources(data.sources);
    setupSwitcher(data);
  }

  init().catch((error) => {
    console.error(error);
    document.documentElement.dataset.dataError = 'healthspan';
  });
})();

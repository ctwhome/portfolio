(() => {
  'use strict';

  const DATA_URL = '../data/education.json';
  const DOMAIN_LABELS = {
    mathematics: 'Mathematics',
    reading: 'Reading',
    science: 'Science'
  };
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

  function renderTrajectory(data, domain) {
    const trajectory = data.foundationalTrajectory;
    const title = byId('trajectory-title');
    const chart = byId('trajectory-chart');
    const table = byId('trajectory-table');
    if (!trajectory || !title || !chart || !table || !DOMAIN_LABELS[domain]) return;

    const observations = trajectory.cycles.map((item) => ({
      cycle: item.cycle,
      value: item[domain]
    }));
    const values = observations.map((item) => item.value);
    const min = Math.min(...values) - 8;
    const max = Math.max(...values) + 8;
    const x = (index) => 55 + (625 * index) / (observations.length - 1);
    const y = (value) => 210 - ((value - min) / (max - min)) * 180;
    const points = observations.map((item, index) => `${x(index)},${y(item.value)}`).join(' ');

    title.textContent = `Netherlands · ${domain} · age 15`;
    chart.querySelector('title').textContent =
      `Netherlands PISA ${domain} scores, 2012 to 2022`;
    chart.querySelector('desc').textContent = observations
      .map((item) => `${item.cycle}: ${item.value}`)
      .join('; ');
    chart.querySelector('polyline').setAttribute('points', points);

    const circleGroup = chart.querySelector('g');
    circleGroup.replaceChildren(...observations.map((item, index) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(x(index)));
      circle.setAttribute('cy', String(y(item.value)));
      circle.setAttribute('r', '6');
      return circle;
    }));

    const labelGroup = chart.querySelector('.chart-labels');
    labelGroup.replaceChildren(...observations.flatMap((item, index) => {
      const year = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      year.setAttribute('x', String(x(index) - 13));
      year.setAttribute('y', '238');
      year.textContent = String(item.cycle);
      const value = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      value.setAttribute('x', String(x(index) - 13));
      value.setAttribute('y', String(y(item.value) - 10));
      value.textContent = String(item.value);
      return [year, value];
    }));

    table.querySelector('caption').textContent =
      `Netherlands PISA ${domain} mean score, 15-year-old students`;
    table.querySelector('tbody').replaceChildren(...observations.map((item) => {
      const row = document.createElement('tr');
      row.append(
        createCell(String(item.cycle), true),
        createCell(trajectory.framework),
        createCell('15'),
        createCell(DOMAIN_LABELS[domain]),
        createCell(String(item.value))
      );
      return row;
    }));
  }

  function renderOfficialSeries(data, key) {
    const series = data.officialSeries[key];
    const title = byId('official-series-title');
    const bars = byId('official-series-bars');
    const table = byId('official-series-table');
    const caveat = byId('official-series-caveat');
    const citation = byId('official-series-citation');
    if (!series || !title || !bars || !table || !caveat || !citation) return;

    const observations = series.observations;
    const displayed = observations.filter((_, index) =>
      index === 0 || index === observations.length - 1 || index % 2 === 0
    );
    const max = Math.max(...displayed.map((item) => item.value));
    const decimals = 1;
    title.textContent = `${series.label} · ${series.geography}`;
    bars.setAttribute(
      'aria-label',
      displayed.map((item) => `${item.year}: ${item.value} ${series.unit}`).join('; ')
    );
    bars.replaceChildren(...displayed.map((item) => {
      const row = document.createElement('div');
      row.className = 'bar-row';
      const label = document.createElement('span');
      label.textContent = String(item.year);
      const track = document.createElement('div');
      track.className = 'bar-row__track';
      const fill = document.createElement('i');
      fill.style.width = `${(item.value / max) * 100}%`;
      track.append(fill);
      const value = document.createElement('strong');
      value.textContent = item.value.toFixed(decimals);
      row.append(label, track, value);
      return row;
    }));

    table.querySelector('caption').textContent =
      `${series.geography} ${series.label.toLowerCase()}, selected annual observations`;
    table.querySelector('tbody').replaceChildren(...observations.map((item) => {
      const row = document.createElement('tr');
      row.append(
        createCell(String(item.year), true),
        createCell(String(item.value)),
        createCell(series.unit),
        createCell(series.evidenceCategory)
      );
      return row;
    }));
    caveat.replaceChildren();
    const boundary = document.createElement('strong');
    boundary.textContent = 'Definition: ';
    caveat.append(boundary, `${series.definition} ${series.caveat}`);

    const source = data.sources.find((item) => item.id === series.sourceId);
    const links = citation.querySelectorAll('a');
    citation.dataset.citationSourceId = series.sourceId;
    citation.closest('.evidence-bearing').dataset.sourceId = series.sourceId;
    if (source && links.length === 2) {
      links[0].href = safeHttpsUrl(source.url) || '#sources';
      links[0].textContent = `${source.institution}, ${series.id} ↗`;
      links[1].href = `#source-${series.sourceId}`;
    }
  }

  function renderSources(sources) {
    const host = byId('education-source-list');
    if (!host) return;
    host.replaceChildren(...sources.map((source) => {
      const article = document.createElement('article');
      article.id = `source-${source.id}`;
      const title = document.createElement('h3');
      title.textContent = source.title;
      const meta = document.createElement('p');
      meta.textContent =
        `${source.institution} · ${source.evidenceType} · ${source.date}`;
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
        ['Release', source.release],
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

  function setupSwitchers(data) {
    const domainButtons = [...document.querySelectorAll('[data-domain]')];
    domainButtons.forEach((button) => {
      button.addEventListener('click', () => {
        domainButtons.forEach((item) =>
          item.setAttribute('aria-pressed', String(item === button))
        );
        renderTrajectory(data, button.dataset.domain);
      });
    });

    const officialButtons = [...document.querySelectorAll('[data-official-series]')];
    officialButtons.forEach((button) => {
      button.addEventListener('click', () => {
        officialButtons.forEach((item) =>
          item.setAttribute('aria-pressed', String(item === button))
        );
        renderOfficialSeries(data, button.dataset.officialSeries);
      });
    });
  }

  async function init() {
    const response = await fetch(DATA_URL, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      throw new Error(`Education data request failed: ${response.status}`);
    }
    const data = await response.json();
    byId('education-data-date').textContent = data.meta.dataUpdated;
    renderTrajectory(data, 'mathematics');
    renderOfficialSeries(data, 'primaryGrossEnrollment');
    renderSources(data.sources);
    setupSwitchers(data);
  }

  init().catch((error) => {
    console.error(error);
    document.documentElement.dataset.dataError = 'education';
  });
})();

const DATA_URL = '../data/financial-fragility.json';
const NS = 'http://www.w3.org/2000/svg';

document.documentElement.classList.add('js');

function text(value) {
  return value === null || value === undefined ? '—' : String(value);
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '#';
  } catch {
    return '#';
  }
}

function formatNumber(value, digits = 1) {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

function el(name, attributes = {}, content = '') {
  const node = document.createElement(name);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') node.className = value;
    else node.setAttribute(key, value);
  });
  if (content) node.textContent = content;
  return node;
}

function svgEl(name, attributes = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function latest(series) {
  return series.latest || series.observations.at(-1);
}

function renderHero(data) {
  document.querySelector('#data-date').textContent = data.meta.editorialReview;
  document.querySelector('#verdict-text').textContent = data.verdict.text;
  const credit = latest(data.series.householdCredit);
  const service = latest(data.series.householdDebtService);
  const rate = latest(data.series.newMortgageRate);
  document.querySelector('#hero-credit').textContent = `${formatNumber(credit.value)}%`;
  document.querySelector('#hero-dsr').textContent = `${formatNumber(service.value)}%`;
  document.querySelector('#hero-rate').textContent = `${formatNumber(rate.value, 2)}%`;
}

function renderBalanceSheets(items) {
  const grid = document.querySelector('#balance-sheet-grid');
  grid.replaceChildren();
  items.forEach((item) => {
    const card = el('article', {'data-dimension': item.id});
    card.append(
      el('p', {}, item.id[0].toUpperCase() + item.id.slice(1)),
      el('strong', {}, item.headline),
      el('span', {}, item.unit),
      el('small', {}, `${item.geography} · ${item.period}`)
    );
    const details = el('details');
    details.append(
      el('summary', {}, 'Interpretation and boundary'),
      el('p', {}, item.interpretation),
      el('p', {className: 'boundary-inline'}, item.caveat)
    );
    card.append(details);
    grid.append(card);
  });
}

function selectedObservations(observations) {
  if (observations.length <= 12) return observations;
  const indexes = new Set([
    0,
    Math.round((observations.length - 1) * 0.25),
    Math.round((observations.length - 1) * 0.5),
    Math.round((observations.length - 1) * 0.75),
    observations.length - 1
  ]);
  return observations.filter((_, index) => indexes.has(index));
}

function renderSeriesTable(key, series) {
  const table = document.querySelector(`#table-${key}`);
  if (!table) return;
  const body = table.querySelector('tbody');
  body.replaceChildren();
  selectedObservations(series.observations).forEach((observation) => {
    const row = el('tr');
    row.append(
      el('td', {}, observation.period),
      el('td', {}, `${formatNumber(observation.value, key === 'newMortgageRate' ? 2 : 1)}%`)
    );
    body.append(row);
  });
}

function drawLineChart(key, series, colour = '#c8ff6b') {
  const svg = document.querySelector(`#chart-${key}`);
  if (!svg) return;
  svg.querySelectorAll(':scope > :not(title):not(desc)').forEach((node) => node.remove());

  const observations = series.observations;
  const values = observations.map((item) => item.value);
  const width = 760;
  const height = 280;
  const margin = {top: 24, right: 24, bottom: 42, left: 58};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  let min = Math.min(...values);
  let max = Math.max(...values);
  const padding = Math.max((max - min) * 0.15, 0.5);
  min = Math.max(0, min - padding);
  max += padding;
  const x = (index) => margin.left + index / Math.max(1, observations.length - 1) * innerWidth;
  const y = (value) => margin.top + (max - value) / Math.max(0.01, max - min) * innerHeight;

  for (let step = 0; step <= 4; step += 1) {
    const value = min + (max - min) * step / 4;
    const ypos = y(value);
    svg.append(svgEl('line', {
      x1: margin.left, y1: ypos, x2: width - margin.right, y2: ypos,
      class: 'chart-gridline'
    }));
    const label = svgEl('text', {
      x: margin.left - 10, y: ypos + 4, 'text-anchor': 'end', class: 'chart-label'
    });
    label.textContent = formatNumber(value, key === 'newMortgageRate' ? 1 : 0);
    svg.append(label);
  }

  const path = observations.map((item, index) => (
    `${index === 0 ? 'M' : 'L'}${x(index).toFixed(2)},${y(item.value).toFixed(2)}`
  )).join(' ');
  svg.append(svgEl('path', {d: path, class: 'chart-line', stroke: colour}));

  const area = `${path} L${x(observations.length - 1)},${margin.top + innerHeight} ` +
    `L${x(0)},${margin.top + innerHeight} Z`;
  svg.insertBefore(svgEl('path', {d: area, class: 'chart-area', fill: colour}), svg.querySelector('.chart-line'));

  [0, observations.length - 1].forEach((index) => {
    const point = observations[index];
    svg.append(svgEl('circle', {
      cx: x(index), cy: y(point.value), r: 4, class: 'chart-point', fill: colour
    }));
    const label = svgEl('text', {
      x: x(index),
      y: height - 15,
      'text-anchor': index === 0 ? 'start' : 'end',
      class: 'chart-period'
    });
    label.textContent = point.period;
    svg.append(label);
  });
}

function renderSeries(data) {
  const colours = {
    householdCredit: '#c8ff6b',
    householdDebtService: '#ffb45e',
    newMortgageRate: '#7ddcff'
  };
  Object.entries(data.series).forEach(([key, series]) => {
    if (!document.querySelector(`#chart-${key}`)) return;
    drawLineChart(key, series, colours[key]);
    renderSeriesTable(key, series);
    const card = document.querySelector(`[data-series-panel="${key}"]`);
    const current = latest(series);
    const headline = card?.querySelector('.figure-head > strong');
    if (headline) {
      const decimals = key === 'newMortgageRate' ? 2 : 1;
      headline.replaceChildren(document.createTextNode(`${formatNumber(current.value, decimals)}% `));
      headline.append(el('small', {}, key === 'householdCredit' ? 'of GDP' : key === 'householdDebtService' ? 'of income' : 'per year'));
    }
  });

  const saving = latest(data.series.householdSaving);
  document.querySelector('#saving-latest').textContent = `${formatNumber(saving.value)}%`;
}

function setupTabs() {
  const tabs = [...document.querySelectorAll('[data-series-tab]')];
  const panels = [...document.querySelectorAll('[data-series-panel]')];
  const activate = (key) => {
    tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.seriesTab === key)));
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.seriesPanel !== key;
    });
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => activate(tab.dataset.seriesTab)));
  activate(tabs[0]?.dataset.seriesTab || 'householdCredit');
}

function renderDistribution(items) {
  const body = document.querySelector('#distribution-table tbody');
  body.replaceChildren();
  items.forEach((item) => {
    const row = el('tr');
    row.append(
      el('th', {scope: 'row'}, item.group),
      el('td', {}, item.exposure),
      el('td', {}, item.shockChannel),
      el('td', {}, `${item.evidence} ${item.boundary}`)
    );
    body.append(row);
  });
}

function renderGovernment(series) {
  const current = latest(series);
  document.querySelector('#interest-gdp').textContent = `${formatNumber(current.interestToGdpPct)}%`;
  document.querySelector('#interest-revenue').textContent = `${formatNumber(current.interestToRevenuePct)}%`;
  const body = document.querySelector('#government-table tbody');
  body.replaceChildren();
  selectedObservations(series.observations).forEach((item) => {
    const row = el('tr');
    row.append(
      el('td', {}, item.period),
      el('td', {}, new Intl.NumberFormat('en-GB').format(item.interestMioEur)),
      el('td', {}, `${formatNumber(item.interestToGdpPct)}%`),
      el('td', {}, new Intl.NumberFormat('en-GB').format(item.revenueMioEur)),
      el('td', {}, `${formatNumber(item.interestToRevenuePct)}%`)
    );
    body.append(row);
  });
}

function renderExplanations(items) {
  const grid = document.querySelector('#explanation-grid');
  grid.replaceChildren();
  items.forEach((item) => {
    const card = el('article');
    card.append(
      el('span', {}, item.evidenceType),
      el('h3', {}, item.label),
      el('p', {}, item.text),
      el('small', {}, `Test: ${item.test}`)
    );
    grid.append(card);
  });
}

function renderReversals(items) {
  const list = document.querySelector('#reversal-list');
  list.replaceChildren();
  items.forEach((item, index) => {
    const entry = el('li');
    const copy = el('div');
    copy.append(el('h3', {}, item.label), el('p', {}, item.threshold), el('small', {}, item.meaning));
    entry.append(el('span', {}, String(index + 1).padStart(2, '0')), copy);
    list.append(entry);
  });
}

function renderSources(sources) {
  const ledger = document.querySelector('#source-ledger');
  ledger.replaceChildren();
  sources.forEach((source) => {
    const article = el('article', {id: `source-${source.id}`});
    const head = el('div', {className: 'source-head'});
    const heading = el('h3');
    const link = el('a', {
      href: safeHttpsUrl(source.url),
      target: '_blank',
      rel: 'noreferrer'
    }, source.title);
    heading.append(link);
    head.append(el('span', {}, source.institution), heading, el('code', {}, source.seriesTableId));
    const fields = el('dl');
    [
      ['Scope', source.geographyPopulation],
      ['Period', source.period],
      ['Denominator / unit', source.denominatorUnit],
      ['Evidence type', source.evidenceType],
      ['Method', source.methodology],
      ['Transformation', source.transformation],
      ['Vintage / retrieval', source.vintageRetrieved],
      ['Revision policy', source.revisionPolicy],
      ['Interpretation', source.interpretation],
      ['Caveat', source.caveat]
    ].forEach(([label, value]) => {
      const wrapper = el('div');
      wrapper.append(el('dt', {}, label), el('dd', {}, text(value)));
      fields.append(wrapper);
    });
    article.append(head, fields);
    ledger.append(article);
  });
}

function validateSourceResolution(data) {
  const ids = new Set(data.sources.map((source) => source.id));
  document.querySelectorAll('[data-source-id]').forEach((node) => {
    const unresolved = node.dataset.sourceId.split(/\s+/).filter((id) => !ids.has(id));
    if (unresolved.length) throw new Error(`Unresolved source IDs: ${unresolved.join(', ')}`);
  });
}

async function initialise() {
  try {
    const response = await fetch(DATA_URL, {cache: 'no-store'});
    if (!response.ok) throw new Error(`Data request failed: ${response.status}`);
    const data = await response.json();
    validateSourceResolution(data);
    renderHero(data);
    renderBalanceSheets(data.balanceSheets);
    renderSeries(data);
    renderDistribution(data.householdDistribution);
    renderGovernment(data.series.governmentInterest);
    renderExplanations(data.explanations);
    renderReversals(data.reversalIndicators);
    renderSources(data.sources);
    setupTabs();
  } catch (error) {
    console.error('Financial fragility data could not be enhanced.', error);
    document.documentElement.classList.remove('js');
  }
}

initialise();

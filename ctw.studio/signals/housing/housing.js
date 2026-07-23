(() => {
  'use strict';

  const DATA_URL = '../data/housing.json';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const COLORS = {
    housePrice: '#ffb15c',
    rentPrice: '#79c7ff',
    priceToIncome: '#f16f82',
    priceToRent: '#b9a0ff',
    grid: 'rgba(255,255,255,.12)',
    muted: '#8f938c',
    paper: '#f2f0e8'
  };

  const integer = new Intl.NumberFormat('en');
  const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
  const currency = new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const dateFormat = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

  const byId = (id) => document.getElementById(id);

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

  function periodNumber(value) {
    if (value.includes('-Q')) {
      const [year, quarter] = value.split('-Q').map(Number);
      return year + (quarter - 1) / 4;
    }
    const [year, month = 1] = value.split('-').map(Number);
    return year + (month - 1) / 12;
  }

  function svg(name, attributes = {}, text = '') {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text) node.textContent = text;
    return node;
  }

  function createTable(captionText, headers, rows) {
    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = captionText;
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
    table.append(caption, thead, tbody);
    return table;
  }

  function hydrateHeadline(data) {
    const priceIncome = data.netherlands.oecd.priceToIncome.latest;
    const marketRenter = data.netherlands.overburden.byTenure.find((item) => item.code === 'RENT_MKT');
    const mortgage = data.netherlands.ecbMortgage.latest;
    const home = data.netherlands.cbs.existingHomes.latest;

    setText('housing-data-date', formatDate(data.meta.dataUpdated));
    setText('housing-verdict', data.meta.verdict);
    setText('hero-price-income', `${priceIncome.value.toFixed(1)}`);
    setText('hero-renter-burden', `${marketRenter.value.toFixed(1)}%`);
    setText('hero-mortgage-rate', `${mortgage.value.toFixed(1)}%`);
    setText('world-slum-share', `${data.world.slumShare.value.toFixed(1)}%`);
    setText('world-derived-people', `≈${integer.format(data.world.estimatedPeople.valueMillions)}M`);
    setText('nl-price-yoy', `${home.yearOnYearPct > 0 ? '+' : ''}${home.yearOnYearPct.toFixed(1)}%`);
    setText('nl-price-period', `${home.period} · quality-adjusted index`);
    setText('nl-average-price', currency.format(home.averagePurchasePriceEur));
    setText('nl-price-income', priceIncome.value.toFixed(1));
    setText('nl-overburden-total', `${data.netherlands.overburden.totalPct.toFixed(1)}%`);
    setText('current-conclusion', data.interpretation.currentConclusion);
  }

  function setupLenses() {
    const tabs = [...document.querySelectorAll('[role="tab"][data-lens]')];
    const panels = [...document.querySelectorAll('[data-lens-panel]')];
    if (!tabs.length || !panels.length) return;

    function activate(id, focus = false) {
      tabs.forEach((tab) => {
        const selected = tab.dataset.lens === id;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && focus) tab.focus();
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.lensPanel !== id;
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset.lens));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        activate(tabs[next].dataset.lens, true);
      });
    });
    activate('world');
  }

  function renderComparison(data) {
    setText('comparison-period', data.comparisons.period);
    const host = byId('country-comparison');
    if (!host) return;
    const countries = data.comparisons.countries;
    const max = Math.max(...countries.map((item) => item.value), 150);
    host.replaceChildren(...countries.map((item) => {
      const row = document.createElement('div');
      row.className = `country-row${item.code === 'NLD' ? ' country-row--primary' : ''}`;
      row.title = item.whyIncluded;
      const label = document.createElement('span');
      label.textContent = item.name;
      const track = document.createElement('div');
      const baseline = document.createElement('i');
      baseline.className = 'country-baseline';
      baseline.style.left = `${(100 / max) * 100}%`;
      const bar = document.createElement('b');
      bar.style.width = `${(item.value / max) * 100}%`;
      track.append(bar, baseline);
      const value = document.createElement('strong');
      value.textContent = item.value.toFixed(1);
      row.append(label, track, value);
      return row;
    }));
  }

  function renderAffordabilityChart(data) {
    const chart = byId('affordability-chart');
    const legend = byId('affordability-legend');
    const tableHost = byId('housing-price-table');
    if (!chart || !legend || !tableHost) return;

    const seriesKeys = ['housePrice', 'rentPrice', 'priceToIncome', 'priceToRent'];
    const series = seriesKeys.map((key) => ({ key, ...data.netherlands.oecd[key] }));
    const all = series.flatMap((item) => item.observations);
    const xMin = Math.min(...all.map((item) => periodNumber(item.period)));
    const xMax = Math.max(...all.map((item) => periodNumber(item.period)));
    const yMin = 70;
    const yMax = Math.ceil(Math.max(...all.map((item) => item.value)) / 20) * 20;
    const width = 840;
    const height = 410;
    const margin = { top: 30, right: 30, bottom: 55, left: 58 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const x = (period) => margin.left + ((periodNumber(period) - xMin) / (xMax - xMin)) * innerWidth;
    const y = (value) => margin.top + ((yMax - value) / (yMax - yMin)) * innerHeight;

    chart.replaceChildren(
      svg('title', { id: 'affordability-title' }, 'Dutch housing indices since 2010'),
      svg('desc', { id: 'affordability-desc' }, 'House prices, rents, price-to-income and price-to-rent indices, where 2015 equals 100.')
    );

    for (let value = 80; value <= yMax; value += 20) {
      chart.append(
        svg('line', { x1: margin.left, x2: width - margin.right, y1: y(value), y2: y(value), class: 'housing-grid-line' }),
        svg('text', { x: margin.left - 10, y: y(value) + 4, 'text-anchor': 'end', class: 'housing-axis-label' }, String(value))
      );
    }
    for (let year = Math.ceil(xMin); year <= Math.floor(xMax); year += 2) {
      const px = margin.left + ((year - xMin) / (xMax - xMin)) * innerWidth;
      chart.append(svg('text', { x: px, y: height - 20, 'text-anchor': 'middle', class: 'housing-axis-label' }, String(year)));
    }
    chart.append(svg('line', { x1: margin.left, x2: width - margin.right, y1: y(100), y2: y(100), class: 'housing-baseline-line' }));
    chart.append(svg('text', { x: width - margin.right, y: y(100) - 7, 'text-anchor': 'end', class: 'housing-baseline-label' }, '2015 baseline'));

    series.forEach((item) => {
      const points = item.observations.map((observation) => `${x(observation.period)},${y(observation.value)}`).join(' L ');
      chart.append(svg('path', { d: `M ${points}`, class: `housing-series housing-series--${item.key}` }));
      const latest = item.latest;
      chart.append(svg('circle', { cx: x(latest.period), cy: y(latest.value), r: 4, class: `housing-dot housing-dot--${item.key}` }));
    });

    legend.replaceChildren(...series.map((item) => {
      const label = document.createElement('span');
      const swatch = document.createElement('i');
      swatch.style.background = COLORS[item.key];
      label.append(swatch, item.label);
      return label;
    }));

    const maps = Object.fromEntries(series.map((item) => [item.key, new Map(item.observations.map((row) => [row.period, row.value]))]));
    const commonPeriods = series[0].observations.map((row) => row.period).filter((period) => series.every((item) => maps[item.key].has(period)));
    const annualRows = commonPeriods
      .filter((period) => period.endsWith('-Q4'))
      .reverse()
      .map((period) => [period, ...seriesKeys.map((key) => maps[key].get(period).toFixed(1))]);
    tableHost.replaceChildren(createTable(
      'Dutch housing indicators, fourth quarter values (2015=100)',
      ['Period', 'House prices', 'Rents', 'Price / income', 'Price / rent'],
      annualRows
    ));
  }

  function renderMortgage(data) {
    const rate = data.netherlands.ecbMortgage;
    setText('mortgage-current', `${rate.latest.value.toFixed(1)}%`);
    setText('mortgage-context', `The series low was ${rate.lowSince2015.value.toFixed(1)}% in ${rate.lowSince2015.period}; the latest observation is ${rate.latest.period}.`);
    const marker = byId('mortgage-rate-marker');
    if (marker) marker.style.left = `${Math.min(100, (rate.latest.value / 5) * 100)}%`;
  }

  function renderSupplyChart(data) {
    const host = byId('supply-chart');
    const tableHost = byId('supply-table');
    if (!host || !tableHost) return;
    const rows = data.netherlands.supplyVsHouseholds;
    const max = Math.max(...rows.flatMap((row) => [row.netHousingAddition, row.householdGrowth]));
    host.replaceChildren(...rows.map((item) => {
      const group = document.createElement('div');
      group.className = 'supply-year';
      const bars = document.createElement('div');
      bars.className = 'supply-bars';
      const stock = document.createElement('i');
      stock.className = 'supply-bar supply-bar--stock';
      stock.style.height = `${(item.netHousingAddition / max) * 100}%`;
      stock.title = `Net housing addition: ${integer.format(item.netHousingAddition)}`;
      const households = document.createElement('i');
      households.className = 'supply-bar supply-bar--households';
      households.style.height = `${(item.householdGrowth / max) * 100}%`;
      households.title = `Household growth: ${integer.format(item.householdGrowth)}`;
      bars.append(stock, households);
      const year = document.createElement('span');
      year.textContent = item.year;
      group.append(bars, year);
      return group;
    }));
    tableHost.replaceChildren(createTable(
      'Dutch dwelling-stock additions and private-household growth',
      ['Year', 'New construction', 'Net stock addition', 'Household growth'],
      [...rows].reverse().map((row) => [
        String(row.year),
        integer.format(row.newConstruction),
        integer.format(row.netHousingAddition),
        integer.format(row.householdGrowth)
      ])
    ));
  }

  function renderDistribution(data) {
    const burden = data.netherlands.overburden;
    setText('burden-period', burden.period);
    const host = byId('overburden-chart');
    if (host) {
      const max = 45;
      host.replaceChildren(...burden.byTenure.map((item) => {
        const row = document.createElement('div');
        const label = document.createElement('span');
        label.textContent = item.tenure;
        const track = document.createElement('div');
        const bar = document.createElement('i');
        bar.style.width = `${(item.value / max) * 100}%`;
        track.append(bar);
        const value = document.createElement('strong');
        value.textContent = `${item.value.toFixed(1)}%`;
        row.append(label, track, value);
        return row;
      }));
    }

    const shares = data.netherlands.tenure.shares.NL;
    setText('tenure-own', `${shares.OWN.toFixed(1)}%`);
    setText('tenure-market', `${shares.RENT_MKT.toFixed(1)}%`);
    setText('tenure-reduced', `${shares.RENT_FR.toFixed(1)}%`);
    const stack = byId('tenure-stack');
    if (stack) {
      const labels = [
        ['OWN', 'Owner'],
        ['RENT_MKT', 'Market rent'],
        ['RENT_FR', 'Reduced rent']
      ];
      stack.replaceChildren(...labels.map(([key, label]) => {
        const segment = document.createElement('i');
        segment.className = `tenure-segment tenure-segment--${key.toLowerCase()}`;
        segment.style.width = `${shares[key]}%`;
        segment.title = `${label}: ${shares[key].toFixed(1)}%`;
        return segment;
      }));
    }
  }

  function renderInterpretation(data) {
    const explanationHost = byId('explanation-grid');
    if (explanationHost) {
      explanationHost.replaceChildren(...data.interpretation.competingExplanations.map((item, index) => {
        const card = document.createElement('article');
        const number = document.createElement('span');
        number.textContent = String(index + 1).padStart(2, '0');
        const title = document.createElement('h3');
        title.textContent = item.title;
        const text = document.createElement('p');
        text.textContent = item.text;
        card.append(number, title, text);
        return card;
      }));
    }

    const changeHost = byId('change-list');
    if (changeHost) {
      changeHost.replaceChildren(...data.interpretation.changeEvidence.map((text, index) => {
        const item = document.createElement('li');
        const number = document.createElement('span');
        number.textContent = String(index + 1).padStart(2, '0');
        const body = document.createElement('p');
        body.textContent = text;
        item.append(number, body);
        return item;
      }));
    }

    const possibilityHost = byId('possibility-grid');
    if (possibilityHost) {
      possibilityHost.replaceChildren(...data.interpretation.possibilities.map((item) => {
        const card = document.createElement('article');
        const label = document.createElement('span');
        label.textContent = item.label;
        const title = document.createElement('h3');
        title.textContent = item.title;
        const text = document.createElement('p');
        text.textContent = item.text;
        card.append(label, title, text);
        return card;
      }));
    }
  }

  function renderSources(data) {
    setText('housing-source-count', `${data.sources.length} sources`);
    const host = byId('housing-source-list');
    if (!host) return;
    host.replaceChildren(...data.sources.map((source, index) => {
      const item = document.createElement('article');
      const number = document.createElement('span');
      number.className = 'source-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const body = document.createElement('div');
      const sourceUrl = safeHttpsUrl(source.url);
      const title = document.createElement(sourceUrl ? 'a' : 'span');
      if (sourceUrl) {
        title.href = sourceUrl;
        title.target = '_blank';
        title.rel = 'noreferrer';
      }
      title.textContent = sourceUrl ? `${source.title} ↗` : `${source.title} — URL unavailable`;
      const meta = document.createElement('p');
      meta.textContent = `${source.publisher} · accessed ${source.accessed}`;
      const role = document.createElement('p');
      role.textContent = source.role;
      const kind = document.createElement('span');
      kind.className = 'source-kind';
      kind.textContent = source.kind;
      body.append(title, meta, role, kind);
      item.append(number, body);
      return item;
    }));
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
    }, { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });
    items.forEach((item) => observer.observe(item));
  }

  function setupStoryIndex() {
    const links = new Map([...document.querySelectorAll('.housing-index a')].map((link) => [link.hash.slice(1), link]));
    const sections = document.querySelectorAll('[data-observe-chapter]');
    if (!links.size || !sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.remove('active'));
      links.get(visible.target.id)?.classList.add('active');
    }, { threshold: [0.01, 0.25], rootMargin: '-20% 0px -62% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  function showError(error) {
    console.error('Could not initialize Housing & affordability', error);
    setText('housing-data-date', 'Data unavailable');
    setText('housing-verdict', 'The baked data could not be loaded. The source ledger and method remain available below.');
  }

  async function init() {
    setupLenses();
    setupReveal();
    setupStoryIndex();
    try {
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Housing data request failed with ${response.status}`);
      const data = await response.json();
      hydrateHeadline(data);
      renderComparison(data);
      renderAffordabilityChart(data);
      renderMortgage(data);
      renderSupplyChart(data);
      renderDistribution(data);
      renderInterpretation(data);
      renderSources(data);
    } catch (error) {
      showError(error);
    }
  }

  init();
})();

(() => {
  'use strict';

  const DATA_URL = 'data/ai-jobs.json';
  const COLORS = {
    observed: '#57d7ff',
    observedFill: 'rgba(87, 215, 255, 0.12)',
    exposure: '#f7b500',
    high: '#ff6b5f',
    experiment: '#a58bff',
    forecast: '#53d38b',
    grid: 'rgba(255,255,255,0.11)',
    muted: '#8b8a84',
    paper: '#f4f1e8'
  };

  let dashboardData = null;
  let activeSeries = 'openings';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const svgNS = 'http://www.w3.org/2000/svg';

  function getSource(id) {
    return dashboardData.sources.find((source) => source.id === id);
  }

  function safeHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function monthIndex(value) {
    const [year, month] = value.slice(0, 7).split('-').map(Number);
    return year * 12 + month - 1;
  }

  function formatMonth(value) {
    const date = new Date(`${value.slice(0, 7)}-01T00:00:00Z`);
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
  }

  function formatValue(value, unit) {
    if (unit === 'million') return `${Number(value).toFixed(value < 10 ? 2 : 1)}M`;
    if (unit === 'percent') return `${Number(value).toFixed(1)}%`;
    return String(value);
  }

  function signed(value, suffix = '%') {
    const number = Number(value);
    return `${number > 0 ? '+' : ''}${number.toFixed(1)}${suffix}`;
  }

  function setText(selector, text) {
    const element = $(selector);
    if (element) element.textContent = text;
  }

  function hydrateHeadline() {
    const { headline, meta, evidence } = dashboardData;
    setText('#data-as-of', `Official series refreshed ${formatMonth(meta.seriesUpdated)} · research reviewed ${formatMonth(meta.updated)}`);
    setText('#openings-latest', formatValue(headline.openingsLatest.value, 'million'));
    setText('#openings-latest-date', `U.S. · ${formatMonth(headline.openingsLatest.date)}`);
    setText('#openings-change', signed(headline.openingsChangeSinceBaselinePct));
    setText('#unemployment-latest', formatValue(headline.unemploymentLatest.value, 'percent'));
    setText('#unemployment-latest-date', `U.S. · ${formatMonth(headline.unemploymentLatest.date)}`);
    setText('#exposure-any', evidence.iloExposure.someExposurePct);
    setText('#exposure-high', evidence.iloExposure.highestExposurePct);
    setText('#early-career-decline', evidence.earlyCareer.relativeEmploymentDeclinePct);
    setText('#adoption-rate', evidence.adoption.organizationsUsingAiPct);
  }

  function svgElement(name, attributes = {}, text = '') {
    const element = document.createElementNS(svgNS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text) element.textContent = text;
    return element;
  }

  function renderMarketChart(seriesKey) {
    activeSeries = seriesKey;
    const config = dashboardData.series[seriesKey];
    const observations = config.observations;
    const svg = $('#market-chart');
    const title = $('#market-chart-title');
    const description = $('#market-chart-desc');
    const sourceLink = $('#market-source');
    const source = getSource(config.sourceId);
    const tooltip = $('#chart-tooltip');

    if (!svg || !observations.length) return;

    title.textContent = `U.S. ${config.label.toLowerCase()}`;
    const sourceUrl = safeHttpsUrl(source?.url);
    if (sourceUrl) {
      sourceLink.href = sourceUrl;
      sourceLink.textContent = `${source.institution.replace('U.S. Bureau of Labor Statistics via ', '')} ↗`;
    } else {
      sourceLink.removeAttribute('href');
      sourceLink.textContent = 'Source URL unavailable';
    }

    const latest = observations[observations.length - 1];
    const baseline = observations.find((item) => item.date === dashboardData.headline.chatgptBaseline);
    const difference = baseline
      ? seriesKey === 'unemployment'
        ? `${signed(latest.value - baseline.value, ' pp')} since Nov. 2022`
        : `${signed(((latest.value - baseline.value) / baseline.value) * 100)} since Nov. 2022`
      : '';
    const unavailableNote = config.unavailable?.length
      ? ` ${config.unavailable.map((item) => `${formatMonth(item.date)}: ${item.reason}`).join(' ')}`
      : '';
    description.textContent = `${config.definition} Latest: ${formatValue(latest.value, config.unit)} in ${formatMonth(latest.date)}; ${difference}. This series describes conditions, not AI causality.${unavailableNote}`;

    const width = 780;
    const height = 360;
    const margin = { top: 28, right: 24, bottom: 54, left: 62 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const values = observations.map((item) => item.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const padding = Math.max((rawMax - rawMin) * 0.16, config.unit === 'percent' ? 0.25 : 0.45);
    const yMin = Math.max(0, rawMin - padding);
    const yMax = rawMax + padding;
    const firstMonth = monthIndex(observations[0].date);
    const lastMonth = monthIndex(latest.date);
    const monthSpan = Math.max(1, lastMonth - firstMonth);
    const x = (observationDate) => margin.left + ((monthIndex(observationDate) - firstMonth) / monthSpan) * innerWidth;
    const y = (value) => margin.top + ((yMax - value) / (yMax - yMin)) * innerHeight;

    svg.replaceChildren();
    svg.append(svgElement('title', {}, `${title.textContent}, January 2020 to ${formatMonth(latest.date)}`));
    svg.append(svgElement('desc', {}, description.textContent));

    const defs = svgElement('defs');
    const gradient = svgElement('linearGradient', { id: 'market-area-gradient', x1: '0', y1: '0', x2: '0', y2: '1' });
    gradient.append(
      svgElement('stop', { offset: '0%', 'stop-color': COLORS.observed, 'stop-opacity': '0.25' }),
      svgElement('stop', { offset: '100%', 'stop-color': COLORS.observed, 'stop-opacity': '0' })
    );
    defs.append(gradient);
    svg.append(defs);

    for (let tick = 0; tick <= 4; tick += 1) {
      const value = yMin + ((yMax - yMin) * tick) / 4;
      const position = y(value);
      svg.append(svgElement('line', {
        x1: margin.left,
        x2: width - margin.right,
        y1: position,
        y2: position,
        class: 'chart-grid-line'
      }));
      svg.append(svgElement('text', {
        x: margin.left - 12,
        y: position + 4,
        'text-anchor': 'end',
        class: 'chart-axis-label'
      }, formatValue(value, config.unit)));
    }

    observations.forEach((item, index) => {
      if (item.date.endsWith('-01-01')) {
        svg.append(svgElement('text', {
          x: x(item.date),
          y: height - 20,
          'text-anchor': 'middle',
          class: 'chart-axis-label chart-year-label'
        }, item.date.slice(0, 4)));
      }
    });

    const launchObservation = observations.find((item) => item.date === '2022-11-01');
    if (launchObservation) {
      const launchX = x(launchObservation.date);
      svg.append(svgElement('line', {
        x1: launchX,
        x2: launchX,
        y1: margin.top,
        y2: height - margin.bottom,
        class: 'chart-annotation-line'
      }));
      svg.append(svgElement('text', {
        x: launchX + 8,
        y: margin.top + 14,
        class: 'chart-annotation-label'
      }, 'ChatGPT'));
    }

    const segments = observations.reduce((groups, item) => {
      const current = groups[groups.length - 1];
      const previous = current?.[current.length - 1];
      if (!previous || monthIndex(item.date) - monthIndex(previous.date) === 1) {
        if (current) current.push(item);
        else groups.push([item]);
      } else {
        groups.push([item]);
      }
      return groups;
    }, []);
    segments.forEach((segment) => {
      const points = segment.map((item) => `${x(item.date)},${y(item.value)}`);
      const pathData = `M ${points.join(' L ')}`;
      const areaData = `${pathData} L ${x(segment.at(-1).date)},${height - margin.bottom} L ${x(segment[0].date)},${height - margin.bottom} Z`;
      svg.append(svgElement('path', { d: areaData, class: 'chart-area' }));
      svg.append(svgElement('path', { d: pathData, class: 'chart-line' }));
    });

    const latestX = x(latest.date);
    const latestY = y(latest.value);
    svg.append(svgElement('circle', { cx: latestX, cy: latestY, r: 8, class: 'chart-latest-halo' }));
    svg.append(svgElement('circle', { cx: latestX, cy: latestY, r: 4, class: 'chart-latest-dot' }));

    const focusLine = svgElement('line', {
      y1: margin.top,
      y2: height - margin.bottom,
      class: 'chart-focus-line',
      hidden: 'true'
    });
    const focusDot = svgElement('circle', { r: 5, class: 'chart-focus-dot', hidden: 'true' });
    svg.append(focusLine, focusDot);

    let keyboardIndex = observations.length - 1;

    function showPointByIndex(index) {
      const bounds = svg.getBoundingClientRect();
      const item = observations[index];
      const pointX = x(item.date);
      const pointY = y(item.value);
      focusLine.setAttribute('x1', pointX);
      focusLine.setAttribute('x2', pointX);
      focusLine.removeAttribute('hidden');
      focusDot.setAttribute('cx', pointX);
      focusDot.setAttribute('cy', pointY);
      focusDot.removeAttribute('hidden');
      tooltip.hidden = false;
      const tooltipValue = document.createElement('strong');
      const tooltipDate = document.createElement('span');
      tooltipValue.textContent = formatValue(item.value, config.unit);
      tooltipDate.textContent = formatMonth(item.date);
      tooltip.replaceChildren(tooltipValue, tooltipDate);
      const left = Math.max(8, Math.min(bounds.width - 120, (pointX / width) * bounds.width - 44));
      const top = Math.max(6, (pointY / height) * bounds.height - 68);
      tooltip.style.transform = `translate(${left}px, ${top}px)`;
    }

    function hidePoint() {
      tooltip.hidden = true;
      focusLine.setAttribute('hidden', 'true');
      focusDot.setAttribute('hidden', 'true');
    }

    function showPointFromPointer(clientX) {
      const bounds = svg.getBoundingClientRect();
      const viewX = ((clientX - bounds.left) / bounds.width) * width;
      const targetMonth = firstMonth + ((viewX - margin.left) / innerWidth) * monthSpan;
      const index = observations.reduce((closest, item, candidate) => (
        Math.abs(monthIndex(item.date) - targetMonth) < Math.abs(monthIndex(observations[closest].date) - targetMonth)
          ? candidate
          : closest
      ), 0);
      keyboardIndex = index;
      showPointByIndex(index);
    }

    svg.onpointermove = (event) => showPointFromPointer(event.clientX);
    svg.onpointerleave = hidePoint;
    svg.onfocus = () => showPointByIndex(keyboardIndex);
    svg.onblur = hidePoint;
    svg.onkeydown = (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') keyboardIndex = Math.max(0, keyboardIndex - 1);
      if (event.key === 'ArrowRight') keyboardIndex = Math.min(observations.length - 1, keyboardIndex + 1);
      if (event.key === 'Home') keyboardIndex = 0;
      if (event.key === 'End') keyboardIndex = observations.length - 1;
      showPointByIndex(keyboardIndex);
    };

    renderDataTable(config);
    $$('.chart-switcher button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.series === seriesKey));
    });
  }

  function renderDataTable(config) {
    const container = $('#market-data-table');
    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = `${config.label}, monthly observations`;
    table.append(caption);
    table.innerHTML += '<thead><tr><th scope="col">Month</th><th scope="col">Value</th></tr></thead>';
    const body = document.createElement('tbody');
    const rows = [
      ...config.observations.map((item) => ({ ...item, available: true })),
      ...(config.unavailable || []).map((item) => ({ ...item, available: false }))
    ].sort((a, b) => b.date.localeCompare(a.date));
    rows.forEach((item) => {
      const row = document.createElement('tr');
      const month = document.createElement('th');
      const value = document.createElement('td');
      month.scope = 'row';
      month.textContent = formatMonth(item.date);
      value.textContent = item.available ? formatValue(item.value, config.unit) : `Unavailable — ${item.reason}`;
      row.append(month, value);
      body.append(row);
    });
    table.append(body);
    container.replaceChildren(table);
  }

  function renderExposure() {
    const { someExposurePct, highestExposurePct } = dashboardData.evidence.iloExposure;
    const otherExposure = someExposurePct - highestExposurePct;
    const lowerExposure = 100 - someExposurePct;
    const chart = $('#exposure-chart');
    chart.innerHTML = '';
    [
      ['Highest exposure', highestExposurePct, 'exposure-chart__high'],
      ['Other exposure', otherExposure, 'exposure-chart__some'],
      ['Lower or no measured exposure', lowerExposure, 'exposure-chart__lower']
    ].forEach(([label, value, className]) => {
      const segment = document.createElement('span');
      segment.className = className;
      segment.style.width = `${value}%`;
      segment.title = `${label}: ${Number(value).toFixed(1)}%`;
      chart.append(segment);
    });
  }

  function renderForecast() {
    const forecast = dashboardData.evidence.wefForecast;
    const rows = [
      { label: 'Created', value: forecast.createdMillions, className: 'bar-row--created', sign: '+' },
      { label: 'Displaced', value: forecast.displacedMillions, className: 'bar-row--displaced', sign: '−' },
      { label: 'Net change', value: forecast.netMillions, className: 'bar-row--net', sign: '+' }
    ];
    const max = Math.max(...rows.map((row) => row.value));
    const chart = $('#forecast-chart');
    chart.replaceChildren(...rows.map((row) => {
      const element = document.createElement('div');
      element.className = `bar-row ${row.className}`;
      element.innerHTML = `<span>${row.label}</span><div><i style="width:${(row.value / max) * 100}%"></i></div><strong>${row.sign}${row.value}M</strong>`;
      return element;
    }));
  }

  function renderProductivity() {
    const productivity = dashboardData.evidence.productivity;
    const rows = [
      { label: 'Average agent', value: productivity.overallGainPct },
      { label: 'Novice / lower-skilled', value: productivity.noviceGainPct }
    ];
    const max = 40;
    const chart = $('#productivity-chart');
    chart.replaceChildren(...rows.map((row) => {
      const element = document.createElement('div');
      element.className = 'productivity-row';
      element.innerHTML = `<div><span>${row.label}</span><strong>+${row.value}%</strong></div><div class="productivity-track"><i style="width:${(row.value / max) * 100}%"></i></div>`;
      return element;
    }));
  }

  function renderSources() {
    const list = $('#sources-list');
    list.replaceChildren(...dashboardData.sources.map((source, index) => {
      const item = document.createElement('li');
      item.id = `source-${source.id}`;
      const number = document.createElement('span');
      number.className = 'source-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const body = document.createElement('div');
      const sourceUrl = safeHttpsUrl(source.url);
      const link = document.createElement(sourceUrl ? 'a' : 'span');
      if (sourceUrl) {
        link.href = sourceUrl;
        link.target = '_blank';
        link.rel = 'noreferrer';
      }
      link.textContent = sourceUrl ? `${source.title} ↗` : `${source.title} — URL unavailable`;
      const meta = document.createElement('p');
      meta.className = 'source-meta';
      meta.textContent = `${source.institution} · ${source.date}`;
      const note = document.createElement('p');
      note.className = 'source-note';
      note.textContent = source.note;
      body.append(link, meta, note);
      item.append(number, body);
      return item;
    }));
    setText('#source-count', `${dashboardData.sources.length} sources`);
  }

  function setupInteractions() {
    $$('.chart-switcher button').forEach((button) => {
      button.addEventListener('click', () => renderMarketChart(button.dataset.series));
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('has-motion');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
      $$('.reveal').forEach((element) => observer.observe(element));
    }
  }

  async function init() {
    try {
      const response = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Data request failed with ${response.status}`);
      dashboardData = await response.json();
      hydrateHeadline();
      renderMarketChart(activeSeries);
      renderExposure();
      renderForecast();
      renderProductivity();
      renderSources();
      setupInteractions();
    } catch (error) {
      console.error('Could not initialize CTW Signals dashboard', error);
      setText('#data-as-of', 'Live series unavailable · reviewed evidence remains below');
      const chart = $('#market-chart');
      if (chart) chart.outerHTML = '<div class="chart-error">The live chart could not be loaded. Source links and interpretations remain available.</div>';
      setupInteractions();
    }
  }

  init();
})();

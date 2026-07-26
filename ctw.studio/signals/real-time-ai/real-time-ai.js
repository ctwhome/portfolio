(() => {
  'use strict';

  const DATA_URL = '../data/real-time-ai.json';
  const byId = (id) => document.getElementById(id);

  function safeHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function renderSources(item, sourceMap) {
    const container = byId('case-detail-sources');
    if (!container) return;
    const links = item.sourceIds.flatMap((id) => {
      const source = sourceMap.get(id);
      const href = safeHttpsUrl(source?.url);
      if (!source || !href) return [];
      const link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = `${source.institution} ↗`;
      return [link];
    });
    container.replaceChildren(...links);
  }

  function selectCase(item, sourceMap) {
    document.querySelectorAll('[data-case-row]').forEach((row) => {
      const selected = row.dataset.caseRow === item.id;
      row.classList.toggle('is-selected', selected);
    });
    document.querySelectorAll('[data-case-select]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.caseSelect === item.id));
    });

    byId('case-detail-title').textContent = item.label;
    byId('case-detail-timing').textContent = item.timingClass.replaceAll('-', ' ');
    byId('case-detail-boundary').textContent = item.boundary;
    byId('case-detail-deadline').textContent = item.deadline;
    byId('case-detail-fallback').textContent = item.humanFallback;
    byId('case-detail-failure').textContent = item.failureBoundary;
    byId('case-detail-scope').textContent = `${item.geographyPopulation}; ${item.period}. Intended use: ${item.intendedUse}.`;
    byId('case-detail-read').textContent = `${item.interpretation} Caveat: ${item.caveat}`;
    renderSources(item, sourceMap);
  }

  function setupCaseSelection(data) {
    const cases = new Map(data.cases.map((item) => [item.id, item]));
    const sources = new Map(data.sources.map((item) => [item.id, item]));

    document.querySelectorAll('[data-case-select]').forEach((button) => {
      button.addEventListener('click', () => selectCase(cases.get(button.dataset.caseSelect), sources));
    });

  }

  function setupTimingFilters() {
    const buttons = document.querySelectorAll('[data-timing-filter]');
    const rows = document.querySelectorAll('[data-case-row]');
    const status = byId('timing-filter-status');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.timingFilter;
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        let matches = 0;
        rows.forEach((row) => {
          const match = filter !== 'all' && row.dataset.timing === filter;
          row.classList.toggle('is-filter-match', match);
          if (filter === 'all' || match) matches += 1;
        });
        const label = button.textContent.trim();
        status.textContent = filter === 'all'
          ? `Showing all ${matches} cases.`
          : `${matches} of ${rows.length} cases match ${label} timing. All rows remain available.`;
      });
    });
  }

  async function init() {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Real-time AI data request failed: ${response.status}`);
    const data = await response.json();
    byId('realtime-review-date').textContent = data.meta.editorialReview;
    setupCaseSelection(data);
    setupTimingFilters();
  }

  init().catch((error) => {
    console.error(error);
    document.documentElement.dataset.dataError = 'real-time-ai';
  });
})();

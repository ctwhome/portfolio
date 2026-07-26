(() => {
  'use strict';

  const DATA_URL = '../data/demography.json';
  const byId = (id) => document.getElementById(id);
  const number = new Intl.NumberFormat('en');

  function safeHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function cell(value, header = false) {
    const element = document.createElement(header ? 'th' : 'td');
    if (header) element.scope = 'row';
    element.textContent = String(value);
    return element;
  }

  function row(values) {
    const tr = document.createElement('tr');
    values.forEach((value, index) => tr.append(cell(value, index === 0)));
    return tr;
  }

  function replaceBody(tableId, rows) {
    const table = byId(tableId);
    const body = table?.querySelector('tbody');
    if (body && rows.length) body.replaceChildren(...rows);
  }

  function renderNow(data) {
    const world = data.series?.population?.latest?.WLD;
    const older = data.series?.olderShare?.latest?.NLD;
    const fertility = data.fertility?.observations?.at(-1);
    const component = data.componentsOfChange?.observations?.at(-1);
    if (world) byId('world-population').textContent = `${(world.value / 1e9).toFixed(2)}bn`;
    if (older) byId('nl-older-share').textContent = `${older.value.toFixed(2)}%`;
    if (fertility) byId('nl-fertility').textContent = fertility.value.toFixed(2);
    if (component) byId('nl-net-migration').textContent = `+${number.format(component.netMigration)}`;
  }

  function renderAgeStructure(data) {
    const records = data.ageStructure?.records || [];
    const years = [...new Set(records.map((item) => item.year))];
    const selected = years.filter((year) => year === years[0] || year === years.at(-1));
    const host = byId('age-structure-chart');
    if (host && selected.length) {
      host.replaceChildren(...selected.map((year) => {
        const group = records.filter((item) => item.year === year);
        const wrapper = document.createElement('div');
        wrapper.className = 'stack-row';
        const label = document.createElement('span');
        label.textContent = year;
        const stack = document.createElement('div');
        stack.className = 'stack';
        group.forEach((item, index) => {
          const segment = document.createElement('i');
          segment.className = ['age-young', 'age-work', 'age-old'][index];
          segment.style.width = `${item.value}%`;
          segment.textContent = item.ageBand;
          segment.title = `${item.ageBand}: ${item.value.toFixed(2)}%`;
          stack.append(segment);
        });
        wrapper.append(label, stack);
        return wrapper;
      }));
    }
    replaceBody('age-structure-table', years.map((year) => {
      const values = records.filter((item) => item.year === year);
      return row([
        year,
        `${values.find((item) => item.ageBand === '0–14')?.value.toFixed(2)}%`,
        `${values.find((item) => item.ageBand === '15–64')?.value.toFixed(2)}%`,
        `${values.find((item) => item.ageBand === '65+')?.value.toFixed(2)}%`,
        '1 January; % of residents'
      ]);
    }));
  }

  function renderComponents(data) {
    const observations = data.componentsOfChange?.observations || [];
    const sampleYears = new Set([2020, 2022, observations.at(-1)?.year]);
    const host = byId('components-chart');
    const fields = [
      ['births', 'Births', 'birth'],
      ['deaths', 'Deaths', 'death'],
      ['immigration', 'Immigration', 'inflow'],
      ['emigration', 'Emigration', 'outflow']
    ];
    const max = Math.max(1, ...observations.flatMap((item) => fields.map(([key]) => item[key])));
    if (host && observations.length) {
      host.replaceChildren(...observations.filter((item) => sampleYears.has(item.year)).map((item) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'component-row';
        const year = document.createElement('span');
        year.textContent = item.year;
        wrapper.append(year);
        fields.forEach(([key, label, className]) => {
          const bar = document.createElement('i');
          bar.className = className;
          bar.style.setProperty('--v', `${item[key] / max * 100}%`);
          bar.textContent = `${label} ${number.format(item[key])}`;
          wrapper.append(bar);
        });
        return wrapper;
      }));
    }
    replaceBody('components-table', observations.map((item) => row([
      item.year,
      number.format(item.births),
      number.format(item.deaths),
      number.format(item.immigration),
      number.format(item.emigration),
      `${item.netMigration >= 0 ? '+' : '−'}${number.format(Math.abs(item.netMigration))}`
    ])));
  }

  function renderDependency(data) {
    const series = data.dependencyTrajectory;
    const records = [...(series?.observations || []), series?.projection].filter(Boolean);
    const max = Math.max(1, ...records.map((item) => item.value));
    const host = byId('dependency-chart');
    if (host && records.length) {
      host.replaceChildren(...records.map((item) => {
        const wrapper = document.createElement('div');
        if (item.evidenceCategory === 'projection') wrapper.className = 'projected';
        const label = document.createElement('span');
        label.textContent = `${item.year} · ${item.evidenceCategory}`;
        const bar = document.createElement('i');
        bar.style.width = `${item.value / max * 100}%`;
        const value = document.createElement('strong');
        value.textContent = item.value;
        wrapper.append(label, bar, value);
        return wrapper;
      }));
    }
    replaceBody('dependency-table', records.map((item) => row([
      item.year,
      item.value,
      item.evidenceCategory,
      item.evidenceCategory === 'projection'
        ? `${item.author} · ${item.vintage} · ${item.variant} variant`
        : 'Eurostat demo_pjan'
    ])));
  }

  function renderHouseholds(data) {
    const records = data.populationHouseholds?.records || [];
    const latest = records.at(-1);
    const host = byId('household-chart');
    if (host && latest) {
      const measures = [
        ['Population', latest.populationIndex],
        ['Private households', latest.householdIndex]
      ];
      const excessMax = Math.max(...measures.map(([, value]) => value - 100), 1);
      host.replaceChildren(...measures.map(([labelText, valueText]) => {
        const wrapper = document.createElement('div');
        const label = document.createElement('span');
        label.textContent = labelText;
        const bar = document.createElement('i');
        bar.style.width = `${(valueText - 100) / excessMax * 100}%`;
        const value = document.createElement('strong');
        value.textContent = valueText.toFixed(1);
        wrapper.append(label, bar, value);
        return wrapper;
      }));
    }
    replaceBody('household-table', records.map((item) => row([
      item.year,
      number.format(item.population),
      number.format(item.households),
      item.populationIndex.toFixed(1),
      item.householdIndex.toFixed(1)
    ])));
  }

  function renderRegions(data) {
    const records = data.regionalDivergence?.records || [];
    const host = byId('regional-chart');
    if (host && records.length) {
      host.replaceChildren(...records.map((item) => {
        const article = document.createElement('article');
        const label = document.createElement('span');
        label.textContent = `${item.code} · ${item.region}`;
        const value = document.createElement('strong');
        const sign = item.populationChangePercent > 0 ? '+' : '';
        value.textContent = `${sign}${item.populationChangePercent.toFixed(1)}%`;
        const old = document.createElement('small');
        old.textContent = `${item.share65PlusPercent.toFixed(1)}% aged 65+`;
        article.append(label, value, old);
        return article;
      }));
    }
    replaceBody('regional-table', records.map((item) => row([
      item.code,
      item.region,
      `${item.populationChangePercent > 0 ? '+' : ''}${item.populationChangePercent.toFixed(1)}%`,
      `${item.share65PlusPercent.toFixed(1)}%`,
      '1 January 2025'
    ])));
  }

  function renderMigrationClassification(data) {
    replaceBody('migration-classification-table', (data.migrationCitizenship?.records || []).map((item) => row([
      item.question,
      item.classification,
      item.answerable
    ])));
  }

  function renderEffects(data) {
    replaceBody('effects-table', (data.effectsMatrix || []).map((item) => row([
      item.domain,
      item.signal,
      item.evidenceCategory,
      item.implication,
      item.limit
    ])));
  }

  function renderSources(sources) {
    const host = byId('demography-source-list');
    if (!host || !Array.isArray(sources) || !sources.length) return;
    host.replaceChildren(...sources.map((source) => {
      const article = document.createElement('article');
      article.id = `source-${source.id}`;
      const title = document.createElement('h3');
      title.textContent = source.title;
      const meta = document.createElement('p');
      meta.textContent = `${source.institution} · ${source.evidenceType} · ${source.date}`;
      const link = document.createElement('a');
      const url = safeHttpsUrl(source.url);
      link.textContent = url ? 'Open source ↗' : 'Source URL unavailable';
      if (url) {
        link.href = url;
        link.target = '_blank';
        link.rel = 'noreferrer';
      }
      const details = document.createElement('dl');
      [
        ['Scope', source.geographyPopulation],
        ['Period / unit', `${source.period} · ${source.denominatorUnit}`],
        ['Role', source.role],
        ['Interpretation', source.interpretation],
        ['Caveat', source.caveat]
      ].forEach(([term, description]) => {
        const group = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = term;
        dd.textContent = description;
        group.append(dt, dd);
        details.append(group);
      });
      article.append(title, meta, link, details);
      return article;
    }));
  }

  function validateData(data) {
    if (!data?.series?.population || !data?.series?.olderShare) {
      throw new Error('Demography data missing required observation series');
    }
    const projection = data.dependencyTrajectory?.projection;
    if (!projection?.author || !projection?.vintage || !projection?.variant || !projection?.assumptions) {
      throw new Error('Demography projection metadata incomplete');
    }
    if (data.componentsOfChange.observations.some((item) => item.immigration - item.emigration !== item.netMigration)) {
      throw new Error('Gross and net migration values do not reconcile');
    }
  }

  async function init() {
    const response = await fetch(DATA_URL, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Demography data request failed: ${response.status}`);
    const data = await response.json();
    validateData(data);
    byId('demography-data-date').textContent = data.meta.dataUpdated;
    renderNow(data);
    renderAgeStructure(data);
    renderComponents(data);
    renderDependency(data);
    renderHouseholds(data);
    renderRegions(data);
    renderMigrationClassification(data);
    renderEffects(data);
    renderSources(data.sources);
  }

  init().catch((error) => {
    console.error(error);
    document.documentElement.dataset.dataError = 'demography';
  });
})();

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../../dist/signals/', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/ai-jobs.json', root), 'utf8'));
const html = await readFile(new URL('ai-work/index.html', dist), 'utf8');
const script = await readFile(new URL('dashboard.js', root), 'utf8');

const requiredSeries = ['openings', 'hires', 'unemployment'];
const requiredEvidence = ['iloExposure', 'earlyCareer', 'macroLabour', 'wefForecast', 'productivity', 'adoption'];

function isSorted(observations) {
  return observations.every((item, index) => index === 0 || observations[index - 1].date < item.date);
}

function monthlyDates(start, end) {
  const result = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const final = new Date(`${end}T00:00:00Z`);
  while (cursor <= final) {
    result.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return result;
}

test('official series are populated, sorted, and current through 2026', () => {
  for (const key of requiredSeries) {
    const series = data.series[key];
    assert.ok(series, `missing ${key}`);
    assert.ok(series.observations.length >= 70, `${key} should contain monthly history from 2020`);
    assert.ok(isSorted(series.observations), `${key} observations must be strictly chronological`);
    assert.deepEqual(series.latest, series.observations.at(-1), `${key} latest must match the final observation`);
    assert.match(series.fredId, /^[A-Z]+$/);
    assert.ok(series.observations.at(-1).date >= '2026-05-01', `${key} is unexpectedly stale`);
  }
});

test('headline values are derived from published observations', () => {
  const openings = data.series.openings.observations;
  const unemployment = data.series.unemployment.observations;
  const baseline = data.headline.chatgptBaseline;
  const openingsBaseline = openings.find((item) => item.date === baseline);
  const unemploymentBaseline = unemployment.find((item) => item.date === baseline);

  assert.deepEqual(data.headline.openingsAtBaseline, openingsBaseline);
  assert.deepEqual(data.headline.openingsLatest, openings.at(-1));
  assert.deepEqual(data.headline.unemploymentAtBaseline, unemploymentBaseline);
  assert.deepEqual(data.headline.unemploymentLatest, unemployment.at(-1));

  const expectedOpeningsChange = Number((((openings.at(-1).value - openingsBaseline.value) / openingsBaseline.value) * 100).toFixed(1));
  const expectedUnemploymentChange = Number((unemployment.at(-1).value - unemploymentBaseline.value).toFixed(1));
  assert.equal(data.headline.openingsChangeSinceBaselinePct, expectedOpeningsChange);
  assert.equal(data.headline.unemploymentChangeSinceBaselinePoints, expectedUnemploymentChange);
});

test('monthly series gaps are explicit and limited to documented unavailable data', () => {
  for (const key of requiredSeries) {
    const series = data.series[key];
    const dates = new Set(series.observations.map((item) => item.date));
    const expected = monthlyDates(series.observations[0].date, series.observations.at(-1).date);
    const missing = expected.filter((date) => !dates.has(date));
    assert.deepEqual(missing, (series.unavailable || []).map((item) => item.date), `${key} has an undocumented gap`);
  }
  assert.deepEqual(data.series.unemployment.unavailable, [{
    date: '2025-10-01',
    reason: 'Data unavailable due to the 2025 lapse in appropriations.'
  }]);
});

test('curated evidence has a valid source, scope, period, and evidence type', () => {
  const sourceIds = new Set(data.sources.map((source) => source.id));
  for (const key of requiredEvidence) {
    const evidence = data.evidence[key];
    assert.ok(evidence, `missing ${key}`);
    assert.ok(evidence.scope || key === 'adoption', `${key} needs a scope`);
    assert.ok(evidence.period, `${key} needs a period`);
    assert.ok(evidence.kind, `${key} needs an evidence kind`);
    assert.ok(evidence.interpretation, `${key} needs an interpretation`);
    assert.ok(sourceIds.has(evidence.sourceId), `${key} references a missing source`);
  }
});

test('source ledger is auditable and uses secure links', () => {
  assert.ok(data.sources.length >= 8);
  const ids = new Set();
  for (const source of data.sources) {
    assert.ok(!ids.has(source.id), `duplicate source id ${source.id}`);
    ids.add(source.id);
    assert.match(source.url, /^https:\/\//);
    assert.ok(source.institution && source.title && source.date && source.note);
  }
  assert.match(html, new RegExp(`id="source-count">${data.sources.length} sources`));
});

test('page exposes the story, active navigation, chart alternatives, and method', () => {
  assert.doesNotMatch(html, /nav\.js|data-active="signals"/);
  assert.match(html, /href="\/signals\/" aria-current="page">Signals/);
  assert.match(html, /id="big-picture"/);
  assert.match(html, /id="exposure"/);
  assert.match(html, /id="uneven"/);
  assert.match(html, /id="expectations"/);
  assert.match(html, /id="transition-discipline"/);
  assert.match(html, /id="answer"/);
  assert.match(html, /id="market-data-table"/);
  assert.match(html, /market-chart-keyboard-help/);
  assert.match(html, /id="market-chart"[^>]*tabindex="0"/);
  assert.match(html, /id="sources-list"/);
  assert.match(html, /Housing &amp; affordability/);
  assert.match(html, /Science/);
  assert.match(html, /Healthspan/);
});

test('dashboard renders from the published data file without third-party chart code', () => {
  assert.match(script, /data\/ai-jobs\.json/);
  assert.match(script, /renderMarketChart/);
  assert.match(script, /renderDataTable/);
  assert.match(script, /safeHttpsUrl/);
  assert.match(script, /renderTransitionDiscipline/);
  assert.match(script, /ArrowLeft/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly/i);
});

test('AI transition discipline classifies guidance, limitations, and reversal indicators', () => {
  const discipline = data.transitionDiscipline;
  assert.equal(discipline.frameworkSourceId, 'gapminder-factfulness');
  assert.match(discipline.frameworkUse, /no affiliation/i);
  const framework = data.sources.find((source) => source.id === discipline.frameworkSourceId);
  for (const field of ['institution', 'title', 'date', 'url', 'geographyPopulation', 'period', 'denominatorUnit', 'evidenceType', 'role', 'interpretation', 'caveat']) {
    assert.ok(framework[field], `framework source missing ${field}`);
  }
  assert.ok(discipline.observedBasis.length >= 3);
  assert.ok(discipline.observedBasis.every((item) => item.classification && item.sourceId && item.limitation));
  assert.ok(discipline.robustActions.length >= 4);
  assert.ok(discipline.robustActions.every((item) => item.classification === 'Prudent judgment' && item.basis && item.limitation));
  assert.ok(discipline.watchIndicators.length >= 4);
  assert.match(discipline.explicitLimitations, /mass displacement is not established/i);
  assert.match(html, /Base rate/);
  assert.match(html, /Trend ≠ cause/);
  assert.match(html, /Exposure ≠ loss/);
  assert.match(html, /Task ≠ occupation/);
  assert.match(html, /Experiment ≠ forecast/);
  assert.match(html, /not universal prescription/i);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/healthspan.json', root), 'utf8'));
const html = await readFile(new URL('healthspan/index.html', root), 'utf8');
const script = await readFile(new URL('healthspan/healthspan.js', root), 'utf8');
const updater = await readFile(new URL('scripts/update_healthspan_data.py', root), 'utf8');

const sourceFields = [
  'institution', 'title', 'date', 'url', 'geographyPopulation', 'period',
  'denominatorUnit', 'evidenceType', 'role', 'interpretation', 'caveat'
];

test('healthspan sources are secure, unique, complete, and linked', () => {
  const ids = new Set();
  for (const source of data.sources) {
    assert.ok(!ids.has(source.id), `duplicate source ${source.id}`);
    ids.add(source.id);
    assert.match(source.url, /^https:\/\//);
    sourceFields.forEach((field) => assert.ok(source[field], `${source.id} missing ${field}`));
  }
  data.evidence.forEach((item) => assert.ok(ids.has(item.sourceId), `${item.id} source missing`));
  Object.values(data.series).forEach((series) => assert.ok(ids.has(series.sourceId)));
  assert.ok(ids.has(data.healthyLifeYears.sourceId));
});

test('health series preserve chronology, units, scopes, and derived latest values', () => {
  assert.deepEqual(Object.keys(data.series).sort(), ['lifeExpectancy', 'physicians']);
  for (const series of Object.values(data.series)) {
    assert.ok(series.unit && series.denominator && series.period);
    assert.deepEqual(Object.keys(series.observations).sort(), ['JPN', 'NLD', 'USA', 'WLD']);
    for (const [code, observations] of Object.entries(series.observations)) {
      assert.ok(observations.length >= 3, `${series.id}/${code} too short`);
      assert.ok(observations.every((item, index) => index === 0 || observations[index - 1].year < item.year));
      assert.deepEqual(series.latest[code], observations.at(-1));
    }
  }
  for (const item of data.healthyLifeYears.observations) {
    assert.equal(item.yearsWithActivityLimitation, Number((item.lifeExpectancyYears - item.healthyLifeYears).toFixed(1)));
    assert.ok(item.healthyLifeYears < item.lifeExpectancyYears);
  }
});

test('healthspan contract enforces five questions, three lenses, and category boundaries', () => {
  assert.equal(data.questions.length, 5);
  assert.deepEqual(data.lenses.map((lens) => lens.label), ['World', 'Europe / Netherlands', 'Selected countries']);
  assert.deepEqual(data.categories.map((item) => item.id), [
    'population-outcomes', 'system-performance', 'individual-risks',
    'clinical-evidence', 'consumer-devices', 'speculative-longevity'
  ]);
  assert.match(data.healthyLifeYears.caveat, /not WHO HALE/i);
  assert.match(data.lenses.find((item) => item.id === 'selected').role, /not a ranking/i);
  assert.ok(data.reversalIndicators.length >= 5);
});

test('access, waits, spending, AMR, and distribution retain definition limits', () => {
  const unmet = data.evidence.find((item) => item.id === 'unmet-care-eu');
  const spending = data.evidence.find((item) => item.id === 'spending-boundary');
  const amr = data.evidence.find((item) => item.id === 'amr-surveillance');
  assert.match(unmet.caveat, /not a clinical waiting-time measure/i);
  assert.match(spending.interpretation, /not causal/i);
  assert.match(amr.caveat, /not a comparable global burden trend/i);
  assert.ok(data.dataGaps.some((item) => /mental-health/i.test(item)));
  assert.ok(data.dataGaps.some((item) => /waiting-time definition/i.test(item)));
});

test('healthspan page exposes substantive no-JS evidence, accessible tables, and full navigation', () => {
  assert.match(html, /Are longer lives becoming healthier lives\?/);
  for (const id of ['where', 'direction', 'distribution', 'explanations', 'change', 'sources']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /id="health-years-table"/);
  assert.match(html, /id="health-data-table"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /prevention or treatment spending records allocation/i);
  assert.match(html, /href="\/signals\/">Signals \//);
  assert.match(html, /href="\/signals\/healthspan\/" aria-current="location"/);
});

test('health renderer and updater have no chart runtime and fail closed on schema gaps', () => {
  assert.match(script, /data\/healthspan\.json/);
  assert.match(script, /safeHttpsUrl/);
  assert.match(script, /renderHealthyYears/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly/i);
  assert.match(updater, /dimensions changed/);
  assert.match(updater, /Eurostat missing/);
  assert.match(updater, /indicator identity changed/);
  assert.doesNotMatch(updater, /requests|pandas/);
});

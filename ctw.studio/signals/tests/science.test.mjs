import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/science.json', root), 'utf8'));
const html = await readFile(new URL('science/index.html', root), 'utf8');
const script = await readFile(new URL('science/science.js', root), 'utf8');
const updater = await readFile(new URL('scripts/update_science_data.py', root), 'utf8');

const sourceFields = [
  'institution', 'title', 'date', 'url', 'geographyPopulation', 'period',
  'denominatorUnit', 'evidenceType', 'role', 'interpretation', 'caveat'
];

test('science sources are unique, secure, complete, and linked', () => {
  const ids = new Set();
  for (const source of data.sources) {
    assert.ok(!ids.has(source.id), `duplicate source ${source.id}`);
    ids.add(source.id);
    assert.match(source.url, /^https:\/\//);
    sourceFields.forEach((field) => assert.ok(source[field], `${source.id} missing ${field}`));
  }
  for (const item of data.evidence) assert.ok(ids.has(item.sourceId), `${item.id} source missing`);
  for (const series of Object.values(data.series)) assert.ok(ids.has(series.sourceId));
});

test('official series keep units, denominators, chronology, and derived latest values', () => {
  assert.deepEqual(Object.keys(data.series).sort(), ['journalArticles', 'rdIntensity']);
  for (const series of Object.values(data.series)) {
    assert.ok(series.unit && series.denominator && series.period);
    assert.deepEqual(Object.keys(series.observations).sort(), ['KOR', 'NLD', 'USA', 'WLD']);
    for (const [code, observations] of Object.entries(series.observations)) {
      assert.ok(observations.length >= 10, `${series.id}/${code} too short`);
      assert.ok(observations.every((item, index) => index === 0 || observations[index - 1].year < item.year));
      assert.deepEqual(series.latest[code], observations.at(-1));
    }
  }
  assert.equal(data.series.rdIntensity.unit, '% of GDP');
  assert.equal(data.series.journalArticles.unit, 'articles');
});

test('science contract separates five questions, three lenses, and evidence dimensions', () => {
  assert.equal(data.questions.length, 5);
  assert.deepEqual(data.lenses.map((lens) => lens.label), ['World', 'Europe / Netherlands', 'Selected countries']);
  assert.deepEqual(data.dimensions.map((item) => item.id), ['inputs', 'volume', 'reliability', 'translation', 'acceleration']);
  assert.match(data.verdict.text, /do not establish/i);
  assert.match(data.verdict.distribution, /uneven/i);
  assert.ok(data.reversalIndicators.length >= 4);
  assert.ok(data.possibilities.some((item) => item.label === 'Data gap'));
});

test('evidence types and cross-country caveats stay explicit', () => {
  const categories = new Set(data.evidence.map((item) => item.category));
  for (const required of ['reliability', 'translation', 'demonstrated acceleration']) {
    assert.ok(categories.has(required));
  }
  assert.ok(data.evidence.every((item) => item.evidenceType && item.observation && item.interpretation && item.caveat));
  assert.match(data.sources.find((item) => item.id === 'world-bank-rd').caveat, /does not measure discovery/i);
  assert.match(data.sources.find((item) => item.id === 'world-bank-articles').caveat, /counts do not measure/i);
  assert.match(data.lenses.find((item) => item.id === 'selected').role, /not a league table/i);
});

test('science page contains substantive no-JS evidence, tables, sources, and complete navigation', () => {
  assert.match(html, /Is science getting faster—(?:or|\s*or) merely producing more\?/);
  for (const id of ['where', 'direction', 'distribution', 'explanations', 'change', 'sources']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /id="science-data-table"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /Publication volume is not meaningful discovery/i);
  for (const route of ['../ai-work/', '../food/', '../housing/', './', '../healthspan/', '../']) {
    assert.match(html, new RegExp(`href="${route.replace(/[./]/g, '\\$&')}"`));
  }
});

test('science renderer and updater are dependency-free and fail closed', () => {
  assert.match(script, /data\/science\.json/);
  assert.match(script, /safeHttpsUrl/);
  assert.match(script, /renderSeries/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly/i);
  assert.match(updater, /indicator identity changed/);
  assert.match(updater, /missing countries/);
  assert.match(updater, /too few observations/);
  assert.doesNotMatch(updater, /requests|pandas/);
});

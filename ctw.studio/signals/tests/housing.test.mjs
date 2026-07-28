import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../../dist/signals/', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/housing.json', root), 'utf8'));
const html = await readFile(new URL('housing/index.html', dist), 'utf8');
const script = await readFile(new URL('housing/housing.js', root), 'utf8');

function isSorted(rows) {
  return rows.every((row, index) => index === 0 || rows[index - 1].period < row.period);
}

test('housing implements the shared five-question and three-lens contract', () => {
  assert.deepEqual(data.framework.questions.map((item) => item.id), [
    'where-now',
    'direction',
    'distribution',
    'explanations',
    'change-evidence'
  ]);
  assert.deepEqual(data.framework.lenses.map((item) => item.id), ['world', 'netherlands-europe', 'comparisons']);
  assert.ok(data.framework.possibilityQuestion);
  assert.match(data.meta.question, /ordinary life/i);
});

test('OECD affordability series are chronological and expose the Netherlands baseline shift', () => {
  for (const key of ['housePrice', 'rentPrice', 'priceToIncome', 'priceToRent']) {
    const series = data.netherlands.oecd[key];
    assert.ok(series.observations.length >= 40, `${key} needs quarterly history`);
    assert.ok(isSorted(series.observations), `${key} must be chronological`);
    assert.deepEqual(series.latest, series.observations.at(-1));
    assert.equal(series.base, '2015=100');
  }
  assert.ok(data.netherlands.oecd.priceToIncome.latest.value > 130);
  assert.ok(data.netherlands.oecd.housePrice.latest.value > data.netherlands.oecd.rentPrice.latest.value);
});

test('current Netherlands observations reconcile and preserve scope', () => {
  assert.match(data.netherlands.cbs.existingHomes.latest.period, /^2026-/);
  assert.ok(data.netherlands.cbs.existingHomes.latest.averagePurchasePriceEur > 400000);
  assert.equal(data.netherlands.ecbMortgage.unit, '% per year');
  assert.ok(data.netherlands.ecbMortgage.observations.length >= 100);

  const marketRent = data.netherlands.overburden.byTenure.find((item) => item.tenure === 'Market-rate tenant');
  const mortgagedOwner = data.netherlands.overburden.byTenure.find((item) => item.tenure === 'Owner with mortgage');
  assert.ok(marketRent.value > mortgagedOwner.value);
  assert.match(data.netherlands.overburden.definition, /40%/);

  assert.equal(data.netherlands.supplyVsHouseholds.length, 7);
  for (const row of data.netherlands.supplyVsHouseholds) {
    assert.equal(row.householdGrowth, row.householdsEnd - row.householdsStart);
  }
});

test('selected-country comparison is mechanism-led, harmonized, and not a ranking', () => {
  assert.equal(data.comparisons.period, '2025-Q4');
  assert.equal(data.comparisons.measure, 'Price-to-income index');
  assert.equal(data.comparisons.countries.length, 6);
  assert.ok(data.comparisons.countries.some((item) => item.code === 'NLD'));
  assert.ok(data.comparisons.countries.every((item) => item.whyIncluded && item.value > 0));
  assert.match(data.comparisons.caveat, /not an absolute affordability ranking/i);
});

test('world lens labels its derived estimate and exposes exact calculation inputs', () => {
  assert.equal(data.world.slumShare.unit, '% of urban population');
  assert.equal(data.world.slumShare.period, '2022');
  assert.ok(data.world.slumShare.value > 20);
  assert.ok(data.world.slumShare.rawValue > data.world.slumShare.value);
  assert.ok(Number.isInteger(data.world.urbanPopulation.valuePeople));
  const recomputedMillions = Math.round(
    data.world.slumShare.rawValue / 100 * data.world.urbanPopulation.valuePeople / 1_000_000
  );
  assert.equal(data.world.estimatedPeople.valueMillions, recomputedMillions);
  assert.equal(data.world.estimatedPeople.derived, true);
  assert.match(data.world.estimatedPeople.note, /unrounded source values/i);
  assert.match(data.world.limitations, /global affordability/i);
});

test('housing source ledger is unique, secure, and fully referenced', () => {
  const ids = new Set();
  for (const source of data.sources) {
    assert.ok(!ids.has(source.id), `duplicate source ${source.id}`);
    ids.add(source.id);
    assert.match(source.url, /^https:\/\//);
    for (const field of ['title', 'publisher', 'role', 'kind', 'accessed']) {
      assert.ok(source[field], `${source.id} missing ${field}`);
    }
  }
  assert.ok(data.sources.length >= 7);
});

test('housing page exposes every required chapter, lens, chart alternative, and possibility section', () => {
  assert.doesNotMatch(html, /nav\.js|data-active="signals"/);
  for (const id of ['where-now', 'direction', 'distribution', 'explanations', 'change-evidence', 'possibilities', 'sources']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const lens of ['world', 'netherlands-europe', 'comparisons']) {
    assert.match(html, new RegExp(`data-lens="${lens}"`));
  }
  assert.match(html, /housing-price-table/);
  assert.match(html, /supply-table/);
  assert.match(html, /Not an absolute affordability ranking/i);
});

test('all geographic evidence remains readable without JavaScript', () => {
  const panels = [...html.matchAll(/<section\b[^>]*data-lens-panel="[^"]+"[^>]*>/g)].map((match) => match[0]);
  assert.equal(panels.length, 3);
  assert.ok(panels.every((panel) => !/\shidden(?:\s|=|>)/.test(panel)), 'lens panels must not be hidden in source HTML');
  assert.match(html, /<noscript>[\s\S]*all geographic lenses are expanded/i);
  assert.match(html, /<noscript>[\s\S]*\.lens-tabs\s*\{[^}]*display:\s*none\s*!important/i);
  assert.match(script, /panel\.hidden = panel\.dataset\.lensPanel !== id/);
});

test('housing dashboard is dependency-free and renders baked data safely', () => {
  assert.match(script, /data\/housing\.json/);
  assert.match(script, /renderAffordabilityChart/);
  assert.match(script, /renderSupplyChart/);
  assert.match(script, /renderComparison/);
  assert.match(script, /safeHttpsUrl/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly/i);
});

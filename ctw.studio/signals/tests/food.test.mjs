import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/food-system.json', root), 'utf8'));
const html = await readFile(new URL('food/index.html', root), 'utf8');
const script = await readFile(new URL('food/food.js', root), 'utf8');
const nav = await readFile(new URL('../nav.js', root), 'utf8');

function isLeap(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

test('tracked land-animal totals reconcile to the species observations', () => {
  assert.ok(data.slaughter.year >= 2024);
  assert.equal(data.slaughter.daysInYear, isLeap(data.slaughter.year) ? 366 : 365);
  assert.equal(data.slaughter.species.length, 7);

  const annual = data.slaughter.species.reduce((sum, item) => sum + item.annual, 0);
  assert.equal(data.slaughter.annualTracked, annual);
  assert.equal(data.slaughter.dailyTracked, Math.round(annual / data.slaughter.daysInYear));
  assert.equal(data.slaughter.perMinuteTracked, Math.round(annual / data.slaughter.daysInYear / 24 / 60));
  assert.ok(data.slaughter.species.every((item) => item.annual > 0 && item.daily > 0));
  assert.match(data.slaughter.note, /excludes fish/i);
});

test('fish estimates retain ranges, method warnings, and separate units', () => {
  const { farmed, wild } = data.fishCounts;
  assert.ok(farmed.annualLowBillions < farmed.annualMidpointBillions);
  assert.ok(farmed.annualMidpointBillions < farmed.annualHighBillions);
  assert.ok(wild.annualLowBillions < wild.annualHighBillions);
  assert.match(farmed.note, /not an official head count/i);
  assert.match(wild.note, /uncertain/i);
  assert.notEqual(farmed.sourceId, wild.sourceId);
});

test('product footprints are positive, ordered, and include animal and plant comparisons', () => {
  assert.equal(data.productFootprints.length, 7);
  const names = new Set(data.productFootprints.map((item) => item.product));
  for (const required of ['Beef (beef herd)', 'Poultry Meat', 'Tofu', 'Peas']) {
    assert.ok(names.has(required), `missing ${required}`);
  }
  assert.ok(data.productFootprints.every((item) => item.kgCO2ePerKgFood > 0));
  assert.ok(data.productFootprints[0].kgCO2ePerKgFood > data.productFootprints.at(-1).kgCO2ePerKgFood);
});

test('every evidence reference resolves to a secure, unique source', () => {
  assert.ok(data.sources.length >= 10);
  const sourceIds = new Set();
  for (const source of data.sources) {
    assert.ok(!sourceIds.has(source.id), `duplicate source ${source.id}`);
    sourceIds.add(source.id);
    assert.match(source.url, /^https:\/\//);
    for (const field of ['title', 'publisher', 'publicationDate', 'role', 'kind']) {
      assert.ok(source[field], `${source.id} missing ${field}`);
    }
  }

  const directRefs = [
    data.slaughter.sourceId,
    data.fishCounts.farmed.sourceId,
    data.fishCounts.wild.sourceId,
    data.climate.sourceId,
    data.land.sourceId,
    data.forests.sourceId,
    data.oceans.sourceId,
    data.health.sourceId,
    data.health.guidanceSourceId,
    ...data.water.sourceIds
  ];
  directRefs.forEach((id) => assert.ok(sourceIds.has(id), `missing referenced source ${id}`));
});

test('agriculture-wide numbers are explicitly not presented as livestock-only', () => {
  assert.equal(data.water.agricultureFreshwaterWithdrawalPct, 69);
  assert.equal(data.water.agricultureEutrophicationPct, 78);
  assert.match(data.water.note, /agriculture-wide/i);
  assert.match(data.water.note, /do not assign/i);
  assert.match(html, /We cannot say:[\s\S]*livestock alone causes 69%/);
});

test('food page exposes the complete storyboard, chart alternatives, and active topic', () => {
  assert.match(html, /data-active="signals"/);
  for (const id of ['lives', 'climate', 'land', 'water', 'oceans', 'health', 'answer', 'sources']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /href="\/signals\/">Signals \//);
  assert.match(html, /href="\/signals\/#subject-food-animals-planet"[^>]*aria-current="location"/);
  assert.match(html, /food-active/);
  assert.match(html, /species-table/);
  assert.match(html, /footprint-table/);
  assert.match(html, /Scenario, not forecast/);
  assert.match(html, /relative risk/i);
});

test('food dashboard uses baked data without third-party chart libraries', () => {
  assert.match(script, /data\/food-system\.json/);
  assert.match(script, /renderSpecies/);
  assert.match(script, /renderFootprints/);
  assert.match(script, /renderSources/);
  assert.match(script, /safeHttpsUrl/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly/i);
});

test('site navigation exposes Signals', () => {
  assert.match(nav, /id: 'signals'/);
  assert.match(nav, /data-active/);
  assert.match(nav, /aria-current="page"/);
});

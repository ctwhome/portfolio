import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/demography.json', root), 'utf8'));
const html = await readFile(new URL('demography/index.html', root), 'utf8');
const script = await readFile(new URL('demography/demography.js', root), 'utf8');
const updater = await readFile(new URL('scripts/update_demography_data.py', root), 'utf8');
const updaterPath = fileURLToPath(new URL('scripts/update_demography_data.py', root));

const sourceFields = [
  'institution', 'title', 'date', 'url', 'geographyPopulation', 'period',
  'denominatorUnit', 'evidenceType', 'role', 'interpretation', 'caveat'
];

function chronological(rows) {
  return rows.every((item, index) => index === 0 || rows[index - 1].year < item.year);
}

test('demography implements five questions, three lenses, and the intended answer', () => {
  assert.equal(data.questions.length, 5);
  assert.deepEqual(data.questions.map((item) => item.id), [
    'where', 'direction', 'distribution', 'explanations', 'change'
  ]);
  assert.deepEqual(data.lenses.map((item) => item.label), [
    'World', 'Europe / Netherlands', 'Selected regions'
  ]);
  assert.match(data.question, /fertility, aging, migration and household formation/i);
  assert.match(data.verdict, /aging is structurally persistent/i);
  assert.match(data.verdict, /not.*complete answer/i);
});

test('source ledger is unique, secure, complete, and every source reference resolves', () => {
  const ids = new Set();
  for (const source of data.sources) {
    assert.ok(!ids.has(source.id), `duplicate source ${source.id}`);
    ids.add(source.id);
    assert.match(source.url, /^https:\/\//, `${source.id} must use HTTPS`);
    sourceFields.forEach((field) => assert.ok(source[field], `${source.id} missing ${field}`));
  }
  assert.ok(ids.size >= 8);

  const referenced = new Set([
    ...Object.values(data.series).map((item) => item.sourceId),
    data.fertility.sourceId,
    data.ageStructure.sourceId,
    data.componentsOfChange.sourceId,
    data.migrationCitizenship.sourceId,
    data.populationHouseholds.sourceId,
    data.regionalDivergence.sourceId,
    data.dependencyTrajectory.projection.sourceId,
    ...data.effectsMatrix.flatMap((item) => item.sourceIds)
  ]);
  referenced.forEach((id) => assert.ok(ids.has(id), `unresolved source ${id}`));
});

test('official series preserve chronology, scope, units, and latest values', () => {
  assert.deepEqual(Object.keys(data.series).sort(), ['olderShare', 'population']);
  for (const series of Object.values(data.series)) {
    assert.equal(series.evidenceCategory, 'observation');
    assert.ok(series.period && series.population && series.denominator && series.unit && series.timing);
    assert.deepEqual(Object.keys(series.observations).sort(), ['NLD', 'WLD']);
    for (const [code, rows] of Object.entries(series.observations)) {
      assert.ok(rows.length >= 5, `${series.id}/${code} too short`);
      assert.ok(chronological(rows), `${series.id}/${code} chronology`);
      assert.deepEqual(series.latest[code], rows.at(-1));
      assert.equal(rows.at(-1).year, 2025);
    }
  }
  assert.equal(data.series.population.id, 'SP.POP.TOTL');
  assert.equal(data.series.olderShare.id, 'SP.POP.65UP.TO.ZS');
  assert.match(data.definitions.populationTiming, /1 January.*annual-average|annual-average.*1 January/i);
});

test('age bands and dependency formula are exact and projections remain separate', () => {
  assert.deepEqual([...new Set(data.ageStructure.records.map((item) => item.ageBand))], [
    '0–14', '15–64', '65+'
  ]);
  const years = [...new Set(data.ageStructure.records.map((item) => item.year))];
  years.forEach((year) => {
    const total = data.ageStructure.records
      .filter((item) => item.year === year)
      .reduce((sum, item) => sum + item.value, 0);
    assert.ok(Math.abs(total - 100) < 0.02, `age shares must total 100 in ${year}`);
  });

  const ratio = data.definitions.oldAgeDependency;
  assert.equal(ratio.numeratorAgeBand, '65 years and older');
  assert.equal(ratio.denominatorAgeBand, '15–64 years');
  assert.match(ratio.formula, /65\+.*15–64.*100/);
  assert.match(ratio.caveat, /not an employment, health, fiscal or care-burden measure/i);

  assert.ok(data.dependencyTrajectory.observations.every((item) => item.evidenceCategory === 'observation'));
  const projection = data.dependencyTrajectory.projection;
  assert.equal(projection.evidenceCategory, 'projection');
  for (const field of ['author', 'vintage', 'variant', 'assumptions', 'sourceId']) {
    assert.ok(projection[field], `projection missing ${field}`);
  }
  assert.equal(projection.vintage, 'World Population Prospects 2024');
  assert.equal(projection.variant, 'Medium');
});

test('gross migration flows never collapse into stocks or identity categories', () => {
  assert.match(data.definitions.migration, /gross residence flows/i);
  assert.match(data.definitions.migration, /none is a migrant stock/i);
  assert.match(data.definitions.identity, /residence, citizenship, country of birth and nationality are different/i);
  assert.match(data.componentsOfChange.flowDefinition, /gross residence flows/i);
  for (const item of data.componentsOfChange.observations) {
    assert.equal(item.netMigration, item.immigration - item.emigration, `${item.year} net flow`);
  }
  assert.equal(data.migrationCitizenship.classification, 'citizenship');
  assert.match(data.migrationCitizenship.caveat, /not country of birth.*not.*stocks/i);
});

test('regional, household, fertility, and evidence-category records retain definitions', () => {
  assert.ok(data.regionalDivergence.boundaryVintage);
  assert.ok(data.regionalDivergence.records.every((item) => /^PV\d{2}$/.test(item.code)));
  assert.equal(new Set(data.regionalDivergence.records.map((item) => item.code)).size, data.regionalDivergence.records.length);
  assert.match(data.populationHouseholds.population, /1 January/i);
  assert.match(data.populationHouseholds.caveat, /institutional households are excluded/i);
  assert.match(data.fertility.caveat, /not completed family size/i);
  assert.ok(chronological(data.fertility.observations));
  assert.deepEqual(new Set(data.effectsMatrix.map((item) => item.evidenceCategory)), new Set([
    'association', 'judgment', 'scenario'
  ]));
  assert.ok(data.reversalIndicators.length >= 5);
  assert.doesNotMatch(JSON.stringify(data), /demographic burden score"\s*:/i);
});

test('page carries substantive no-JS evidence and six accessible component tables', () => {
  assert.match(html, /How is the population being reshaped\?/);
  for (const id of ['where', 'direction', 'distribution', 'explanations', 'change', 'sources']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const id of [
    'age-structure-table', 'components-table', 'dependency-table',
    'household-table', 'regional-table', 'effects-table'
  ]) {
    assert.match(html, new RegExp(`<table id="${id}"`), `${id} missing`);
  }
  assert.match(html, /<noscript>/);
  assert.match(html, /Flow ≠ stock/);
  assert.match(html, /UN DESA Population Division · WPP 2024 · Medium variant/);
  assert.match(html, /No demographic burden score is created/i);
  assert.match(html, /Gross immigration and gross emigration remain visible/i);
  assert.match(html, /href="\/signals\/">Signals \//);
  assert.match(html, /href="\/signals\/demography\/" aria-current="location"/);
});

test('renderer is dependency-free, uses baked JSON, handles missing data, and updater fails closed', () => {
  assert.match(script, /data\/demography\.json/);
  assert.match(script, /safeHttpsUrl/);
  for (const renderer of [
    'renderAgeStructure', 'renderComponents', 'renderDependency',
    'renderHouseholds', 'renderRegions', 'renderEffects'
  ]) {
    assert.match(script, new RegExp(renderer));
  }
  assert.match(script, /dataError = 'demography'/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly|api\.worldbank|ec\.europa/i);

  assert.match(updater, /indicator identity changed/);
  assert.match(updater, /missing geographies/);
  assert.match(updater, /too few observations/);
  assert.match(updater, /duplicate or unordered chronology/);
  assert.match(updater, /Pinned projection vintage changed/);
  assert.match(updater, /Gross migration flows do not reconcile/);
  assert.match(updater, /tempfile\.mkstemp/);
  assert.match(updater, /os\.replace/);
  assert.doesNotMatch(updater, /requests|pandas/);
});

test('offline demography validation pins source and denominator contracts', () => {
  const probe = String.raw`
import copy
import importlib.util
import json
import sys

spec = importlib.util.spec_from_file_location("demography_updater", sys.argv[1])
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
data = json.loads(module.DATA_PATH.read_text())
for field in ("sourceId", "denominator"):
    tampered = copy.deepcopy(data)
    tampered["series"]["population"][field] = "tampered"
    try:
        module.validate_official_series(tampered)
    except RuntimeError:
        pass
    else:
        raise AssertionError(f"tampered demography {field} accepted")
`;
  const result = spawnSync('python3', ['-c', probe, updaterPath], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

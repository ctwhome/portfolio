import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const rawData = await readFile(new URL('data/financial-fragility.json', root), 'utf8');
const data = JSON.parse(rawData);
const html = await readFile(new URL('financial-fragility/index.html', root), 'utf8');
const script = await readFile(new URL('financial-fragility/financial-fragility.js', root), 'utf8');
const css = await readFile(new URL('financial-fragility/financial-fragility.css', root), 'utf8');
const updater = await readFile(new URL('scripts/update_financial_fragility_data.py', root), 'utf8');
const updaterPath = fileURLToPath(new URL('scripts/update_financial_fragility_data.py', root));

const sourceFields = [
  'institution', 'title', 'seriesTableId', 'date', 'url',
  'geographyPopulation', 'period', 'denominatorUnit', 'evidenceType', 'role',
  'methodology', 'transformation', 'vintageRetrieved', 'revisionPolicy',
  'interpretation', 'caveat'
];

function allKeys(value, output = []) {
  if (!value || typeof value !== 'object') return output;
  for (const [key, nested] of Object.entries(value)) {
    output.push(key);
    allKeys(nested, output);
  }
  return output;
}

test('financial-fragility sources are unique, HTTPS, complete, and resolvable', () => {
  const ids = new Set();
  for (const source of data.sources) {
    assert.ok(!ids.has(source.id), `duplicate source ${source.id}`);
    ids.add(source.id);
    assert.match(source.url, /^https:\/\//);
    sourceFields.forEach((field) => assert.ok(source[field], `${source.id} missing ${field}`));
  }

  Object.values(data.series).forEach((series) => assert.ok(ids.has(series.sourceId), `${series.id} source missing`));
  data.balanceSheets.forEach((item) => assert.ok(ids.has(item.sourceId), `${item.id} source missing`));
  data.householdDistribution.forEach((item) => assert.ok(ids.has(item.sourceId), `${item.group} source missing`));

  const htmlSourceIds = [...html.matchAll(/data-source-id="([^"]+)"/g)]
    .flatMap((match) => match[1].trim().split(/\s+/));
  htmlSourceIds.forEach((id) => assert.ok(ids.has(id), `HTML source ${id} missing from ledger`));
});

test('series preserve exact identities, definitions, units, and chronology', () => {
  assert.deepEqual(Object.keys(data.series).sort(), [
    'governmentInterest', 'householdCredit', 'householdDebtService',
    'householdSaving', 'newMortgageRate'
  ]);
  assert.equal(data.series.householdCredit.id, 'BIS,WS_TC,2.0/Q.NL.H.A.M.770.A');
  assert.equal(data.series.householdDebtService.id, 'BIS,WS_DSR,1.0/Q.NL.H');
  assert.equal(data.series.newMortgageRate.id, 'MIR.M.NL.B.A2C.A.R.A.2250.EUR.N');
  assert.equal(data.series.householdSaving.id, 'Eurostat nasa_10_ki/SRG_S14_S15');
  assert.equal(data.series.governmentInterest.id, 'Eurostat gov_10a_main/S13/D41PAY');

  for (const series of Object.values(data.series)) {
    assert.ok(series.unit && series.denominator && series.frequency);
    assert.ok(series.observations.length >= 6, `${series.id} history too short`);
    const periods = series.observations.map((item) => item.period);
    assert.deepEqual(periods, [...periods].sort(), `${series.id} chronology`);
    assert.equal(new Set(periods).size, periods.length, `${series.id} duplicate period`);
    assert.deepEqual(series.latest, series.observations.at(-1));
  }

  assert.match(data.series.householdCredit.population, /NPISH/);
  assert.match(data.series.householdDebtService.caveat, /model|microdata/i);
  assert.match(data.series.newMortgageRate.caveat, /outstanding.*stock/i);
  assert.match(data.series.householdSaving.caveat, /not a stock of liquid emergency funds/i);
});

test('balance-sheet dimensions and denominators never collapse', () => {
  assert.deepEqual(data.dimensions.map((item) => item.id), [
    'household', 'government', 'banks', 'pensions'
  ]);
  assert.deepEqual(data.balanceSheets.map((item) => item.id), [
    'household', 'government', 'banks', 'pensions'
  ]);
  const government = data.balanceSheets.find((item) => item.id === 'government');
  assert.equal(government.sourceId, 'eurostat-debt');
  assert.equal(government.headline, '44.4%');
  assert.equal(government.period, '2025');
  const debtSource = data.sources.find((source) => source.id === 'eurostat-debt');
  assert.match(debtSource.seriesTableId, /gov_10dd_edpt1.*GD.*PC_GDP/);
  assert.match(data.dimensions[0].doNotConfuse, /Debt stock is not debt service/);
  assert.match(data.dimensions[1].doNotConfuse, /Gross debt, net debt/);
  assert.match(data.dimensions[2].doNotConfuse, /Capital is not liquidity/);
  assert.match(data.dimensions[3].doNotConfuse, /not benefit adequacy/i);

  const latest = data.series.governmentInterest.latest;
  assert.equal(
    latest.interestToRevenuePct,
    Number((latest.interestMioEur / latest.revenueMioEur * 100).toFixed(1))
  );
  assert.notEqual(data.series.householdCredit.denominator, data.series.householdDebtService.denominator);
  assert.match(data.series.governmentInterest.formula, /D41PAY.*TR.*100/);
});

test('distribution, arrears, safeguards, and reversal evidence retain boundaries', () => {
  assert.ok(data.householdDistribution.length >= 4);
  assert.ok(data.householdDistribution.every((item) => (
    item.group && item.exposure && item.shockChannel && item.evidence && item.boundary
  )));
  assert.equal(data.arrearsBoundary.status, 'Data gap');
  assert.match(data.arrearsBoundary.text, /Arrears are not defaults|arrears.*defaults/i);
  assert.match(data.arrearsBoundary.whatWouldResolve, /days-past-due/i);
  assert.ok(data.safeguards.banks.some((item) => /capital, not liquidity/i.test(item.boundary)));
  assert.ok(data.safeguards.pensions.some((item) => /not adequacy/i.test(item.boundary)));
  assert.ok(data.reversalIndicators.length >= 5);
  for (const label of ['Persistent household defaults', 'Depleted liquid buffers', 'Fiscal crowd-out', 'Bank losses', 'Restored affordability']) {
    assert.ok(data.reversalIndicators.some((item) => item.label === label), `missing reversal ${label}`);
  }
});

test('five-question contract, evidence labels, and no-composite policy are explicit', () => {
  assert.equal(data.questions.length, 5);
  assert.deepEqual(data.lenses.map((lens) => lens.label), [
    'World', 'Europe / Netherlands', 'Selected countries'
  ]);
  assert.match(data.lenses.find((lens) => lens.id === 'selected').role, /not a fragility ranking/i);
  assert.deepEqual(
    new Set(data.explanations.map((item) => item.evidenceType)),
    new Set(['Mechanism', 'Exposure', 'Association', 'Scenario'])
  );
  assert.ok(data.explanations.every((item) => item.test));
  assert.ok(!allKeys(data).some((key) => /^(score|composite|overallScore|trafficLight)$/i.test(key)));
  assert.doesNotMatch(script, /calculate(?:Composite|Score)|fragilityScore|overallScore/i);
});

test('page provides substantive no-JS evidence and every required component', () => {
  assert.match(html, /Where does resilience become financial stress\?/);
  for (const id of ['where', 'direction', 'distribution', 'government-burden', 'safeguards', 'explanations', 'change', 'method', 'sources']) {
    assert.match(html, new RegExp(`id="${id}"`), `missing section ${id}`);
  }
  for (const id of [
    'balance-sheet-grid', 'table-householdCredit', 'table-householdDebtService',
    'table-newMortgageRate', 'distribution-table', 'government-table',
    'bank-safeguards', 'reversal-list', 'source-ledger'
  ]) {
    assert.match(html, new RegExp(`id="${id}"`), `missing component ${id}`);
  }
  assert.match(html, /<noscript>/);
  assert.match(html, /Debt and buffers do not belong to the same representative household/);
  assert.match(html, /Arrears are not defaults/);
  assert.match(html, /One interest bill\. Two denominators\./);
  assert.match(html, /There is no financial-fragility composite or traffic-light total/);
  for (const route of ['../ai-work/', '../food/', '../housing/', '../science/', '../healthspan/', './', '../']) {
    assert.match(html, new RegExp(`href="${route.replace(/[./]/g, '\\$&')}"`));
  }
});

test('renderer is dependency-free, defensive, and preserves accessible equivalents', () => {
  assert.match(script, /data\/financial-fragility\.json/);
  assert.match(script, /safeHttpsUrl/);
  assert.match(script, /renderSeries/);
  assert.match(script, /renderSources/);
  assert.match(script, /validateSourceResolution/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly|highcharts/i);
  assert.doesNotMatch(html, /<canvas/i);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /prefers-reduced-motion/);
});

test('updater is whitelisted, fail-closed, atomic, and serialization is canonical', () => {
  for (const identity of ['Q.NL.H.A.M.770.A', 'Q.NL.H', 'MIR.M.NL.B.A2C.A.R.A.2250.EUR.N', 'nasa_10_ki', 'gov_10a_main']) {
    assert.match(updater, new RegExp(identity.replace(/[.]/g, '\\.')));
  }
  assert.match(updater, /SRG_S14_S15/);
  assert.match(updater, /gov_10dd_edpt1/);
  assert.match(updater, /dimensions changed/);
  assert.match(updater, /indicator identity changed/);
  assert.match(updater, /chronology is invalid/);
  assert.match(updater, /os\.replace/);
  assert.match(updater, /tempfile\.mkstemp/);
  assert.match(updater, /--validate-only/);
  assert.doesNotMatch(updater, /requests|pandas|imf/i);
  assert.ok(rawData.endsWith('\n'), 'JSON must end with one newline');
  assert.ok(!rawData.includes('\r\n'), 'JSON must use LF line endings');
  assert.deepEqual(JSON.parse(rawData), JSON.parse(JSON.stringify(data)));
});

test('BIS parser accepts current bulk-download decorated headers and dimension labels', () => {
  const probe = String.raw`
import importlib.util
import sys

spec = importlib.util.spec_from_file_location("financial_updater", sys.argv[1])
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
row = {
    "FREQ:Frequency": "Q: Quarterly",
    "BORROWERS_CTY:Borrowers' country": "NL: Netherlands",
    "TC_BORROWERS:Borrowing sector": "H: Households and NPISHs",
    "TC_LENDERS:Lending sector": "A: All sectors",
    "VALUATION:Valuation method": "M: Market value",
    "UNIT_TYPE:Unit type": "770: Percentage of GDP",
    "TC_ADJUST:Adjustment": "A: Adjusted for breaks",
    "TIME_PERIOD:Time period or range": "2025-Q4",
    "OBS_VALUE:Observation Value": "93.8",
}
assert module.bis_credit_key(row) == "Q.NL.H.A.M.770.A"
assert module.first(row, "TIME_PERIOD") == "2025-Q4"
assert module.first(row, "OBS_VALUE") == "93.8"
`;
  const result = spawnSync('python3', ['-c', probe, updaterPath], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('official parsers reject dimension drift and freshness ignores retrieval-only dates', () => {
  const probe = String.raw`
import copy
import importlib.util
import json
import sys

spec = importlib.util.spec_from_file_location("financial_updater", sys.argv[1])
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

ecb = {
    "FREQ": "M", "REF_AREA": "NL", "BS_REP_SECTOR": "B",
    "BS_ITEM": "A2C", "MATURITY_NOT_IRATE": "A", "DATA_TYPE_MIR": "R",
    "AMOUNT_CAT": "A", "BS_COUNT_SECTOR": "2250",
    "CURRENCY_TRANS": "EUR", "IR_BUS_COV": "N",
}
module.validate_ecb_dimensions(ecb)
bad_ecb = dict(ecb, REF_AREA="DE")
try:
    module.validate_ecb_dimensions(bad_ecb)
except RuntimeError:
    pass
else:
    raise AssertionError("wrong ECB geography accepted")

saving = [{
    "freq": "A", "geo": "NL", "sector": "S14_S15",
    "na_item": "SRG_S14_S15", "unit": "PC", "time": "2025", "value": 17.3,
}]
module.require_dimensions(saving, {
    "freq": "A", "geo": "NL", "sector": "S14_S15",
    "na_item": "SRG_S14_S15", "unit": "PC",
}, "Eurostat saving")
bad_saving = [dict(saving[0], sector="S13")]
try:
    module.require_dimensions(bad_saving, {
        "freq": "A", "geo": "NL", "sector": "S14_S15",
        "na_item": "SRG_S14_S15", "unit": "PC",
    }, "Eurostat saving")
except RuntimeError:
    pass
else:
    raise AssertionError("wrong Eurostat saving sector accepted")

government = [{
    "freq": "A", "geo": "NL", "sector": "S13",
    "na_item": "D41PAY", "unit": "PC_GDP", "time": "2025", "value": 0.7,
}]
module.require_dimensions(
    government, {"freq": "A", "geo": "NL", "sector": "S13"},
    "Eurostat government",
)
try:
    module.require_dimensions(
        [dict(government[0], freq="Q")],
        {"freq": "A", "geo": "NL", "sector": "S13"},
        "Eurostat government",
    )
except RuntimeError:
    pass
else:
    raise AssertionError("quarterly government row accepted")

data = json.loads(module.DATA_PATH.read_text())
different_date = copy.deepcopy(data)
different_date["meta"]["dataUpdated"] = "1900-01-01"
assert module.updater_owned_snapshot(data) == module.updater_owned_snapshot(different_date)
different_date["series"]["householdCredit"]["latest"]["value"] += 1
assert module.updater_owned_snapshot(data) != module.updater_owned_snapshot(different_date)
for field in ("sourceId", "denominator"):
    tampered = copy.deepcopy(data)
    tampered["series"]["householdCredit"][field] = "tampered"
    try:
        module.validate(tampered)
    except RuntimeError:
        pass
    else:
        raise AssertionError(f"tampered financial {field} accepted")
`;
  const result = spawnSync('python3', ['-c', probe, updaterPath], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('static no-JS headlines and selected fiscal rows match refreshed JSON', () => {
  const dsr = data.series.householdDebtService.latest;
  const rate = data.series.newMortgageRate.latest;
  const saving = data.series.householdSaving.latest;
  const fiscal = data.series.governmentInterest.latest;
  assert.match(html, new RegExp(`id="hero-dsr">${dsr.value.toFixed(1)}%`));
  assert.match(html, new RegExp(`id="hero-rate">${rate.value.toFixed(2)}%`));
  assert.match(html, new RegExp(`per year · ${rate.period}`));
  assert.match(html, new RegExp(`id="saving-latest">${saving.value.toFixed(1)}%`));
  assert.match(html, new RegExp(`gross disposable income · ${saving.period}`));
  assert.match(html, new RegExp(`id="interest-revenue">${fiscal.interestToRevenuePct.toFixed(1)}%`));
  assert.match(html, new RegExp(`${fiscal.period}</td><td>${fiscal.interestMioEur.toLocaleString('en-US')}</td>`));
  assert.match(html, new RegExp(`${fiscal.revenueMioEur.toLocaleString('en-US')}</td><td>${fiscal.interestToRevenuePct.toFixed(1)}%`));
  assert.match(data.verdict.text, new RegExp(`${dsr.value.toFixed(1)}% of income`));
});

test('four-balance-sheet overview is bound to exact ledger sources', () => {
  assert.match(html, /id="balance-sheet-grid"[^>]+data-source-id="bis-household-credit eurostat-debt ecb-supervisory dnb-pensions"/);
  assert.match(html, /data-citation-source-id="bis-household-credit eurostat-debt ecb-supervisory dnb-pensions"/);
  for (const sourceId of ['bis-household-credit', 'eurostat-debt', 'ecb-supervisory', 'dnb-pensions']) {
    const url = data.sources.find((source) => source.id === sourceId).url;
    assert.ok(html.includes(`href="${url}"`), `overview missing exact ${sourceId} URL`);
  }
  const distributionCitation = html.match(/<p class="proximate-citation" data-citation-source-id="cbs-household-wealth cbs-financial-sustainability dnb-pensions">[\s\S]*?<\/p>/)?.[0];
  assert.ok(distributionCitation, 'distribution citation strip missing');
  const pensionUrl = data.sources.find((source) => source.id === 'dnb-pensions').url;
  assert.ok(distributionCitation.includes(`href="${pensionUrl}"`), 'distribution citation does not use pinned pension evidence');
});

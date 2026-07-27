import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/education.json', root), 'utf8'));
const html = await readFile(new URL('education/index.html', root), 'utf8');
const script = await readFile(new URL('education/education.js', root), 'utf8');
const css = await readFile(new URL('education/education.css', root), 'utf8');
const updater = await readFile(new URL('scripts/update_education_data.py', root), 'utf8');
const updaterPath = fileURLToPath(new URL('scripts/update_education_data.py', root));

const sourceFields = [
  'institution', 'title', 'date', 'url', 'geographyPopulation', 'period',
  'denominatorUnit', 'release', 'evidenceType', 'role', 'interpretation', 'caveat'
];

test('education sources are unique, secure, complete, and resolve from evidence', () => {
  const ids = new Set();
  for (const source of data.sources) {
    assert.ok(!ids.has(source.id), `duplicate source ${source.id}`);
    ids.add(source.id);
    assert.match(source.url, /^https:\/\//, `${source.id} URL`);
    sourceFields.forEach((field) => assert.ok(source[field], `${source.id} missing ${field}`));
    assert.match(html, new RegExp(`id="source-${source.id}"`), `${source.id} ledger anchor`);
  }

  const referenced = [
    data.foundationalTrajectory.sourceId,
    data.proficiencyDistribution.sourceId,
    data.learningPoverty.sourceId,
    data.adultLearning.sourceId,
    data.adultLearning.distribution.sourceId,
    data.teacherCapacity.sourceId,
    ...data.pathwayEvidence.map((item) => item.sourceId),
    ...data.aiTutorStudies.map((item) => item.sourceId),
    ...Object.values(data.officialSeries).map((item) => item.sourceId)
  ];
  referenced.forEach((id) => assert.ok(ids.has(id), `missing referenced source ${id}`));
});

test('assessment trajectory pins framework, age, domain, cycle, release, and chronology', () => {
  const trajectory = data.foundationalTrajectory;
  for (const field of [
    'framework', 'populationAge', 'geography', 'unit', 'release',
    'evidenceCategory', 'caveat'
  ]) assert.ok(trajectory[field], `trajectory missing ${field}`);
  assert.deepEqual(trajectory.cycles.map((item) => item.cycle), [2012, 2015, 2018, 2022]);
  for (const cycle of trajectory.cycles) {
    assert.equal(typeof cycle.mathematics, 'number');
    assert.equal(typeof cycle.reading, 'number');
    assert.equal(typeof cycle.science, 'number');
  }
  assert.match(trajectory.caveat, /not joined to PIRLS, TIMSS, national tests or PIAAC/i);
  assert.match(html, /PISA must not be joined to PIRLS, TIMSS, national assessments or adult PIAAC/i);
  assert.doesNotMatch(JSON.stringify(data), /capabilityScore|educationComposite/i);
});

test('proficiency distributions keep subgroup denominators and do not collapse to averages', () => {
  const distribution = data.proficiencyDistribution;
  for (const field of [
    'framework', 'populationAge', 'geography', 'domain', 'denominator',
    'release', 'evidenceCategory', 'caveat'
  ]) assert.ok(distribution[field], `distribution missing ${field}`);
  assert.ok(distribution.measures.length >= 5);
  for (const measure of distribution.measures) {
    assert.ok(measure.label && measure.unit && measure.subgroupDefinition);
    assert.equal(typeof measure.value, 'number');
  }
  assert.match(distribution.caveat, /Average scores do not replace/i);
  assert.ok(distribution.measures.some((item) => /socioeconomic|ESCS/i.test(`${item.label} ${item.subgroupDefinition}`)));
  assert.ok(distribution.measures.some((item) => /immigrant|migration/i.test(`${item.label} ${item.subgroupDefinition}`)));
  assert.ok(distribution.measures.some((item) => /girls|boys|gender/i.test(`${item.label} ${item.subgroupDefinition}`)));
});

test('learning poverty is labelled as harmonised and modelled, not universal observation', () => {
  const item = data.learningPoverty;
  for (const field of [
    'period', 'population', 'denominator', 'unit', 'release',
    'evidenceCategory', 'interpretation', 'caveat'
  ]) assert.ok(item[field], `learning poverty missing ${field}`);
  assert.equal(item.evidenceCategory, 'modelled estimate');
  assert.match(item.caveat, /not a direct universal observation/i);
  assert.match(item.caveat, /not comparable to a single PISA/i);
});

test('pathway stages remain distinct and claims retain scope', () => {
  assert.deepEqual(data.pathwaySequence.map((item) => item.stage), [
    'Enrollment', 'Completion', 'Employment', 'Earnings', 'Job match'
  ]);
  for (const stage of data.pathwaySequence) {
    assert.ok(stage.question && stage.measure && stage.notEquivalentTo);
  }
  for (const item of data.pathwayEvidence) {
    for (const field of [
      'stage', 'geography', 'period', 'population', 'denominator', 'value',
      'unit', 'release', 'evidenceCategory', 'interpretation', 'caveat'
    ]) assert.notEqual(item[field], undefined, `${item.id} missing ${field}`);
  }
  assert.ok(data.pathwayEvidence.some((item) => item.evidenceCategory === 'policy target'));
  assert.match(JSON.stringify(data.pathwayEvidence), /not completion, employment, earnings or job match/i);
});

test('adult learning keeps participation windows, series breaks, and adaptation limits', () => {
  const adult = data.adultLearning;
  assert.equal(adult.referenceWindow, 'four weeks preceding the EU Labour Force Survey interview');
  assert.equal(adult.populationAge, '25–64');
  assert.ok(adult.breaks.some((item) => /2021 break/i.test(item)));
  assert.match(adult.caveat, /Participation records an activity/i);
  assert.match(adult.caveat, /does not demonstrate completion, measured skill gain, occupational transition/i);
  assert.equal(adult.distribution.referenceWindow, '12 months preceding interview');
  assert.ok(adult.distribution.subgroupDenominator);
  assert.match(adult.distribution.caveat, /different reference windows/i);
});

test('teacher evidence preserves constructs and keeps forecasts separate', () => {
  const capacity = data.teacherCapacity;
  for (const field of [
    'geography', 'period', 'population', 'denominator', 'release',
    'evidenceCategory', 'measures', 'costContext', 'caveat'
  ]) assert.ok(capacity[field], `capacity missing ${field}`);
  assert.ok(capacity.measures.every((item) =>
    item.construct && typeof item.value === 'number' && item.unit && item.year
  ));
  assert.match(capacity.caveat, /not a vacancy count, pupil-teacher ratio/i);
  assert.match(capacity.caveat, /workload measure or forecast shortage/i);
  assert.match(capacity.costContext.interpretation, /not proof/i);
  assert.doesNotMatch(JSON.stringify(data.teacherCapacity), /forecastValue|projectedShortage/i);
});

test('AI study matrix exposes required metadata and prohibits incompatible pooling', () => {
  assert.ok(data.aiTutorStudies.length >= 3);
  const fields = [
    'design', 'sample', 'comparator', 'duration', 'outcome', 'uncertainty',
    'fundingConflicts', 'generalizability', 'evidenceCategory'
  ];
  for (const study of data.aiTutorStudies) {
    fields.forEach((field) => assert.ok(study[field], `${study.id} missing ${field}`));
    assert.equal(study.evidenceCategory, 'experiment');
    assert.equal(study.poolingGroup, null);
  }
  assert.equal(data.poolingDecision.pooled, false);
  assert.match(data.poolingDecision.reason, /not commensurable/i);
  assert.match(html, /No forest plot · no pooled effect/);
  assert.match(html, /AI task effect ≠ durable learning ≠ teacher substitution ≠ cost reduction ≠ system equity/i);
  assert.doesNotMatch(script, /forest|metaAnalysis|pooledEffect/i);
});

test('official updater owns only stable World Bank UIS series and validates before writing', () => {
  assert.deepEqual(Object.keys(data.officialSeries), ['primaryGrossEnrollment']);
  for (const series of Object.values(data.officialSeries)) {
    for (const field of [
      'id', 'sourceId', 'definition', 'geography', 'population', 'denominator',
      'unit', 'period', 'release', 'evidenceCategory', 'observations', 'latest', 'caveat'
    ]) assert.ok(series[field], `${series.id} missing ${field}`);
    assert.ok(series.observations.length >= 3);
    assert.ok(series.observations.every((item, index) =>
      index === 0 || series.observations[index - 1].year < item.year
    ));
    assert.deepEqual(series.latest, series.observations.at(-1));
  }
  assert.match(updater, /indicator identity changed/);
  assert.match(updater, /geography dimensions changed/);
  assert.match(updater, /duplicate or unordered chronology/);
  assert.match(updater, /Only these keys are updater-owned/);
  assert.match(updater, /validated and preserved education\.json/);
  assert.match(updater, /os\.replace/);
  assert.doesNotMatch(updater, /PISA|PIAAC|aiTutorStudies.*=/);
  assert.doesNotMatch(updater, /requests|pandas/);
});

test('official updater rejects World Bank source-collection drift', () => {
  const probe = String.raw`
import importlib.util
import copy
import json
import sys

spec = importlib.util.spec_from_file_location("education_updater", sys.argv[1])
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.fetch_json = lambda url: [
    {"pages": 1, "sourceid": "999"},
    [{
        "countryiso3code": "NLD",
        "indicator": {"id": "SE.PRM.ENRR"},
        "date": "2024",
        "value": 100,
    }],
]
try:
    module.fetch_indicator("SE.PRM.ENRR")
except RuntimeError as error:
    assert "source changed" in str(error)
else:
    raise AssertionError("World Bank source drift accepted")

data = json.loads(module.DATA_PATH.read_text())
for field in ("sourceId", "denominator"):
    tampered = copy.deepcopy(data)
    tampered["officialSeries"]["primaryGrossEnrollment"][field] = "tampered"
    try:
        module.validate_preserved_series(tampered)
    except RuntimeError:
        pass
    else:
        raise AssertionError(f"tampered education {field} accepted")
`;
  const result = spawnSync('python3', ['-c', probe, updaterPath], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('page has substantive no-JS content, semantic tables, components, and navigation', () => {
  assert.match(html, /Are people gaining the capabilities needed to <em>adapt\?<\/em>/);
  for (const id of ['where', 'direction', 'distribution', 'explanations', 'change', 'sources']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const id of [
    'trajectory-table', 'pathway-table', 'official-series-table',
    'distribution-table', 'adult-learning-table', 'teacher-capacity-table',
    'ai-study-table'
  ]) assert.match(html, new RegExp(`<table id="${id}"`), `${id} absent`);
  for (const phrase of [
    'Foundational trajectory', 'Pathway sequence', 'Adult learning &amp; adaptation',
    'Teacher capacity', 'Structured AI-tutor evidence matrix'
  ]) assert.match(html, new RegExp(phrase, 'i'));
  assert.match(html, /<noscript>/);
  assert.match(html, /No capability composite is reported/i);
  assert.match(html, /href="\/signals\/">Signals \//);
  assert.match(html, /href="\/signals\/ai-work\/" aria-current="location"/);
  assert.match(css, /@media \(max-width: 600px\)/);
});

test('renderer is dependency-free, reads committed JSON, and safely renders sources', () => {
  assert.match(script, /data\/education\.json/);
  assert.match(script, /safeHttpsUrl/);
  assert.match(script, /renderTrajectory/);
  assert.match(script, /renderOfficialSeries/);
  assert.match(script, /renderSources/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly|https?:\/\/api/i);
  assert.doesNotMatch(html, /<script[^>]+(?:chart|d3|plotly)/i);
});

test('five-question contract, lenses, explanations, and reversal conditions are complete', () => {
  assert.equal(data.questions.length, 5);
  assert.deepEqual(data.lenses.map((item) => item.label), [
    'World', 'Europe / Netherlands', 'Selected countries'
  ]);
  const explanations = new Set(data.competingExplanations.map((item) => item.id));
  for (const id of ['composition', 'mode', 'closures', 'household', 'selection', 'demand', 'capacity']) {
    assert.ok(explanations.has(id), `missing explanation ${id}`);
  }
  assert.ok(data.reversalIndicators.length >= 6);
  for (const phrase of [
    /sustained recovery/i, /narrower.*gaps/i, /pathway evidence/i,
    /adult.*skill gains/i, /vacancies.*workload/i, /long-duration AI/i
  ]) assert.ok(data.reversalIndicators.some((item) => phrase.test(item)), `missing reversal ${phrase}`);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../../dist/signals/', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/real-time-ai.json', root), 'utf8'));
const html = await readFile(new URL('real-time-ai/index.html', dist), 'utf8');
const script = await readFile(new URL('real-time-ai/real-time-ai.js', root), 'utf8');
const css = await readFile(new URL('real-time-ai/real-time-ai.css', root), 'utf8');

const expectedStages = ['sense', 'interpret', 'predict', 'decide', 'act', 'observe'];
const expectedTiming = ['hard-real-time', 'operational-real-time', 'interactive-real-time', 'near-real-time', 'offline-intelligence'];
const expectedMaturity = ['demonstrated', 'operational', 'reliable', 'approved', 'scaled'];
const sourceFields = [
  'institution', 'title', 'date', 'url', 'geographyPopulation', 'period',
  'deadline', 'intendedUse', 'denominatorUnit', 'evidenceType', 'role',
  'interpretation', 'caveat'
];
const caseFields = [
  'boundary', 'geographyPopulation', 'period', 'deadline', 'timingClass',
  'intendedUse', 'unitDenominator', 'interpretation', 'caveat',
  'humanFallback', 'failureBoundary'
];
const passportFields = [...caseFields, 'evidenceType'];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function attributeValue(fragment, attribute) {
  return fragment.match(new RegExp(`${attribute}="([^"]+)"`))?.[1];
}

test('real-time AI contract fixes six loop stages and five timing and maturity classes', () => {
  assert.deepEqual(data.loopStages.map((item) => item.id), expectedStages);
  assert.deepEqual(data.timingClasses.map((item) => item.id), expectedTiming);
  assert.deepEqual(data.maturityStates.map((item) => item.id), expectedMaturity);
  assert.equal(new Set(data.loopStages.map((item) => item.id)).size, 6);
  assert.equal(new Set(data.timingClasses.map((item) => item.id)).size, 5);
  assert.equal(new Set(data.maturityStates.map((item) => item.id)).size, 5);
});

test('six bounded cases retain loop, scope, deadline, intended use, and independent maturity flags', () => {
  assert.equal(data.cases.length, 6);
  const sourceIds = new Set(data.sources.map((source) => source.id));
  for (const item of data.cases) {
    caseFields.forEach((field) => assert.ok(item[field], `${item.id} missing ${field}`));
    assert.deepEqual(Object.keys(item.stages), expectedStages, `${item.id} stage order changed`);
    assert.deepEqual(Object.keys(item.maturity), expectedMaturity, `${item.id} maturity order changed`);
    assert.ok(expectedTiming.includes(item.timingClass));
    assert.ok(Object.values(item.stages).every((value) => ['closed', 'bounded', 'open'].includes(value)));
    assert.ok(Object.values(item.maturity).every((value) => ['supported', 'unknown', 'not-applicable'].includes(value)));
    assert.ok(item.sourceIds.length);
    item.sourceIds.forEach((id) => assert.ok(sourceIds.has(id), `${item.id} unknown source ${id}`));
  }
  assert.ok(data.cases.some((item) => Object.values(item.maturity).includes('unknown')));
  assert.ok(data.cases.some((item) => Object.values(item.maturity).includes('not-applicable')));
});

test('source ledger is complete, secure, unique, and avoids maturity laundering', () => {
  const ids = new Set();
  const urls = new Set();
  for (const source of data.sources) {
    assert.ok(!ids.has(source.id), `duplicate source id ${source.id}`);
    assert.ok(!urls.has(source.url), `duplicate source URL ${source.url}`);
    ids.add(source.id);
    urls.add(source.url);
    sourceFields.forEach((field) => assert.ok(source[field], `${source.id} missing ${field}`));
    assert.match(source.url, /^https:\/\//);
  }
  assert.match(data.method.maturityRule, /benchmark accuracy does not prove field reliability/i);
  assert.match(data.method.maturityRule, /authorization does not prove scale/i);
  assert.match(data.method.maturityRule, /scale does not prove safety/i);
  assert.match(data.method.unknownRule, /unknown is not failed/i);
});

test('MLPerf vision scope and open-state text retain reviewed accessible wording', () => {
  const visionCase = data.cases.find((item) => item.id === 'object-identification');
  const visionSource = data.sources.find((item) => item.id === 'mlperf-vision');
  assert.match(visionCase.geographyPopulation, /^ImageNet-2012 and OpenImages /);
  assert.match(visionSource.geographyPopulation, /^ImageNet-2012 and OpenImages /);
  assert.doesNotMatch(`${JSON.stringify(data)}${html}`, /ImageNet and COCO-derived/);
  assert.doesNotMatch(css, /#555d5b|#5c6462/i);
});

test('evidence vocabulary and position-removal threshold stay explicit', () => {
  assert.deepEqual(data.evidenceVocabulary, [
    'observation', 'exposure estimate', 'association', 'experiment',
    'forecast', 'scenario', 'editorial judgment', 'hypothesis', 'normative question'
  ]);
  assert.match(data.method.positionRemovalRule, /full-loop coverage/i);
  for (const requirement of ['reliable operation', 'authority', 'integration', 'economics', 'exception handling']) {
    assert.match(data.method.positionRemovalRule, new RegExp(requirement));
  }
  assert.ok(data.possibilities.every((item) => ['hypothesis', 'normative question'].includes(item.type)));
});

test('static field map fully reconciles every row with JSON', () => {
  assert.match(html, /id="case-matrix-table"/);
  for (const item of data.cases) {
    const start = html.indexOf(`data-case-row="${item.id}"`);
    assert.ok(start >= 0, `${item.id} missing static table row`);
    const row = html.slice(start, html.indexOf('</tr>', start));
    assert.equal(attributeValue(row, 'data-case-row'), item.id, `${item.id} row selector mismatch`);
    assert.equal(attributeValue(row, 'data-case-select'), item.id, `${item.id} button selector mismatch`);
    assert.equal(attributeValue(row, 'data-timing'), item.timingClass, `${item.id} timing attribute mismatch`);
    assert.equal(attributeValue(row, 'data-source-id'), item.sourceIds.join(' '), `${item.id} source IDs mismatch`);
    assert.match(row, new RegExp(`<button[^>]+>${escapeRegex(item.label)}</button>`), `${item.id} label mismatch`);
    assert.match(row, new RegExp(`<code>${escapeRegex(item.timingClass)}</code>`), `${item.id} timing label mismatch`);
    assert.deepEqual(
      [...row.matchAll(/<td data-state="([^"]+)">/g)].map((match) => match[1]),
      expectedStages.map((key) => item.stages[key]),
      `${item.id} stage values mismatch`
    );
    assert.deepEqual(
      [...row.matchAll(/<i data-value="([^"]+)">/g)].map((match) => match[1]),
      expectedMaturity.map((key) => item.maturity[key]),
      `${item.id} maturity values mismatch`
    );
  }
});

test('six complete static case passports reconcile every evidence field with JSON', () => {
  assert.equal((html.match(/data-case-passport="/g) || []).length, 6);
  for (const item of data.cases) {
    const start = html.indexOf(`data-case-passport="${item.id}"`);
    assert.ok(start >= 0, `${item.id} missing static passport`);
    const passport = html.slice(start, html.indexOf('</details>', start));
    assert.equal(attributeValue(passport, 'data-source-ids'), item.sourceIds.join(' '), `${item.id} passport source IDs mismatch`);
    assert.match(passport, new RegExp(`<summary>${escapeRegex(item.label)}</summary>`), `${item.id} passport label mismatch`);
    for (const field of passportFields) {
      const match = passport.match(new RegExp(`<dd data-passport-field="${field}">([\\s\\S]*?)</dd>`));
      assert.ok(match, `${item.id} passport missing ${field}`);
      assert.equal(match[1], item[field], `${item.id} passport ${field} mismatch`);
    }
  }
});

test('page preserves substantive no-JS evidence and progressive interaction', () => {
  for (const id of ['where', 'direction', 'distribution', 'explanations', 'change', 'feedback', 'possibilities', 'sources']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /Sense[\s\S]*Interpret[\s\S]*Predict[\s\S]*Decide[\s\S]*Act[\s\S]*Observe/);
  assert.match(html, /Unknown is not failed/);
  assert.match(html, /Approval may be N\/A/);
  assert.match(html, /<noscript>/);
  assert.match(html, /human fallback/i);
  assert.match(html, /failure boundary/i);
  assert.match(script, /data\/real-time-ai\.json/);
  assert.match(script, /aria-pressed/);
  assert.match(script, /safeHttpsUrl/);
  assert.doesNotMatch(html, /<tr[^>]+tabindex=/);
  assert.doesNotMatch(script, /addEventListener\(['"]keydown/);
  assert.match(html, /id="timing-filter-status"[^>]+role="status"/);
  assert.match(script, /is-filter-match/);
  assert.doesNotMatch(script, /is-dimmed/);
  assert.doesNotMatch(css, /opacity:\s*\.22|is-dimmed/);
  assert.doesNotMatch(script, /chart\.js|d3\.js|plotly|https?:\/\//i);
});

test('verdict separates bounded-operation evidence from NIST methodology caution', () => {
  const verdictStart = html.indexOf('aria-label="Current verdict"');
  const verdict = html.slice(verdictStart, html.indexOf('</aside>', verdictStart));
  for (const id of ['ca-dmv-permits', 'fda-idx-dr', 'jhm-retina', 'amazon-robin']) {
    assert.match(verdict, new RegExp(`data-citation-source-id="[^"]*${id}`));
  }
  assert.match(verdict, /methodology and risk caution[\s\S]*data-citation-source-id="nist-ai-rmf"|data-citation-source-id="nist-ai-rmf"[\s\S]*methodology and risk caution/i);
  assert.equal(data.cases.find((item) => item.id === 'retinal-screening').evidenceType, 'observation');
  assert.equal(data.sources.find((item) => item.id === 'idx-pivotal').evidenceType, 'observation');
  assert.equal(data.sources.find((item) => item.id === 'jhm-retina').date, 'July 22, 2024; correction August 23, 2024');
});

test('page makes no visitor-time evidence or external chart calls', () => {
  const fetches = [...script.matchAll(/fetch\(([^)]+)\)/g)].map((match) => match[1]);
  assert.deepEqual(fetches, ['DATA_URL']);
  assert.doesNotMatch(html, /<script[^>]+src="https:\/\//i);
  assert.doesNotMatch(html, /vercel|api\.|graphql/i);
});

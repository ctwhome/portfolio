import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../../dist/signals/', import.meta.url);
const pages = [
  ['ai-work/index.html', 'data/ai-jobs.json'],
  ['food/index.html', 'data/food-system.json'],
  ['housing/index.html', 'data/housing.json'],
  ['science/index.html', 'data/science.json'],
  ['healthspan/index.html', 'data/healthspan.json'],
  ['real-time-ai/index.html', 'data/real-time-ai.json']
];
const newPages = [
  ['demography/index.html', 'data/demography.json', 'demography/demography.js'],
  ['education/index.html', 'data/education.json', 'education/education.js'],
  ['financial-fragility/index.html', 'data/financial-fragility.json', 'financial-fragility/financial-fragility.js']
];

function idsFrom(html, attribute) {
  return [...html.matchAll(new RegExp(`${attribute}="([^"]+)"`, 'g'))]
    .flatMap((match) => match[1].trim().split(/\s+/));
}

for (const [pagePath, dataPath] of pages) {
  test(`${pagePath} evidence components have valid proximate citations and ledger targets`, async () => {
    const html = await readFile(new URL(pagePath, dist), 'utf8');
    const data = JSON.parse(await readFile(new URL(dataPath, root), 'utf8'));
    const known = new Set(data.sources.map((source) => source.id));
    const evidenceIds = idsFrom(html, 'data-source-id');
    const citationIds = idsFrom(html, 'data-citation-source-id');

    assert.ok(evidenceIds.length, `${pagePath} has no semantic evidence markers`);
    assert.equal(citationIds.length, evidenceIds.length, `${pagePath} evidence/citation label count differs`);
    assert.deepEqual([...citationIds].sort(), [...evidenceIds].sort(), `${pagePath} evidence and citation sources diverge`);

    for (const id of citationIds) {
      assert.ok(known.has(id), `${pagePath} cites unknown source ${id}`);
      assert.match(html, new RegExp(`id="source-${id}"`), `${pagePath} lacks ledger target for ${id}`);
    }

    for (const match of html.matchAll(/<(?:p|footer|a)\b[^>]*data-citation-source-id="[^"]+"[^>]*>[\s\S]*?<\/(?:p|footer|a)>/g)) {
      const citation = match[0];
      assert.match(citation, /(?:Source(?:s)?|Evidence basis):/i, `${pagePath} citation lacks source label`);
      assert.match(citation, /href="https:\/\//, `${pagePath} citation lacks direct HTTPS source`);
      assert.match(citation, /target="_blank"/);
      assert.match(citation, /rel="noreferrer"/);
    }
  });
}

for (const [pagePath, dataPath, scriptPath] of newPages) {
  test(`${pagePath} resolves every evidence marker through a proximate HTTPS citation and source ledger`, async () => {
    const html = await readFile(new URL(pagePath, dist), 'utf8');
    const data = JSON.parse(await readFile(new URL(dataPath, root), 'utf8'));
    const script = await readFile(new URL(scriptPath, root), 'utf8');
    const known = new Set(data.sources.map((source) => source.id));
    const evidenceIds = idsFrom(html, 'data-source-id');
    const citationIds = idsFrom(html, 'data-citation-source-id');

    assert.ok(evidenceIds.length, `${pagePath} has no semantic evidence markers`);
    assert.equal(citationIds.length, evidenceIds.length, `${pagePath} evidence/citation source count differs`);
    assert.deepEqual([...citationIds].sort(), [...evidenceIds].sort(), `${pagePath} evidence and proximate citation sources diverge`);

    for (const source of data.sources) {
      assert.match(source.url, /^https:\/\//, `${pagePath} ledger source ${source.id} is not HTTPS`);
    }
    for (const id of evidenceIds) {
      assert.ok(known.has(id), `${pagePath} cites unknown source ${id}`);
      const staticTarget = new RegExp(`id="source-${id}"`).test(html);
      const dynamicTarget = /`source-\$\{source\.id\}`/.test(script);
      assert.ok(staticTarget || dynamicTarget, `${pagePath} lacks ledger resolution for ${id}`);
    }

    const citations = [...html.matchAll(/<(?:p|footer)\b[^>]*data-citation-source-id="[^"]+"[^>]*>[\s\S]*?<\/(?:p|footer)>/g)];
    assert.ok(citations.length, `${pagePath} has no proximate citation strips`);
    for (const match of citations) {
      assert.match(match[0], /(?:Source(?:s)?|Evidence basis):/i, `${pagePath} citation lacks source label`);
      assert.match(match[0], /href="https:\/\//, `${pagePath} citation lacks direct HTTPS source`);
      assert.match(match[0], /target="_blank"/);
      assert.match(match[0], /rel="noreferrer"/);
    }
    assert.match(script, /safeHttpsUrl/);
  });
}

test('dynamic series switchers update source identity, external URL, and ledger anchor together', async () => {
  for (const path of ['dashboard.js', 'science/science.js', 'healthspan/healthspan.js']) {
    const script = await readFile(new URL(path, root), 'utf8');
    assert.match(script, /citation\.dataset\.citationSourceId\s*=\s*(?:config|series)\.sourceId/);
    assert.match(script, /source-\$\{(?:config|series)\.sourceId\}/);
    assert.match(script, /safeHttpsUrl\(source(?:\?)*\.url\)/);
  }
});

test('Science publication labels, periods, counts, shares, and static tables reconcile', async () => {
  const html = await readFile(new URL('science/index.html', dist), 'utf8');
  const data = JSON.parse(await readFile(new URL('data/science.json', root), 'utf8'));
  const ai = data.aiPublications;
  assert.equal(ai.period, '2013–2024');
  assert.equal(ai.observations.length, 12);
  assert.equal(ai.sourceId, 'stanford-ai-publications');
  assert.equal(ai.latestGrowthPercent, 6.3);
  assert.equal(Math.round((ai.observations.at(-1).count / ai.observations.at(-2).count - 1) * 1000) / 10, 6.3);
  assert.match(data.sources.find((source) => source.id === ai.sourceId).institution, /Stanford/);
  for (const row of ai.observations) {
    assert.match(html, new RegExp(`<th scope="row">${row.year}</th><td>${row.count.toLocaleString('en-US')}</td><td>${(row.share * 100).toFixed(2)}%</td>`));
  }
  const globalRows = data.series.journalArticles.observations.WLD;
  assert.equal(globalRows.length, 24);
  for (const row of globalRows) {
    assert.match(html, new RegExp(`<th scope="row">${row.year}</th><td>${Math.round(row.value).toLocaleString('en-US')}</td>`));
  }
});

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = new URL(entry.name, directory);
    if (entry.isDirectory()) return filesBelow(new URL(`${entry.name}/`, directory));
    return [path];
  }));
  return nested.flat();
}

function visibleMainText(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, 'main element missing');
  return main
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function readableMainText(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, 'main element missing');
  const named = { amp: '&', copy: '©', euro: '€', ndash: '–', lt: '<' };
  return main
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&(amp|copy|euro|ndash|lt);/g, (_, name) => named[name])
    .replace(/\s+/g, ' ')
    .trim();
}

test('Astro emits directory routes with canonical metadata and preserved homepage copy', async () => {
  const [home, portfolio] = await Promise.all([
    readFile(new URL('index.html', dist), 'utf8'),
    readFile(new URL('portfolio/index.html', dist), 'utf8')
  ]);
  assert.match(home, /<link rel="canonical" href="https:\/\/ctw\.studio\/">/);
  assert.match(portfolio, /<link rel="canonical" href="https:\/\/ctw\.studio\/portfolio\/">/);
  assert.equal(
    sha256(visibleMainText(home)),
    'd67f001f7bc23f8d78f25fc830dce8ae7c11dd672d24d227d6b2c228ccf402e2'
  );
  assert.match(home, /Software for research and society/);
  assert.match(portfolio, /Research software as cultural practice/);
  assert.match(portfolio, /<dialog[^>]+data-project-dialog="data-storytelling"/);
  assert.match(portfolio, /<a class="ctw-button" href="\/nlesc\/" data-astro-reload(?:="true")?>Visit project ↗<\/a>/);
});

test('Astro emits all ten Signals routes with shared reload navigation and canonical metadata', async () => {
  const routes = [
    '',
    'ai-work/',
    'food/',
    'housing/',
    'healthspan/',
    'real-time-ai/',
    'demography/',
    'education/',
    'science/',
    'financial-fragility/'
  ];

  for (const route of routes) {
    const html = await readFile(new URL(`signals/${route}index.html`, dist), 'utf8');
    const pathname = `/signals/${route}`;
    assert.match(html, new RegExp(`<link rel="canonical" href="https://ctw\\.studio${pathname.replaceAll('/', '\\/')}">`));
    assert.match(html, new RegExp(`<meta property="og:url" content="https://ctw\\.studio${pathname.replaceAll('/', '\\/')}">`));
    assert.match(html, /<meta property="og:type" content="(?:article|website)">/);
    assert.equal((html.match(/<nav class="subject-menu\b/g) ?? []).length, 1, `${pathname} subject menu`);
    assert.equal((html.match(/class="subject-menu__option/g) ?? []).length, 10, `${pathname} subject options`);
    assert.match(html, /href="\/signals\/" data-astro-reload(?:="true")?>Signals \//);
    assert.match(html, /src="\/signals\/subject-menu\.js" defer/);
    assert.doesNotMatch(html, /(?:src="[^"]*)?nav\.js|data-active="signals"/);
  }
});

test('all 16 maintained routes share metadata and exclude legacy navigation', async () => {
  const routes = [
    ['index.html', '/'],
    ['portfolio/index.html', '/portfolio/'],
    ['signals/index.html', '/signals/'],
    ['signals/ai-work/index.html', '/signals/ai-work/'],
    ['signals/demography/index.html', '/signals/demography/'],
    ['signals/education/index.html', '/signals/education/'],
    ['signals/financial-fragility/index.html', '/signals/financial-fragility/'],
    ['signals/food/index.html', '/signals/food/'],
    ['signals/healthspan/index.html', '/signals/healthspan/'],
    ['signals/housing/index.html', '/signals/housing/'],
    ['signals/real-time-ai/index.html', '/signals/real-time-ai/'],
    ['signals/science/index.html', '/signals/science/'],
    ['workshop/index.html', '/workshop/'],
    ['workshop/privacy/index.html', '/workshop/privacy/'],
    ['workshop/terms/index.html', '/workshop/terms/'],
    ['design-system/index.html', '/design-system/']
  ];

  for (const [file, pathname] of routes) {
    const html = await readFile(new URL(file, dist), 'utf8');
    const canonical = `https://ctw.studio${pathname}`;
    assert.match(html, /<meta name="description" content="[^"]+">/, pathname);
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`), pathname);
    assert.ok(html.includes(`<meta property="og:url" content="${canonical}">`), pathname);
    assert.doesNotMatch(html, /(?:src="[^"]*)?nav\.js/, pathname);
    assert.doesNotMatch(html, /fonts\.(?:googleapis|gstatic)\.com/, pathname);
  }
});

test('workshop, directory legal pages, and guide keep substantive accessible output', async () => {
  const [workshop, privacy, terms, guide] = await Promise.all([
    readFile(new URL('workshop/index.html', dist), 'utf8'),
    readFile(new URL('workshop/privacy/index.html', dist), 'utf8'),
    readFile(new URL('workshop/terms/index.html', dist), 'utf8'),
    readFile(new URL('design-system/index.html', dist), 'utf8')
  ]);

  for (const dotted of ['workshop/privacy.html', 'workshop/terms.html']) {
    await assert.rejects(access(new URL(dotted, dist)));
  }
  assert.match(workshop, /<main id="main-content">/);
  assert.match(workshop, /AI Literacy Workshop/);
  assert.match(workshop, /href="\/workshop\/privacy\/"/);
  assert.match(workshop, /href="\/workshop\/terms\/"/);
  assert.match(privacy, /<h1[^>]*>Privacy Notice<\/h1>/);
  assert.match(privacy, /id="data-controller"/);
  assert.match(terms, /<h1[^>]*>Terms &amp; Conditions<\/h1>/);
  assert.match(terms, /id="cancellation-policy"/);
  assert.match(guide, /<main id="main">/);
  assert.match(guide, /Design for decisions/);
  assert.match(guide, /<caption>All 23 deployed CTW Studio routes/);
  assert.doesNotMatch(guide, /<script\b/i);
  assert.deepEqual(
    [workshop, privacy, terms].map((html) => sha256(readableMainText(html))),
    [
      '223636cd0621b0faecac96daf762436d93d95727a58904b4c5a142a5e816fddc',
      '0c376840a864dfa48d2b4c2f0fdaef6c40bba9f220ca9b79ee58fc0e5107d818',
      'd2e8056c5c516032bb755fe53e88ad72499c0f120193c43fcc6adae9c00f5a11'
    ]
  );
});

test('preservation manifest has exact byte-identical output counterparts', async () => {
  const manifest = JSON.parse(await readFile(new URL('../preserve.manifest.json', import.meta.url), 'utf8'));
  const excludes = manifest.treeExcludes;
  const sourceEntries = [];

  async function walk(relativePath) {
    const sourcePath = new URL(`../${relativePath}`, import.meta.url);
    const info = await stat(sourcePath);
    if (info.isFile()) {
      if (!excludes.some((entry) => relativePath === entry || relativePath.startsWith(`${entry}/`))) {
        sourceEntries.push(relativePath);
      }
      return;
    }
    for (const entry of await readdir(sourcePath)) await walk(`${relativePath}/${entry}`);
  }

  for (const entry of [...manifest.files, ...manifest.trees]) await walk(entry);
  for (const entry of [...new Set(sourceEntries)]) {
    const [sourceBytes, outputBytes] = await Promise.all([
      readFile(new URL(`../${entry}`, import.meta.url)),
      readFile(new URL(entry, dist))
    ]);
    assert.equal(sha256(outputBytes), sha256(sourceBytes), entry);
  }
  assert.ok(sourceEntries.some((entry) => entry.startsWith('nlesc/')));
  assert.ok(sourceEntries.includes('signals/roadmap/index.html'));
  assert.ok(sourceEntries.includes('workshop/pitch/index.html'));
  assert.ok(sourceEntries.includes('workshop/slides/index.html'));
  assert.ok(!sourceEntries.includes('workshop/index.html'));
  assert.ok(!sourceEntries.includes('design-system/index.html'));
});

test('portfolio keeps stable media URLs and ships no Floating UI code', async () => {
  const portfolio = await readFile(new URL('portfolio/index.html', dist), 'utf8');
  const source = await readFile(new URL('../portfolio/projects.js', import.meta.url), 'utf8');
  const media = [...source.matchAll(/\b(?:coverImage|src|src2|pdfUrl): '([^']+)'/g)].map((match) => match[1]);
  for (const path of new Set(media)) {
    assert.match(portfolio, new RegExp(`/portfolio/${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  }

  const chunks = await filesBelow(new URL('_astro/', dist));
  const code = (await Promise.all(chunks.map((path) => readFile(path, 'utf8')))).join('\n');
  assert.doesNotMatch(code, /@floating-ui\/dom|computePosition|autoUpdate/);
});

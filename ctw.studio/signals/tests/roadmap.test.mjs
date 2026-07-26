import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const fallback = await readFile(new URL('roadmap/index.html', root), 'utf8');
const vercel = JSON.parse(await readFile(new URL('../vercel.json', root), 'utf8'));
const briefs = [
  ['ai-work', 'ai-work/index.html', '001', './'],
  ['food', 'food/index.html', '002', './'],
  ['housing', 'housing/index.html', '003', './'],
  ['science', 'science/index.html', '004', './'],
  ['healthspan', 'healthspan/index.html', '005', './'],
  ['real-time-ai', 'real-time-ai/index.html', '006', './'],
  ['demography', 'demography/index.html', '007', './'],
  ['education', 'education/index.html', '008', './'],
  ['financial-fragility', 'financial-fragility/index.html', '009', './']
];
const briefPages = await Promise.all(briefs.map(async ([route, path, briefId, activeDestination]) => ({
  route,
  briefId,
  activeDestination,
  html: await readFile(new URL(path, root), 'utf8')
})));

const topics = [
  'Housing &amp; affordability',
  'Prosperity',
  'Energy &amp; compute',
  'Healthspan &amp; care',
  'Demography, migration &amp; aging',
  'Democracy, trust &amp; information',
  'Science &amp; discovery',
  'Education &amp; human capability',
  'Financial fragility',
  'Global resilience'
];

test('Atlas homepage publishes all ten subjects in the agreed order', () => {
  const grid = html.match(/<ol class="atlas-grid">([\s\S]*?)<\/ol>/)?.[1] || '';
  const cardTopics = [...grid.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map((match) => match[1]);
  assert.deepEqual(cardTopics, topics);
});

test('Atlas homepage states the reusable evidence contract and geographic lenses', () => {
  for (const question of [
    'Where are we now?',
    'What direction are we moving?',
    'Who is benefiting or carrying the cost?',
    'What are the competing explanations?',
    'What evidence would change our current conclusion?'
  ]) {
    assert.match(html, new RegExp(question.replace(/[?]/g, '\\?')));
  }
  for (const lens of ['World', 'Europe / Netherlands', 'Selected countries']) {
    assert.match(html, new RegExp(lens));
  }
  assert.match(html, /What might this make possible\?/);
});

test('Atlas links all six atlas briefs and labels publication status honestly', () => {
  for (const route of ['housing', 'healthspan', 'demography', 'science', 'education', 'financial-fragility']) {
    assert.match(html, new RegExp(`href="${route}/"`));
  }
  for (const [route, card, id] of [
    ['demography', '05', '007'],
    ['education', '08', '008'],
    ['financial-fragility', '09', '009']
  ]) {
    assert.match(html, new RegExp(`href="${route}/"[\\s\\S]*?<span>${card}</span><small>Published · Brief ${id}</small>`));
  }
  assert.equal((html.match(/data-status="published"/g) || []).length, 6);
  assert.equal((html.match(/data-status="planned"/g) || []).length, 4);
  assert.match(html, /<strong>9<\/strong>\s*briefings published/i);
  assert.match(html, /<strong>6 of 10<\/strong>\s*atlas briefs published/i);
  assert.match(html, /<strong>4<\/strong>\s*atlas briefs planned/i);
});

test('the preferred six-topic order is explicitly a first wave, not the complete atlas', () => {
  assert.match(html, /Preferred first publication wave/i);
  assert.match(html, /six-topic sequence/i);
  assert.match(html, /complete atlas is not yet published/i);
  for (const planned of ['Prosperity', 'Energy', 'Democracy', 'Global resilience']) {
    assert.match(html, new RegExp(planned));
  }
  assert.match(html, /<strong>Healthspan<\/strong><small>Published<\/small>/);
  assert.match(html, /<strong>Demography<\/strong><small>Published<\/small>/);
  assert.match(html, /<strong>Science<\/strong><small>Published<\/small>/);
});

test('atlas and published foundations expose Briefs 001–009 plus Atlas navigation', () => {
  for (const label of [
    'AI &amp; work',
    'Food &amp; planet',
    'Housing',
    'Science',
    'Healthspan',
    'Real-time AI',
    'Demography',
    'Education',
    'Financial fragility',
    'Atlas'
  ]) {
    assert.match(html, new RegExp(label));
  }
  for (const number of Array.from({ length: 9 }, (_, index) => String(index + 1).padStart(3, '0'))) {
    assert.match(html, new RegExp(`Brief ${number}`));
  }
});

test('Atlas is first post-hero section and old roadmap routes redirect exactly', () => {
  assert.ok(html.indexOf('atlas-topics-section') < html.indexOf('atlas-standard'));
  assert.match(fallback, /name="robots" content="noindex,follow"/);
  assert.match(fallback, /rel="canonical" href="https:\/\/ctw\.studio\/signals\/"/);
  assert.match(fallback, /href="\/signals\/">Open the Signals Atlas/);
  assert.deepEqual(vercel.redirects.filter(({ source }) => source.startsWith('/signals/')), [
    { source: '/signals/roadmap', destination: '/signals/', permanent: true },
    { source: '/signals/roadmap/', destination: '/signals/', permanent: true }
  ]);
});

test('NLeSC legacy home routes redirect exactly', () => {
  assert.deepEqual(vercel.redirects.filter(({ source }) => source.startsWith('/nlesc/')), [
    { source: '/nlesc/home', destination: '/nlesc/', permanent: true },
    { source: '/nlesc/home/', destination: '/nlesc/', permanent: true }
  ]);
});

test('every published brief switcher exposes ten destinations in canonical order', () => {
  const labels = [
    'AI &amp; work',
    'Food',
    'Housing',
    'Science',
    'Healthspan',
    'Real-time AI',
    'Demography',
    'Education',
    'Financial fragility',
    'Atlas'
  ];
  const routes = briefs.map(([route]) => route);

  briefPages.forEach(({ route, briefId, activeDestination, html: page }) => {
    const start = page.search(/class="[^"]*(?:topic-switcher|evidence-topics)[^"]*"/);
    assert.ok(start >= 0, `${route} missing topic switcher`);
    const switcher = page.slice(start, start + 3000);
    let cursor = -1;
    labels.forEach((label) => {
      const next = switcher.indexOf(label);
      assert.ok(next > cursor, `${route} missing or reorders ${label}`);
      cursor = next;
    });
    const pills = [...switcher.matchAll(/<a\b([^>]*)class="([^"]*\btopic-pill\b[^"]*)"([^>]*)>/g)]
      .slice(0, 10);
    const hrefs = pills.map((match) => `${match[1]}${match[3]}`.match(/href="([^"]+)"/)?.[1]);
    const expected = routes.map((destination) => destination === route ? './' : `../${destination}/`);
    expected.push('../');
    assert.deepEqual(hrefs, expected, `${route} has incorrect switcher routes`);
    const activePills = pills.filter((match) =>
      /(?:^|\s)\S*active(?:\s|$)/.test(match[2]) ||
      /aria-current="page"/.test(`${match[1]}${match[3]}`)
    );
    assert.equal(activePills.length, 1, `${route} must have exactly one active/current topic pill`);
    assert.equal(
      `${activePills[0][1]}${activePills[0][3]}`.match(/href="([^"]+)"/)?.[1],
      activeDestination,
      `${route} active/current topic pill must link to itself`
    );
    assert.match(page, new RegExp(`Brief ${briefId}\\b`), `${route} missing Brief ${briefId}`);
  });
});

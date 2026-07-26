import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const fallback = await readFile(new URL('roadmap/index.html', root), 'utf8');
const vercel = JSON.parse(await readFile(new URL('../vercel.json', root), 'utf8'));
const subjectMenuCss = await readFile(new URL('subject-menu.css', root), 'utf8');
const subjectMenuJs = await readFile(new URL('subject-menu.js', root), 'utf8');

const subjects = [
  { label: 'Housing &amp; affordability', anchor: 'subject-housing-affordability', status: 'published', briefs: [['housing', '003']] },
  { label: 'Food, animals &amp; planet', anchor: 'subject-food-animals-planet', status: 'published', briefs: [['food', '002']] },
  { label: 'Healthspan &amp; care', anchor: 'subject-healthspan-care', status: 'published', briefs: [['healthspan', '005']] },
  { label: 'Work, education &amp; human capability', anchor: 'subject-work-education-human-capability', status: 'published', briefs: [['ai-work', '001'], ['education', '008']] },
  { label: 'Prosperity &amp; financial security', anchor: 'subject-prosperity-financial-security', status: 'published', briefs: [['financial-fragility', '009']] },
  { label: 'Energy, compute &amp; infrastructure', anchor: 'subject-energy-compute-infrastructure', status: 'planned', briefs: [] },
  { label: 'Demography, migration &amp; aging', anchor: 'subject-demography-migration-aging', status: 'published', briefs: [['demography', '007']] },
  { label: 'Democracy, trust &amp; information', anchor: 'subject-democracy-trust-information', status: 'planned', briefs: [] },
  { label: 'Science, discovery &amp; AI systems', anchor: 'subject-science-discovery-ai-systems', status: 'published', briefs: [['science', '004'], ['real-time-ai', '006']] },
  { label: 'Global resilience', anchor: 'subject-global-resilience', status: 'planned', briefs: [] }
];

const briefs = subjects.flatMap(({ anchor, briefs }) =>
  briefs.map(([route, briefId]) => ({ route, briefId, anchor }))
).sort((a, b) => a.briefId.localeCompare(b.briefId));

const briefPages = await Promise.all(briefs.map(async (brief) => ({
  ...brief,
  html: await readFile(new URL(`${brief.route}/index.html`, root), 'utf8')
})));

const expectedLabels = subjects.map(({ label }) => label);
const expectedHrefs = subjects.map(({ anchor }) => `/signals/#${anchor}`);

function topicPills(markup) {
  return [...markup.matchAll(/<a class="([^"]*\btopic-pill\b[^"]*)" href="([^"]+)"(?: aria-current="([^"]+)")?>([^<]+)<\/a>/g)]
    .map(([, classes, href, current, label]) => ({ classes, href, current, label }));
}

function atlasCard(anchor, nextAnchor) {
  const start = html.indexOf(`<li id="${anchor}"`);
  const end = nextAnchor ? html.indexOf(`<li id="${nextAnchor}"`, start) : html.indexOf('</ol>', start);
  assert.ok(start >= 0 && end > start, `missing Atlas card ${anchor}`);
  return html.slice(start, end);
}

test('Atlas publishes exact canonical ten-subject taxonomy and anchors', () => {
  const grid = html.match(/<ol class="atlas-grid">([\s\S]*?)<\/ol>/)?.[1] || '';
  const cards = [...grid.matchAll(/<li id="([^"]+)" class="[^"]*\batlas-card\b[^"]*" data-status="([^"]+)">[\s\S]*?<h3>([\s\S]*?)<\/h3>/g)]
    .map(([, anchor, status, label]) => ({ anchor, status, label }));

  assert.deepEqual(cards, subjects.map(({ anchor, status, label }) => ({ anchor, status, label })));
  assert.equal(new Set(cards.map(({ anchor }) => anchor)).size, 10);
});

test('Atlas cards expose every mapped brief separately and planned subjects honestly', () => {
  subjects.forEach(({ anchor, status, briefs: mappings }, index) => {
    const card = atlasCard(anchor, subjects[index + 1]?.anchor);
    const links = [...card.matchAll(/<a href="([^"]+)">Brief ([0-9]{3}) ·/g)]
      .map(([, href, briefId]) => [href.replace(/\/$/, ''), briefId]);

    assert.deepEqual(links, mappings, `${anchor} has incorrect brief links`);
    assert.equal(/Planned subject/.test(card), status === 'planned', `${anchor} has incorrect planned label`);
  });

  assert.equal((html.match(/data-status="published"/g) || []).length, 7);
  assert.equal((html.match(/data-status="planned"/g) || []).length, 3);
});

test('Atlas counters and subject wording report 9 briefs, 7 covered subjects and 3 planned', () => {
  assert.match(html, /<strong>9<\/strong>\s*published briefs/i);
  assert.match(html, /<strong>7 of 10<\/strong>\s*subjects with published coverage/i);
  assert.match(html, /<strong>3<\/strong>\s*subjects planned/i);
  assert.match(html, /canonical taxonomy for ten CTW Signals subjects/);
  assert.match(html, /Ten long-horizon subjects asking/);
  assert.doesNotMatch(html, /Ten long-horizon briefings/);
});

test('Atlas top navigation uses brand home plus exact subject anchors', () => {
  const nav = html.match(/<nav class="atlas-topics"[\s\S]*?<\/nav>/)?.[0] || '';
  assert.match(nav, /<a class="signals-home atlas-brand" href="\/signals\/">Signals \/<\/a>/);
  assert.deepEqual(
    [...nav.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(([, href, label]) => ({ href, label })),
    subjects.map(({ anchor, label }) => ({ href: `/signals/#${anchor}`, label }))
  );
  assert.doesNotMatch(nav, />Atlas<\/a>/);
});

test('every brief switcher is semantic and mirrors exact taxonomy, links and mapped current subject', () => {
  briefPages.forEach(({ route, anchor, briefId, html: page }) => {
    const nav = page.match(/<nav class="[^"]*(?:topic-switcher|evidence-topics)[^"]*"[\s\S]*?<\/nav>/)?.[0] || '';
    assert.ok(nav, `${route} missing semantic topic navigation`);
    assert.match(nav, /<a class="signals-home topic-switcher__label" href="\/signals\/">/);

    const pills = topicPills(nav);
    assert.deepEqual(pills.map(({ label }) => label), expectedLabels, `${route} subject order differs`);
    assert.deepEqual(pills.map(({ href }) => href), expectedHrefs, `${route} subject links differ`);

    const current = pills.filter(({ classes, current }) =>
      classes.split(/\s+/).includes('topic-pill--active') || current
    );
    assert.equal(current.length, 1, `${route} must have one mapped current subject`);
    assert.equal(current[0].href, `/signals/#${anchor}`, `${route} maps to wrong subject`);
    assert.equal(current[0].current, 'location', `${route} must use aria-current="location"`);
    assert.match(page, new RegExp(`Brief ${briefId}\\b`), `${route} missing Brief ${briefId}`);
  });
});

test('all taxonomy pages load shared progressive subject disclosure assets', () => {
  const pages = [{ route: 'atlas', html }, ...briefPages];

  pages.forEach(({ route, html: page }) => {
    const stylesheets = [...page.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>|<link\b[^>]*\bhref="([^"]+)"[^>]*\brel="stylesheet"[^>]*>/g)]
      .map((match) => match[1] || match[2])
      .filter((href) => /\.css(?:\?|$)/.test(href));
    assert.match(stylesheets.at(-1), /subject-menu\.css$/, `${route} must load subject menu CSS after page CSS`);
    assert.match(page, /<script defer src="(?:\.\.\/)?subject-menu\.js"><\/script>/, `${route} missing deferred subject menu script`);
  });

  assert.match(subjectMenuCss, /@media \(max-width: 760px\)/);
  assert.match(subjectMenuCss, /\.subject-menu__panel\[aria-hidden="false"\]/);
  assert.match(subjectMenuJs, /createElement\('button'\)/);
  assert.match(subjectMenuJs, /setAttribute\('aria-expanded'/);
  assert.match(subjectMenuJs, /setAttribute\('aria-controls'/);
  assert.match(subjectMenuJs, /getAttribute\('aria-current'\) === 'location'/);
  assert.match(subjectMenuJs, /\|\| 'Explore subjects'/);
  assert.match(subjectMenuJs, /event\.key === 'Escape'/);
});

test('first wave uses canonical vocabulary and truthful coverage state', () => {
  const section = html.match(/<section class="publication-path"[\s\S]*?<\/section>/)?.[0] || '';
  for (const label of [
    subjects[0].label,
    subjects[4].label,
    subjects[5].label,
    subjects[2].label,
    subjects[6].label,
    subjects[8].label
  ]) {
    assert.match(section, new RegExp(label));
  }
  assert.match(section, /Coverage is a foundation, not completion/);
  assert.doesNotMatch(section, /<small>Next<\/small>|Prosperity[^<]*Next/i);
});

test('published foundations preserve Briefs 001–009 and existing URLs', () => {
  const foundations = html.match(/<section class="published-foundations"[\s\S]*?<\/section>/)?.[0] || '';
  for (const { route, briefId } of briefs) {
    assert.match(foundations, new RegExp(`<a href="${route}/"><span>Brief ${briefId}</span>`));
  }
  assert.deepEqual(briefs.map(({ briefId }) => briefId), Array.from({ length: 9 }, (_, index) => String(index + 1).padStart(3, '0')));
});

test('Atlas evidence contract and geographic lenses remain intact', () => {
  for (const text of [
    'Where are we now?',
    'What direction are we moving?',
    'Who is benefiting or carrying the cost?',
    'What are the competing explanations?',
    'What evidence would change our current conclusion?',
    'World',
    'Europe / Netherlands',
    'Selected countries',
    'What might this make possible?'
  ]) {
    assert.match(html, new RegExp(text.replace(/[?]/g, '\\?')));
  }
});

test('Atlas remains homepage and legacy roadmap redirects remain exact', () => {
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

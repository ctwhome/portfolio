import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const fallback = await readFile(new URL('roadmap/index.html', root), 'utf8');
const vercel = JSON.parse(await readFile(new URL('../vercel.json', root), 'utf8'));
const atlasCss = await readFile(new URL('atlas.css', root), 'utf8');
const subjectMenuCss = await readFile(new URL('subject-menu.css', root), 'utf8');
const subjectMenuJs = await readFile(new URL('subject-menu.js', root), 'utf8');
const pageCssFiles = (await readdir(root, { recursive: true }))
  .filter((file) => file.endsWith('.css') && file !== 'subject-menu.css');
const pageCss = await Promise.all(pageCssFiles.map(async (file) => ({
  file,
  css: await readFile(new URL(file, root), 'utf8')
})));

const subjects = [
  { label: 'Housing &amp; affordability', anchor: 'subject-housing-affordability', route: '/signals/housing/', status: 'published', briefs: [['housing', '003']] },
  { label: 'Food, animals &amp; planet', anchor: 'subject-food-animals-planet', route: '/signals/food/', status: 'published', briefs: [['food', '002']] },
  { label: 'Healthspan &amp; care', anchor: 'subject-healthspan-care', route: '/signals/healthspan/', status: 'published', briefs: [['healthspan', '005']] },
  { label: 'Work, education &amp; human capability', anchor: 'subject-work-education-human-capability', route: '/signals/ai-work/', status: 'published', briefs: [['ai-work', '001'], ['education', '008']] },
  { label: 'Prosperity &amp; financial security', anchor: 'subject-prosperity-financial-security', route: '/signals/financial-fragility/', status: 'published', briefs: [['financial-fragility', '009']] },
  { label: 'Energy, compute &amp; infrastructure', anchor: 'subject-energy-compute-infrastructure', route: null, status: 'planned', briefs: [] },
  { label: 'Demography, migration &amp; aging', anchor: 'subject-demography-migration-aging', route: '/signals/demography/', status: 'published', briefs: [['demography', '007']] },
  { label: 'Democracy, trust &amp; information', anchor: 'subject-democracy-trust-information', route: null, status: 'planned', briefs: [] },
  { label: 'Science, discovery &amp; AI systems', anchor: 'subject-science-discovery-ai-systems', route: '/signals/science/', status: 'published', briefs: [['science', '004'], ['real-time-ai', '006']] },
  { label: 'Global resilience', anchor: 'subject-global-resilience', route: null, status: 'planned', briefs: [] }
];

const briefs = subjects.flatMap(({ route: subjectRoute, briefs }) =>
  briefs.map(([route, briefId]) => ({ route, briefId, subjectRoute }))
).sort((a, b) => a.briefId.localeCompare(b.briefId));

const briefPages = await Promise.all(briefs.map(async (brief) => ({
  ...brief,
  html: await readFile(new URL(`${brief.route}/index.html`, root), 'utf8')
})));

const expectedLabels = subjects.map(({ label }) => label);
const expectedRoutes = subjects.map(({ route }) => route);
const placementClasses = new Map([
  ['atlas', 'atlas-topics'],
  ['ai-work', 'topic-switcher'],
  ['food', 'topic-switcher'],
  ['housing', 'housing-topics'],
  ['science', 'evidence-topics'],
  ['healthspan', 'evidence-topics'],
  ['real-time-ai', 'evidence-topics'],
  ['demography', 'evidence-topics'],
  ['education', 'evidence-topics'],
  ['financial-fragility', 'fragility-topics']
]);
const legacyNavClasses = [
  'topic-pill',
  'topic-pill--active',
  'atlas-brand',
  'topic-switcher__label',
  'food-active',
  'active',
  'housing-active',
  'fragility-active'
];

function subjectOptions(markup) {
  const options = [];
  const pattern = /<a class="([^"]*\bsubject-menu__option\b[^"]*)" href="([^"]+)"(?: aria-current="([^"]+)")?>([^<]+)<\/a>|<span class="([^"]*\bsubject-menu__option--planned\b[^"]*)">([^<]+) <span class="subject-menu__badge">Planned<\/span><\/span>/g;

  for (const match of markup.matchAll(pattern)) {
    const [, classes = '', href, current, linkLabel, plannedClasses, plannedLabel] = match;
    options.push({
      classes: href ? classes : plannedClasses,
      current,
      label: href ? linkLabel : plannedLabel,
      route: href || null,
      tag: href ? 'a' : 'span',
      markup: match[0]
    });
  }
  return options;
}

function subjectNav(markup) {
  return markup.match(/<nav class="[^"]*\bsubject-menu\b[^"]*"[\s\S]*?<\/nav>/)?.[0] || '';
}

function assertStaticContract(route, markup) {
  const nav = subjectNav(markup);
  assert.ok(nav, `${route} missing subject menu`);

  const navClasses = nav.match(/^<nav class="([^"]+)"/)?.[1].split(/\s+/) || [];
  assert.deepEqual(navClasses, ['subject-menu', placementClasses.get(route)], `${route} has wrong nav classes`);
  assert.match(nav, /<a class="subject-menu__brand" href="\/signals\/">Signals \/<\/a>/);
  for (const legacyClass of legacyNavClasses) {
    assert.doesNotMatch(nav, new RegExp(`class="[^"]*\\b${legacyClass}\\b`), `${route} retains ${legacyClass}`);
  }

  const options = subjectOptions(nav);
  assert.deepEqual(options.map(({ label }) => label), expectedLabels, `${route} subject order differs`);
  assert.deepEqual(options.map(({ route: optionRoute }) => optionRoute), expectedRoutes, `${route} subject routes differ`);
  assert.equal(options.length, 10, `${route} must have ten options`);
  assert.equal(options.filter(({ tag }) => tag === 'a').length, 7, `${route} must have seven subject links`);
  assert.equal(options.filter(({ tag }) => tag === 'span').length, 3, `${route} must have three planned rows`);
  return { nav, options };
}

function cssRule(selector) {
  return subjectMenuCss.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`))?.[1] || '';
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

test('Atlas top navigation uses exact canonical routes and native planned rows', () => {
  const { nav, options } = assertStaticContract('atlas', html);
  assert.equal(options.filter(({ current }) => current).length, 0);
  assert.doesNotMatch(nav, />Atlas<\/a>/);
});

test('every brief switcher mirrors exact routes, planned rows and mapped current subject', () => {
  briefPages.forEach(({ route, subjectRoute, briefId, html: page }) => {
    const { options } = assertStaticContract(route, page);
    const current = options.filter(({ current }) => current);
    assert.equal(current.length, 1, `${route} must have one mapped current subject`);
    assert.equal(current[0].tag, 'a', `${route} current subject must be a link`);
    assert.equal(current[0].route, subjectRoute, `${route} maps to wrong subject`);
    assert.equal(current[0].current, 'location', `${route} must use aria-current="location"`);
    assert.match(page, new RegExp(`Brief ${briefId}\\b`), `${route} missing Brief ${briefId}`);
  });
});

test('planned subject rows stay visibly native and noninteractive on every navigation copy', () => {
  for (const { route, html: page } of [{ route: 'atlas', html }, ...briefPages]) {
    const nav = subjectNav(page);
    const planned = subjectOptions(nav).filter(({ tag }) => tag === 'span');

    assert.equal(planned.length, 3, `${route} planned-row count differs`);
    for (const option of planned) {
      assert.match(option.markup, /<span class="subject-menu__badge">Planned<\/span>/);
      assert.doesNotMatch(option.markup, /\b(?:href|role|tabindex|onclick|aria-disabled)=/i);
    }
  }
  assert.match(cssRule('.subject-menu__option--planned'), /pointer-events:\s*none/);
  assert.match(cssRule('.subject-menu__option--planned'), /cursor:\s*default/);
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
  assert.match(cssRule('.subject-menu'), /--subject-menu-border:\s*rgba\(255, 255, 255, 0\.36\)/);
  assert.match(cssRule('.subject-menu'), /--subject-menu-accent:\s*#f7b500/);
  assert.match(cssRule('.subject-menu'), /--subject-menu-accent-soft:\s*rgba\(247, 181, 0, 0\.11\)/);
  assert.match(cssRule('.subject-menu'), /--subject-menu-focus:\s*var\(--ctw-color-focus, #f7b500\)/);
  assert.match(cssRule('.subject-menu'), /--subject-menu-font:\s*Inter,\s*system-ui,\s*-apple-system,\s*BlinkMacSystemFont,\s*"Segoe UI",\s*sans-serif/);
  assert.match(cssRule('.subject-menu'), /display:\s*flex/);
  assert.match(cssRule('.subject-menu'), /flex-wrap:\s*wrap/);
  assert.match(cssRule('.subject-menu'), /align-items:\s*center/);
  assert.match(cssRule('.subject-menu'), /gap:\s*0\.65rem/);
  assert.match(cssRule('.subject-menu .subject-menu__option'), /padding:\s*0\.42rem 0\.75rem/);
  assert.match(cssRule('.subject-menu .subject-menu__option'), /border-radius:\s*999px/);
  assert.match(cssRule('html:not(.subject-menu-ready) .subject-menu'), /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(cssRule('html:not(.subject-menu-ready) .subject-menu .subject-menu__option'), /min-height:\s*44px/);
  assert.match(cssRule('html:not(.subject-menu-ready) .subject-menu .subject-menu__option'), /overflow-wrap:\s*anywhere/);
  assert.match(cssRule('.subject-menu__badge'), /white-space:\s*nowrap/);
  assert.match(cssRule('.subject-menu__option[aria-current="location"]'), /color:\s*var\(--subject-menu-accent\)/);
  for (const selector of [
    '.subject-menu-ready .subject-menu__trigger',
    '.subject-menu-ready .subject-menu__panel',
    '.subject-menu-ready .subject-menu__panel > .subject-menu__option'
  ]) {
    const rule = cssRule(selector);
    assert.match(rule, /font:\s*500 1rem\/1\.35 var\(--subject-menu-font\)/);
    assert.match(rule, /color:\s*var\(--subject-menu-text\)/);
    assert.match(rule, /letter-spacing:\s*normal/);
    assert.match(rule, /text-transform:\s*none/);
    if (!selector.endsWith('__panel')) assert.match(rule, /transition:\s*none/);
    assert.doesNotMatch(rule, /(?:font|color):\s*inherit/);
  }
  const currentRule = cssRule('.subject-menu-ready .subject-menu__panel a[aria-current="location"]');
  assert.match(currentRule, /background:\s*var\(--subject-menu-accent-soft\)/);
  assert.match(currentRule, /border-color:\s*var\(--subject-menu-accent\)/);
  assert.match(currentRule, /color:\s*var\(--subject-menu-accent\)/);
  assert.match(currentRule, /box-shadow:\s*inset [^;]*var\(--subject-menu-accent\)/);
  const focusRule = cssRule('.subject-menu-ready .subject-menu__panel a:focus-visible');
  assert.match(focusRule, /border-color:\s*var\(--subject-menu-focus\)/);
  assert.match(focusRule, /color:\s*var\(--subject-menu-text\)/);
  assert.match(focusRule, /outline:\s*3px solid var\(--subject-menu-focus\)/);
  const hoverRule = cssRule('.subject-menu-ready .subject-menu__panel a:not([aria-current="location"]):hover');
  assert.match(hoverRule, /background:\s*rgba\(255, 255, 255, 0\.07\)/);
  assert.match(hoverRule, /border-color:\s*var\(--subject-menu-border\)/);
  assert.match(hoverRule, /color:\s*var\(--subject-menu-text\)/);
  const plannedRule = cssRule('.subject-menu-ready .subject-menu__panel > .subject-menu__option--planned');
  assert.match(plannedRule, /color:\s*color-mix\(in srgb, var\(--subject-menu-text\) 65%, transparent\)/);
  assert.match(plannedRule, /cursor:\s*default/);
  assert.match(cssRule('.subject-menu__option--planned'), /pointer-events:\s*none/);
  assert.doesNotMatch(subjectMenuCss, /!important/);
  assert.match(cssRule('.subject-menu-ready .subject-menu__trigger'), /border-radius:\s*999px/);
  assert.match(cssRule('.subject-menu-ready .subject-menu__panel'), /border-radius:\s*1rem/);
  assert.match(cssRule('.subject-menu-ready .subject-menu__panel'), /box-shadow:\s*0 1rem 3rem rgba\(0, 0, 0, 0\.5\)/);
  assert.match(cssRule('.subject-menu-ready .subject-menu__panel > .subject-menu__option'), /border-radius:\s*0\.65rem/);
  const atlasMenuRule = cssRule('.roadmap-page .subject-menu');
  assert.match(atlasMenuRule, /--subject-menu-accent:\s*var\(--ctw-accent-cyan, #57d7ff\)/);
  assert.match(atlasMenuRule, /--subject-menu-accent-soft:\s*color-mix\(in srgb, var\(--subject-menu-accent\) 11%, transparent\)/);
  assert.match(cssRule('.roadmap-page.subject-menu-ready .subject-menu__trigger'), /border-radius:\s*2px/);
  assert.match(cssRule('.roadmap-page.subject-menu-ready .subject-menu__panel'), /border-radius:\s*2px/);
  assert.match(cssRule('.roadmap-page.subject-menu-ready .subject-menu__panel'), /box-shadow:\s*none/);
  assert.match(cssRule('.roadmap-page.subject-menu-ready .subject-menu__panel > .subject-menu__option'), /border-radius:\s*0/);
  assert.match(subjectMenuJs, /createElement\('button'\)/);
  assert.match(subjectMenuJs, /setAttribute\('aria-expanded'/);
  assert.match(subjectMenuJs, /setAttribute\('aria-controls'/);
  assert.match(subjectMenuJs, /querySelectorAll\('\.subject-menu'\)/);
  assert.match(subjectMenuJs, /subjectMenuEnhanced === 'true'/);
  assert.match(subjectMenuJs, /subjectMenuEnhanced = 'true'/);
  assert.match(subjectMenuJs, /option\.matches\('\.subject-menu__option'\)/);
  assert.match(subjectMenuJs, /options\.length !== 10/);
  assert.match(subjectMenuJs, /option\.matches\('a\[aria-current="location"\]'\)/);
  assert.match(subjectMenuJs, /options\.forEach\(\(option\) => panel\.append\(option\)\)/);
  assert.match(subjectMenuJs, /\|\| 'Explore subjects'/);
  assert.match(subjectMenuJs, /event\.target\.closest\('a'\)/);
  assert.match(subjectMenuJs, /event\.key === 'Escape'/);
});

test('mobile subject menu brand provides a shared 44px touch target', () => {
  const rule = subjectMenuCss.match(
    /@media \(max-width: 760px\)[\s\S]*?\.subject-menu \.subject-menu__brand\s*\{([^}]+)\}/
  )?.[1] || '';

  assert.match(rule, /display:\s*inline-flex/);
  assert.match(rule, /min-height:\s*44px/);
  assert.match(rule, /align-items:\s*center/);
});

test('subject menu CSS owns internals while page styles retain placement only', () => {
  for (const { file, css } of pageCss) {
    assert.doesNotMatch(
      css,
      /subject-menu__|topic-pill|atlas-brand|topic-switcher__label|food-active|housing-active|fragility-active|\.signals-home/,
      `${file} owns subject-menu internals`
    );
  }

  assert.match(atlasCss, /\.atlas-topics\s*\{\s*padding-bottom:\s*4\.75rem;\s*\}/);
  assert.match(pageCss.find(({ file }) => file === 'signals.css').css, /\.topic-switcher\s*\{\s*margin-bottom:\s*clamp\(3rem, 7vw, 6rem\);\s*\}/);
  assert.match(pageCss.find(({ file }) => file === 'signals.css').css, /\.evidence-topics\s*\{\s*padding-bottom:\s*4rem;\s*\}/);
  assert.match(pageCss.find(({ file }) => file === 'housing/housing.css').css, /\.housing-topics\s*\{\s*padding:\s*3px 0 52px;\s*\}/);
  assert.match(pageCss.find(({ file }) => file === 'financial-fragility/financial-fragility.css').css, /\.fragility-topics\s*\{\s*padding:\s*118px 0 24px;\s*\}/);
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

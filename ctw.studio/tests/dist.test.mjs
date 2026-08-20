import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';
import { projects } from '../src/data/projects.ts';

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
  const [home, portfolio, standOut] = await Promise.all([
    readFile(new URL('index.html', dist), 'utf8'),
    readFile(new URL('portfolio/index.html', dist), 'utf8'),
    readFile(new URL('stand-out/index.html', dist), 'utf8')
  ]);
  assert.match(home, /<link rel="canonical" href="https:\/\/ctw\.studio\/">/);
  assert.match(portfolio, /<link rel="canonical" href="https:\/\/ctw\.studio\/portfolio\/">/);
  assert.equal(
    sha256(visibleMainText(home)),
    'bcaed40baf8f78b413f9c5afc0fb890643ec1011e95131f6092e25dfef0e5c12'
  );
  assert.match(home, /Interaction design engineering for systems people need to understand and control/);
  assert.match(portfolio, /Work \/ 2013–2026/);
  assert.match(portfolio, /Software and design work\./);
  assert.match(portfolio, /Based in Amsterdam/);
  assert.match(portfolio, /<dialog[^>]+data-project-dialog="data-storytelling"/);
  assert.match(portfolio, /<a class="ctw-button" href="\/nlesc\/">Visit project ↗<\/a>/);
  assert.match(standOut, /<link rel="canonical" href="https:\/\/ctw\.studio\/stand-out\/">/);
  assert.equal((standOut.match(/speculative (?:beauty|restaurant|home-services) concept/gi) ?? []).length, 3);
  assert.match(standOut, /What you built in person/);
  assert.match(standOut, /I’m Jesse, the designer and engineer behind CTW Studio/);
  assert.match(standOut, /AI-assisted or illustrative imagery never stands in as an actual dish/);
  assert.match(standOut, /contact@ctw\.studio/);
  assert.doesNotMatch(standOut, /(?:testimonial|award-winning|guaranteed results|trusted by)/i);
});

test('Astro emits all ten Signals routes with native navigation and canonical metadata', async () => {
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
    assert.equal((html.match(/class="subject-menu__option(?:\s|")/g) ?? []).length, 10, `${pathname} subject options`);
    assert.match(html, /href="\/signals\/">Signals \//);
    assert.doesNotMatch(html, /data-astro-(?:reload|rerun)/);
    assert.match(html, /src="\/signals\/subject-menu\.js" defer/);
    assert.doesNotMatch(html, /(?:src="[^"]*)?nav\.js|data-active="signals"/);
  }
});

test('stand-out keeps its transformation story, disclosure, and local media in static output', async () => {
  const html = await readFile(new URL('stand-out/index.html', dist), 'utf8');

  for (const text of [
    '01 / Seen',
    '02 / Understood',
    '03 / Chosen',
    '04 / Remembered',
    'Recognition',
    'Confidence',
    'Continuity',
    'Listen in the real place',
    'Make one direction tangible',
    'Build only what helps',
    'Launch, learn, and leave you in control',
    'These three worlds are <strong>speculative studio concepts</strong>',
  ]) assert.ok(html.includes(text), text);

  assert.equal((html.match(/data-story-panel/g) ?? []).length, 4);
  assert.equal((html.match(/src="\/stand-out\/[^"]+\.avif"/g) ?? []).length, 3);
  assert.doesNotMatch(html, /<img[^>]+src="https?:\/\//);
  assert.match(html, /data-signal-canvas/);
  assert.match(html, /data-entry="signal" data-entry-order="1"/);
  assert.match(html, /data-entry="identity" data-entry-order="2"/);
  assert.match(html, /data-entry="headline" data-entry-order="3"/);
  assert.match(html, /data-entry="intro" data-entry-order="4"/);
  assert.doesNotMatch(html, /(?:testimonial|award-winning|guaranteed results|trusted by)/i);
});

test('all 17 maintained routes share metadata and exclude legacy navigation', async () => {
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
    ['stand-out/index.html', '/stand-out/'],
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
  assert.match(guide, /<caption>All 24 deployed CTW Studio routes/);
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

test('portfolio keeps stable media URLs and owns its controller code', async () => {
  const portfolio = await readFile(new URL('portfolio/index.html', dist), 'utf8');
  const gridSource = await readFile(new URL('../src/components/ProjectGrid.astro', import.meta.url), 'utf8');
  const source = await readFile(new URL('../portfolio/projects.js', import.meta.url), 'utf8');
  const media = [...source.matchAll(/\b(?:coverImage|src|src2|pdfUrl): '([^']+)'/g)].map((match) => match[1]);
  for (const path of new Set(media)) {
    assert.match(portfolio, new RegExp(`/portfolio/${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  }
  assert.match(portfolio, /\/portfolio\/covers\/droneatlas-720\.webp 720w/);
  await access(new URL('portfolio/covers/droneatlas-720.webp', dist));
  const coverMetadata = await sharp(await readFile(new URL('portfolio/covers/droneatlas-960.webp', dist))).metadata();
  assert.deepEqual([coverMetadata.width, coverMetadata.height], [960, 640]);
  for (const deleted of ['workspace.webp', 'local-first.webp', 'drawing.webp', 'ai.webp']) {
    assert.doesNotMatch(portfolio, new RegExp(`/portfolio/projects/notidian/${deleted}`));
  }

  assert.equal(projects.length, 21);
  assert.equal((portfolio.match(/<li class="project-card">/g) ?? []).length, projects.length);
  assert.doesNotMatch(gridSource, /project-card--span-|gridSpan/);
  assert.doesNotMatch(portfolio, /project-card--span-/);
  assert.match(
    gridSource,
    /<span class="project-card__media">[\s\S]*?<img[\s\S]*?<\/span>\s*<span class="project-card__copy">/
  );
  assert.match(
    portfolio,
    /<span class="project-card__media"><img[\s\S]*?<\/span>\s*<span class="project-card__copy">/
  );

  assert.match(portfolio, /portfolio-enhanced/);
  for (const file of [
    'index.html',
    'signals/index.html',
    'workshop/index.html',
    'design-system/index.html'
  ]) {
    assert.doesNotMatch(await readFile(new URL(file, dist), 'utf8'), /portfolio-enhanced/, file);
  }
});

test('portfolio data includes DroneAtlas and 3D Skeletal Tracking in Football source evidence', async () => {
  const expected = [
    {
      id: 'droneatlas',
      date: '2026-06-13',
      liveUrl: 'https://droneml.github.io/DroneAtlas/',
      repoUrl: 'https://github.com/DroneML/DroneAtlas',
      media: ['cover.avif', 'gallery-1.avif', 'gallery-2.avif']
    },
    {
      id: 'ajax-visual-intelligence',
      date: '2026-03-07',
      liveUrl: null,
      repoUrl: 'https://github.com/El-Machin-Team/football-body-kinematics',
      media: ['cover.avif', 'demo.mp4', 'gallery-1.avif', 'gallery-2.avif']
    }
  ];

  for (const evidence of expected) {
    const project = projects.find(({ id }) => id === evidence.id);
    assert.ok(project, evidence.id);
    assert.deepEqual(
      { date: project.date, liveUrl: project.liveUrl, repoUrl: project.repoUrl },
      { date: evidence.date, liveUrl: evidence.liveUrl, repoUrl: evidence.repoUrl }
    );
    const media = [project.coverImage, ...project.gallery.map(({ src }) => src)];
    assert.deepEqual([...new Set(media)], evidence.media.map((file) => `projects/${evidence.id}/${file}`));
    await Promise.all(media.map((path) => access(new URL(`../portfolio/${path}`, import.meta.url))));
  }

  const ajax = projects.find(({ id }) => id === 'ajax-visual-intelligence');
  assert.deepEqual(
    { type: ajax.gallery[0].type, src: ajax.gallery[0].src },
    { type: 'video', src: 'projects/ajax-visual-intelligence/demo.mp4' }
  );
  assert.equal(ajax.title, '3D Skeletal Tracking in Football');
  assert.equal(ajax.headline, 'What 21 tracked body points reveal about player orientation');
  assert.match(ajax.description, /FIFA calls the technology skeletal tracking/);
  assert.match(ajax.description, /2026 World Cup[\s\S]*AI-enabled 3D player avatars[\s\S]*semi-automated offside replays/);
  assert.match(ajax.description, /Ajax Hackathon[\s\S]*explore another use/);
  assert.match(ajax.description, /21 body points per player at 25 fps/);
  assert.match(ajax.description, /our multidisciplinary team/);
  assert.match(ajax.description, /Our team won an award\./);
  const video = ajax.gallery.find(({ type }) => type === 'video');
  assert.deepEqual(video, {
    type: 'video',
    src: 'projects/ajax-visual-intelligence/demo.mp4',
    poster: 'projects/ajax-visual-intelligence/video-poster.avif',
    caption: 'Thirty-second walkthrough of skeletal tracking, player POV, and comparison metrics',
    width: 1920,
    height: 1080
  });
  const videoFile = new URL('../portfolio/projects/ajax-visual-intelligence/demo.mp4', import.meta.url);
  const videoSize = (await stat(videoFile)).size;
  assert.ok(videoSize > 1024 ** 2, `expected demo.mp4 > 1 MiB, received ${videoSize} bytes`);
  assert.ok(videoSize <= 8 * 1024 ** 2, `expected demo.mp4 <= 8 MiB, received ${videoSize} bytes`);
  const posterFile = new URL('../portfolio/projects/ajax-visual-intelligence/video-poster.avif', import.meta.url);
  const posterMetadata = await sharp(await readFile(posterFile)).metadata();
  assert.deepEqual(
    { width: posterMetadata.width, height: posterMetadata.height },
    { width: 1920, height: 1080 }
  );

  const portfolio = await readFile(new URL('portfolio/index.html', dist), 'utf8');
  const ajaxDialog = portfolio.match(/<dialog[^>]+data-project-dialog="ajax-visual-intelligence"[\s\S]*?<\/dialog>/)?.[0];
  assert.ok(ajaxDialog, 'Ajax project dialog missing');
  assert.match(ajaxDialog, /<video controls playsinline preload="none" width="1920" height="1080" data-poster="\/portfolio\/projects\/ajax-visual-intelligence\/video-poster\.avif">/);
  assert.doesNotMatch(ajaxDialog, /<video\b[^>]*\sposter=/);
  assert.match(ajaxDialog, /<source data-src="\/portfolio\/projects\/ajax-visual-intelligence\/demo\.mp4" type="video\/mp4">/);

  for (const item of ajax.gallery.filter(({ type }) => type === 'image')) {
    const source = await readFile(new URL(`../portfolio/${item.src}`, import.meta.url));
    const metadata = await sharp(source).metadata();
    assert.deepEqual(
      { width: item.width, height: item.height },
      { width: metadata.width, height: metadata.height },
      item.src
    );
  }
});

test('source and maintained output contain no removed client runtime', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(packageJson.dependencies).sort(), [
    '@fontsource-variable/inter',
    '@fontsource/dm-mono',
    '@tailwindcss/vite',
    'astro',
    'gsap',
    'lenis',
    'tailwindcss'
  ]);

  const runtimeSources = [
    new URL('../astro.config.mjs', import.meta.url),
    ...await filesBelow(new URL('../src/components/', import.meta.url)),
    ...await filesBelow(new URL('../src/layouts/', import.meta.url)),
    ...await filesBelow(new URL('../src/pages/', import.meta.url)),
    ...await filesBelow(new URL('../src/scripts/', import.meta.url)),
    ...await filesBelow(new URL('../src/styles/', import.meta.url))
  ];
  const runtimeSource = (await Promise.all(runtimeSources.map((path) => readFile(path, 'utf8')))).join('\n');
  assert.doesNotMatch(runtimeSource, /@astrojs\/svelte|from ['"]svelte['"]|ClientRouter|data-astro-(?:reload|rerun)|transition:(?:name|animate)/);

  const maintained = [
    'index.html',
    'portfolio/index.html',
    'signals/index.html',
    'signals/ai-work/index.html',
    'stand-out/index.html',
    'workshop/index.html',
    'workshop/privacy/index.html',
    'workshop/terms/index.html',
    'design-system/index.html'
  ];
  const chunks = await filesBelow(new URL('_astro/', dist));
  const output = (await Promise.all([
    ...maintained.map((file) => readFile(new URL(file, dist), 'utf8')),
    ...chunks.map((path) => readFile(path, 'utf8'))
  ])).join('\n');
  assert.doesNotMatch(output, /@astrojs\/svelte|@floating-ui\/dom|svelte\/internal|astro-island|ClientRouter|data-astro-(?:reload|rerun)|renderer\.js/);
});

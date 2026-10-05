import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const src = new URL('../src/', import.meta.url);
const read = (path) => readFile(new URL(path, src), 'utf8');

test('header presents ctw.studio branding and exact primary navigation while retaining liquid contact contract', async () => {
  const source = await read('components/SiteHeader.astro');
  assert.match(source, /aria-label="ctw\.studio home"/);
  assert.match(source, /ctw<span class="ctw-wordmark__dot">\.<\/span>studio/);
  const nav = source.slice(source.indexOf('<nav class="ctw-primary-nav"'), source.indexOf('</nav>'));
  assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map((match) => match[1]), [
    '/portfolio/', '/writing/', '/signals/', '/stand-out/', '/#about'
  ]);
  assert.match(nav, /href="\/stand-out\/"[^>]*aria-label="Stand Out"/);
  assert.doesNotMatch(nav, /AI Workshop|\/workshop\//);
  for (const sentinel of [
    'ctw-liquid-contact', 'data-liquid-contact', 'data-liquid-mode="static"',
    'data-liquid-active="false"', 'data-liquid-pressing="false"',
    'ctw-liquid-contact__rim', 'ctw-liquid-contact__surface',
    'ctw-liquid-contact__ripple', 'ctw-liquid-contact__plus',
    "localStorage.getItem('ctw-motion-preference')", "addEventListener('pagehide'",
    "if (!event.persisted) listeners.abort()"
  ]) assert.ok(source.includes(sentinel), sentinel);
});

test('homepage presents a one-person practice under the CTW Studio brand', async () => {
  const source = await read('pages/index.astro');
  assert.match(source, /title="Jessie Gonzalez — Interaction Design Engineer"/);
  assert.match(source, /description="Jessie Gonzalez[^\n]+"/);
  assert.match(source, /independent commercial practice/i);
  assert.match(source, /I bring in trusted designers, engineers, researchers, and domain specialists only when work needs them/);
  assert.match(source, /\b(?:I|me|my)\b/);
  const visibleProse = source
    .replace(/<blockquote[\s\S]*?<\/blockquote>/g, '')
    .replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(visibleProse, /\b(?:We|we|Us|us|Our|our)\b/);
  assert.doesNotMatch(source, /\bagency\b/i);
  assert.match(source, /aria-label="Interaction Design Engineering"/);
  assert.match(source, /data-canvas-smoke-line/);
});

test('portfolio metadata names the practitioner behind CTW Studio', async () => {
  const source = await read('pages/portfolio/index.astro');
  assert.match(source, /title="Work — Jessie Gonzalez"/);
  assert.match(source, /description="Selected interaction design engineering and software work by Jessie Gonzalez/);
});

test('footer has personal identity, complete destinations, and no AI Product Architect', async () => {
  const source = await read('components/SiteFooter.astro');
  for (const value of [
    'Jessie Gonzalez', 'Interaction Design Engineer', 'independent commercial practice',
    'href="/portfolio/">Work', 'href="/writing/">Writing', 'href="/signals/">Signals',
    'href="/workshop/">AI Workshop', 'href="/nlesc/">NLeSC', 'MotionPreference',
    'mailto:', 'linkedin.com', 'github.com', 'href="/writing/2025-05-30-call-me-jesse/">About my name'
  ]) assert.ok(source.includes(value), value);
  assert.doesNotMatch(source, /AI Product Architect/);
});

test('maintained CTW source contains no outgoing jessegonzalez.dev link', async () => {
  const files = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const url = new URL(entry.name, directory);
      if (entry.isDirectory()) await walk(new URL(`${entry.name}/`, directory));
      else if (/\.(?:astro|md|css|ts)$/.test(entry.name)) files.push(url);
    }
  }
  await walk(src);
  for (const file of files) assert.doesNotMatch(await readFile(file, 'utf8'), /https?:\/\/(?:www\.)?jessegonzalez\.dev/i, file.pathname);
});

test('canonical CTW commands and hosted workflow run identity and writing source contracts', async () => {
  const [packageJson, workflow] = await Promise.all([
    readFile(new URL('../package.json', src), 'utf8'),
    readFile(new URL('../../.github/workflows/check-ctw-design-system.yml', src), 'utf8')
  ]);
  const scripts = JSON.parse(packageJson).scripts;
  assert.equal(scripts['test:content'], 'node --test tests/identity.test.mjs tests/writing.test.mjs');
  assert.match(scripts['test:ci'], /bun run test:content/);
  assert.match(workflow, /name: Test identity and writing source contracts[\s\S]*bun run test:content/);
});

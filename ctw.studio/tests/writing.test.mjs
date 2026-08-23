import assert from 'node:assert/strict';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';
import { writingRoutes } from './personal-portfolio-routes.mjs';

const pages = new URL('../src/pages/writing/', import.meta.url);
const mediaRoot = new URL('../public/writing/', import.meta.url);

test('writing manifest defines exactly 17 unique safe normalized routes', () => {
  assert.equal(writingRoutes.length, 17);
  assert.equal(new Set(writingRoutes.map(({ slug }) => slug)).size, 17);
  for (const { slug } of writingRoutes) assert.match(slug, /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(writingRoutes.some(({ slug }) => slug === '2025-05-30-call-me-jesse'));
  assert.ok(!writingRoutes.some(({ slug }) => slug === '30-05-2025-jesse'));
});

test('writing routes share one layout and retain required metadata and substantive prose', async () => {
  await access(new URL('index.astro', pages));
  await access(new URL('../../layouts/WritingLayout.astro', pages));
  for (const { slug, title, category, date } of writingRoutes) {
    const markdown = await readFile(new URL(`${slug}/index.md`, pages), 'utf8');
    assert.match(markdown, /^layout:\s+['"]?\.\.\/\.\.\/\.\.\/layouts\/WritingLayout\.astro['"]?$/m, slug);
    assert.ok(markdown.includes(`title: "${title.replaceAll('"', '\\"')}"`) || markdown.includes(`title: '${title.replaceAll("'", "''")}'`), slug);
    assert.match(markdown, /^description:\s+\S.+$/m, slug);
    assert.match(markdown, new RegExp(`^category:\\s+["']?${category}["']?$`, 'm'), slug);
    assert.match(markdown, new RegExp(`^date:\\s+["']?${date}["']?$`, 'm'), slug);
    assert.match(markdown, /^cover:\s+["']?\/writing\/.+\/media\/.+["']?$/m, slug);
    assert.ok(markdown.replace(/^---[\s\S]*?---/, '').trim().length > 400, slug);
  }
});

test('shared head receives article cover dimensions and alt text', async () => {
  const [layout, siteLayout, head] = await Promise.all([
    readFile(new URL('../../layouts/WritingLayout.astro', pages), 'utf8'),
    readFile(new URL('../../layouts/SiteLayout.astro', pages), 'utf8'),
    readFile(new URL('../../components/DocumentHead.astro', pages), 'utf8')
  ]);
  for (const value of [
    'ogImageAlt={frontmatter.coverAlt}',
    'ogImageWidth={frontmatter.coverWidth}',
    'ogImageHeight={frontmatter.coverHeight}'
  ]) assert.ok(layout.includes(value), value);
  for (const prop of ['ogImageAlt', 'ogImageWidth', 'ogImageHeight']) {
    assert.ok(siteLayout.includes(`${prop}={${prop}}`), prop);
    assert.match(head, new RegExp(`og:${prop.replace('ogImage', 'image:').toLowerCase()}`), prop);
  }
});

test('eager article covers stay below the archive transfer budget', async () => {
  for (const { slug } of writingRoutes) {
    const markdown = await readFile(new URL(`${slug}/index.md`, pages), 'utf8');
    const cover = markdown.match(/^cover:\s+["']?(\/writing\/.+\/media\/.+?)["']?$/m)?.[1];
    assert.ok(cover, `${slug}: cover`);
    assert.ok((await stat(new URL(`..${cover}`, mediaRoot))).size <= 500_000, `${slug}: eager cover exceeds 500 KB`);
  }
});

test('writing content uses safe semantic HTML, valid headings, alt text, and local media', async () => {
  const referenced = new Set();
  for (const { slug } of writingRoutes) {
    const markdown = await readFile(new URL(`${slug}/index.md`, pages), 'utf8');
    const body = markdown.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '');
    assert.doesNotMatch(body, /<(?:script|iframe)\b|\son[a-z]+\s*=|javascript:/i, slug);
    for (const className of body.matchAll(/\bclass=["']([^"']+)["']/gi)) {
      assert.doesNotMatch(className[1], /\b(?:btn|card|hero|prose|grid-cols-|bg-|text-(?:sm|lg|xl|gray|white)|daisyui|tailwind)\b/i, slug);
    }
    const headings = [...body.matchAll(/^(#{1,6})\s+/gm)].map((match) => match[1].length);
    assert.equal(headings.filter((level) => level === 1).length, 0, `${slug}: layout owns h1`);
    for (let index = 1; index < headings.length; index += 1) assert.ok(headings[index] <= headings[index - 1] + 1, `${slug}: heading skip`);
    for (const image of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)|<img\b([^>]+)>/gi)) {
      if (image[1] !== undefined) assert.ok(image[1].trim(), `${slug}: empty image alt`);
      else {
        assert.match(image[3], /\balt="[^"]+"/, `${slug}: img alt`);
        assert.match(image[3], /\bwidth="\d+"/, `${slug}: img width`);
        assert.match(image[3], /\bheight="\d+"/, `${slug}: img height`);
        assert.match(image[3], /\bloading="lazy"/, `${slug}: img lazy`);
      }
    }
    for (const match of markdown.matchAll(/\/writing\/[^\s"')]+\/media\/[^\s"')]+/g)) referenced.add(decodeURI(match[0]));
    assert.doesNotMatch(markdown, /(?:src|href)=["'](?:\.\.\/|\.\/|\/content\/)/i, slug);
  }
  const files = [];
  async function walk(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) await walk(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`);
      else files.push(`/writing/${prefix}${entry.name}`);
    }
  }
  await walk(mediaRoot);
  assert.equal(files.length, 54);
  assert.deepEqual(new Set(files), referenced);
  assert.ok(!files.some((path) => path.endsWith('/Prototyping.png')));
  for (const path of referenced) await access(new URL(`..${path}`, mediaRoot));
});

test('sensitive historical articles display required archive and provenance notices', async () => {
  const cases = [
    ['2018-03-11-webpack-problem-with-source-maps-mapping-in-chrome-devtools-fixed', /historical tool/i],
    ['2021-03-12-nuxt-with-supabase-template-recipe', /historical tool/i],
    ['2023-07-11-vps-home-server-with-docker-compose-reverse-proxy-and-automatic-ssl', /historical tool/i],
    ['2023-09-17-prevention-is-the-new-medicine-welcome-to-medicine-3-0', /medical[\s\S]*unverified|unverified[\s\S]*medical/i],
    ['2025-10-05-remote-work-drives-productivity-and-wellbeing-while-cutting-costs-dramatically', /compiled with Claude AI[\s\S]*unverified|unverified[\s\S]*compiled with Claude AI/i],
    ['2019-10-08-the-ultimate-infographic-for-seo', /source credit[\s\S]*transcription|transcription[\s\S]*source credit/i]
  ];
  for (const [slug, pattern] of cases) assert.match(await readFile(new URL(`${slug}/index.md`, pages), 'utf8'), pattern, slug);
});

test('writing index derives its archive count and personal note retires obsolete domains', async () => {
  const [index, personalNote] = await Promise.all([
    readFile(new URL('index.astro', pages), 'utf8'),
    readFile(new URL('2025-05-30-call-me-jesse/index.md', pages), 'utf8')
  ]);
  assert.match(index, /Archive · \{posts\.length\} entries/);
  assert.doesNotMatch(index, /Archive · 17 entries/);
  assert.doesNotMatch(personalNote, /jessegonzalez\.dev|ctwhome\.com/i);
  assert.match(personalNote, /ctw\.studio/);
});

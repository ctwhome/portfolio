import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { writingRoutes } from '../../ctw.studio/tests/personal-portfolio-routes.mjs';

test('retired portfolio has exact ordered permanent redirect shell', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const expected = writingRoutes.flatMap(({ slug, oldSlug = slug }) => (
    [`/work/${oldSlug}`, `/work/${oldSlug}/`].map((source) => ({
      source,
      destination: `https://ctw.studio/writing/${slug}/`,
      permanent: true
    }))
  ));
  expected.push(
    { source: '/work', destination: 'https://ctw.studio/writing/', permanent: true },
    { source: '/work/', destination: 'https://ctw.studio/writing/', permanent: true },
    { source: '/work/:path*', destination: 'https://ctw.studio/portfolio/', permanent: true },
    { source: '/', destination: 'https://ctw.studio/', permanent: true },
    { source: '/:path*', destination: 'https://ctw.studio/', permanent: true }
  );
  assert.deepEqual(config.redirects, expected);
});

test('redirect shell participates in package and hosted CI contracts', async () => {
  const [packageJson, workflow] = await Promise.all([
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
    readFile(new URL('../../.github/workflows/check-ctw-design-system.yml', import.meta.url), 'utf8')
  ]);
  assert.equal(JSON.parse(packageJson).scripts['test:redirects'], 'node --test tests/redirects.test.mjs');
  assert.match(workflow, /jessegonzalez\.dev\/vercel\.json/);
  assert.match(workflow, /jessegonzalez\.dev\/tests\/\*\*/);
  assert.match(workflow, /name: Test retired portfolio redirects[\s\S]*working-directory: jessegonzalez\.dev[\s\S]*bun run test:redirects/);
});

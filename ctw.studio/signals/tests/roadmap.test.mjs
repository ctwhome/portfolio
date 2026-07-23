import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('roadmap/index.html', root), 'utf8');

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

test('roadmap publishes all ten subjects in the agreed order', () => {
  let cursor = -1;
  for (const topic of topics) {
    const next = html.indexOf(topic);
    assert.ok(next > cursor, `${topic} missing or out of order`);
    cursor = next;
  }
});

test('roadmap states the reusable evidence contract and geographic lenses', () => {
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

test('roadmap links the published housing brief and labels publication status honestly', () => {
  assert.match(html, /href="\.\.\/housing\/"/);
  assert.match(html, /data-status="published"/);
  assert.equal((html.match(/data-status="planned"/g) || []).length, 9);
  assert.match(html, /<strong>3<\/strong>\s*briefings published/i);
  assert.match(html, /<strong>1 of 10<\/strong>\s*atlas briefs published/i);
  assert.match(html, /<strong>9<\/strong>\s*atlas briefs planned/i);
});

test('the preferred six-topic order is explicitly a first wave, not the complete atlas', () => {
  assert.match(html, /Preferred first publication wave/i);
  assert.match(html, /six-topic first wave/i);
  for (const deferred of ['Democracy', 'Education', 'Financial fragility', 'Global resilience']) {
    assert.match(html, new RegExp(deferred));
  }
});

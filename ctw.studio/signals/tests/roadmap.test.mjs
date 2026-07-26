import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('roadmap/index.html', root), 'utf8');
const briefPages = await Promise.all([
  'index.html', 'food/index.html', 'housing/index.html', 'science/index.html', 'healthspan/index.html'
].map((path) => readFile(new URL(path, root), 'utf8')));

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

test('roadmap links all three atlas briefs and labels publication status honestly', () => {
  assert.match(html, /href="\.\.\/housing\/"/);
  assert.match(html, /href="\.\.\/science\/"/);
  assert.match(html, /href="\.\.\/healthspan\/"/);
  assert.equal((html.match(/data-status="published"/g) || []).length, 3);
  assert.equal((html.match(/data-status="planned"/g) || []).length, 7);
  assert.match(html, /<strong>5<\/strong>\s*briefings published/i);
  assert.match(html, /<strong>3 of 10<\/strong>\s*atlas briefs published/i);
  assert.match(html, /<strong>7<\/strong>\s*atlas briefs planned/i);
});

test('the preferred six-topic order is explicitly a first wave, not the complete atlas', () => {
  assert.match(html, /Preferred first publication wave/i);
  assert.match(html, /six-topic first wave/i);
  for (const deferred of ['Democracy', 'Education', 'Financial fragility', 'Global resilience']) {
    assert.match(html, new RegExp(deferred));
  }
  assert.match(html, /<strong>Healthspan<\/strong><small>Published<\/small>/);
  assert.match(html, /<strong>Science<\/strong><small>Published<\/small>/);
});

test('atlas and published foundations expose all five briefs plus atlas navigation', () => {
  for (const label of ['AI &amp; work', 'Food &amp; planet', 'Housing', 'Science', 'Healthspan', 'Atlas']) {
    assert.match(html, new RegExp(label));
  }
  for (const brief of ['Brief 001', 'Brief 002', 'Brief 003', 'Brief 004', 'Brief 005']) {
    assert.match(html, new RegExp(brief));
  }
});

test('every published brief switcher exposes all five briefs plus Atlas in canonical order', () => {
  const labels = ['AI &amp; work', 'Food', 'Housing', 'Science', 'Healthspan', 'Atlas'];
  briefPages.forEach((page, index) => {
    const start = page.search(/class="[^"]*(?:topic-switcher|evidence-topics)[^"]*"/);
    assert.ok(start >= 0, `page ${index} missing topic switcher`);
    const switcher = page.slice(start, start + 2500);
    let cursor = -1;
    labels.forEach((label) => {
      const next = switcher.indexOf(label);
      assert.ok(next > cursor, `page ${index} missing or reorders ${label}`);
      cursor = next;
    });
  });
});

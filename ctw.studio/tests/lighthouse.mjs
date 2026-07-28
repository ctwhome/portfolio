import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const baseUrl = process.env.CTW_PREVIEW_URL ?? 'http://127.0.0.1:4322';
const runsArg = process.argv.find((argument) => argument.startsWith('--runs='));
const runs = Number(process.env.LIGHTHOUSE_RUNS ?? runsArg?.split('=')[1] ?? 3);
const server = process.env.CTW_PREVIEW_URL
  ? null
  : spawn('bun', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4322'], { stdio: 'ignore' });
const outputDir = resolve('lighthouse-results');
const pages = {
  home: {
    path: '/',
    thresholds: { performance: 90, accessibility: 1, cls: 0.01 }
  },
  portfolio: {
    path: '/portfolio/',
    thresholds: {
      performance: 80,
      accessibility: 1,
      lcp: 2500,
      tbt: 200,
      cls: 0.1,
      transfer: 1.25 * 1024 * 1024
    }
  },
  signalsAtlas: {
    path: '/signals/',
    thresholds: { performance: 90, accessibility: 1, cls: 0.01 }
  },
  signalsFood: {
    path: '/signals/food/',
    thresholds: { performance: 80, accessibility: 1, cls: 0.1 }
  },
  workshop: {
    path: '/workshop/',
    thresholds: { performance: 90, accessibility: 1, cls: 0.01 }
  },
  designGuide: {
    path: '/design-system/',
    thresholds: { performance: 90, accessibility: 1, cls: 0.01 }
  }
};

if (!Number.isInteger(runs) || runs < 1) throw new Error(`invalid Lighthouse run count: ${runs}`);

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const stopChrome = (chrome) => Promise.race([
  chrome.kill(),
  new Promise((resolveStop) => setTimeout(resolveStop, 2000))
]);

try {
  for (let attempt = 0; server && attempt < 100; attempt += 1) {
    try {
      if ((await fetch(baseUrl)).ok) break;
    } catch {}
    await new Promise((resolveReady) => setTimeout(resolveReady, 100));
    if (attempt === 99) throw new Error(`preview did not start at ${baseUrl}`);
  }

  await mkdir(outputDir, { recursive: true });
  for (const [name, page] of Object.entries(pages)) {
    const results = [];
    const chrome = await launch({
      chromePath: process.env.CHROME_PATH || chromium.executablePath(),
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu']
    });
    try {
      for (let run = 1; run <= runs; run += 1) {
        const result = await lighthouse(`${baseUrl}${page.path}`, {
          port: chrome.port,
          output: ['html', 'json'],
          logLevel: 'error',
          onlyCategories: ['performance', 'accessibility']
        });
        if (!result) throw new Error(`Lighthouse returned no result for ${name}`);

        const [html, json] = result.report;
        await Promise.all([
          writeFile(resolve(outputDir, `${name}-${run}.html`), html),
          writeFile(resolve(outputDir, `${name}-${run}.json`), json)
        ]);
        const { lhr } = result;
        results.push({
          performance: Math.round(lhr.categories.performance.score * 100),
          accessibility: lhr.categories.accessibility.score,
          lcp: lhr.audits['largest-contentful-paint'].numericValue,
          tbt: lhr.audits['total-blocking-time'].numericValue,
          cls: lhr.audits['cumulative-layout-shift'].numericValue,
          transfer: lhr.audits['total-byte-weight'].numericValue
        });
      }
    } finally {
      await stopChrome(chrome);
    }

    const measured = Object.fromEntries(
      Object.keys(results[0]).map((metric) => [metric, median(results.map((result) => result[metric]))])
    );
    console.log(JSON.stringify({ page: name, runs, ...measured }));
    const threshold = page.thresholds;
    assert.ok(measured.performance >= threshold.performance, `${name} performance ${measured.performance} < ${threshold.performance}`);
    assert.ok(measured.accessibility >= threshold.accessibility, `${name} accessibility ${measured.accessibility} < ${threshold.accessibility}`);
    if (threshold.lcp) assert.ok(measured.lcp <= threshold.lcp, `${name} LCP ${measured.lcp}ms > ${threshold.lcp}ms`);
    if (threshold.tbt) assert.ok(measured.tbt <= threshold.tbt, `${name} TBT ${measured.tbt}ms > ${threshold.tbt}ms`);
    assert.ok(measured.cls <= threshold.cls, `${name} CLS ${measured.cls} > ${threshold.cls}`);
    if (threshold.transfer) assert.ok(measured.transfer <= threshold.transfer, `${name} transfer ${measured.transfer} > ${threshold.transfer}`);
  }
} finally {
  server?.kill();
}

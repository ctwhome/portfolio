import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const url = process.env.CTW_PREVIEW_URL ?? 'http://127.0.0.1:4322/portfolio/';
const server = process.env.CTW_PREVIEW_URL
  ? null
  : spawn('bun', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4322'], { stdio: 'ignore' });

try {
  if (server) {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      try {
        if ((await fetch(url)).ok) break;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const client = await page.context().newCDPSession(page);
  let transferredBytes = 0;
  await client.send('Network.enable');
  client.on('Network.dataReceived', ({ encodedDataLength }) => {
    transferredBytes += encodedDataLength;
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  const metrics = await page.evaluate(() => ({
    domContentLoadedMs: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,
    imagesLoaded: [...document.images].filter((image) => image.complete && image.naturalWidth > 0).length
  }));
  await browser.close();
  assert.ok(transferredBytes <= 1.25 * 1024 * 1024, `initial transfer ${transferredBytes} exceeds 1.25MiB`);
  console.log(JSON.stringify({ ...metrics, transferredBytes }, null, 2));
} finally {
  server?.kill();
}

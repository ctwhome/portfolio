import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const width = 1600;
const height = 1200;

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
const hash = (x, y, seed) => {
  let value = Math.imul(x + seed, 374761393) + Math.imul(y - seed, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
};
const smooth = (edge0, edge1, value) => {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

function raster(kind) {
  const pixels = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const v = y / height;
      const grain = hash(x, y, kind.length * 97) - 0.5;
      let r;
      let g;
      let b;

      if (kind === 'signal') {
        const focus = 1 - smooth(0.04, 0.82, Math.hypot((u - 0.72) * 0.72, v - 0.34));
        const horizon = smooth(0.012, 0, Math.abs(v - (0.66 + Math.sin(u * 5) * 0.012)));
        r = 9 + focus * 88 + horizon * 92;
        g = 9 + focus * 18 + horizon * 14;
        b = 8 + focus * 3;
      } else if (kind === 'beauty') {
        const fold = Math.sin(u * 9 + Math.sin(v * 5) * 1.7) * 0.5 + 0.5;
        const flare = 1 - smooth(0.05, 0.7, Math.hypot(u - 0.68, v - 0.26));
        r = 78 + fold * 116 + flare * 48;
        g = 38 + fold * 34 + flare * 50;
        b = 51 + (1 - fold) * 56 + flare * 24;
      } else if (kind === 'table') {
        const pool = 1 - smooth(0.08, 0.72, Math.hypot((u - 0.53) * 0.8, v - 0.5));
        const horizon = smooth(0.44, 0.57, v);
        const linen = Math.sin((u + v * 0.04) * 170) * 2.5;
        r = 20 + pool * 196 + horizon * 20 + linen;
        g = 23 + pool * 102 + horizon * 15 + linen;
        b = 18 + pool * 42 + horizon * 8;
      } else {
        const gridX = Math.min((u * 18) % 1, 1 - ((u * 18) % 1));
        const gridY = Math.min((v * 14) % 1, 1 - ((v * 14) % 1));
        const grid = gridX < 0.018 || gridY < 0.018 ? 1 : 0;
        const beam = smooth(0.015, 0, Math.abs(v - (0.79 - u * 0.5)));
        const light = 1 - smooth(0.05, 0.9, Math.hypot(u - 0.18, v - 0.12));
        r = 17 + light * 32 + grid * 26 + beam * 214;
        g = 35 + light * 55 + grid * 57 + beam * 97;
        b = 43 + light * 62 + grid * 62 + beam * 39;
      }

      const index = (y * width + x) * 3;
      pixels[index] = clamp(r + grain * 12);
      pixels[index + 1] = clamp(g + grain * 10);
      pixels[index + 2] = clamp(b + grain * 8);
    }
  }
  return pixels;
}

for (const [kind, filename] of [
  ['signal', 'signal-poster.avif'],
  ['beauty', 'beauty-material.avif'],
  ['table', 'restaurant-material.avif'],
  ['structure', 'home-services-material.avif'],
]) {
  await sharp(raster(kind), { raw: { width, height, channels: 3 } })
    .avif({ quality: 72, effort: 6 })
    .toFile(fileURLToPath(new URL(`../public/stand-out/${filename}`, import.meta.url)));
}

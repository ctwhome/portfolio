import { readFile, mkdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import decodeAvif, { init as initAvif } from '@jsquash/avif/decode.js';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(join(root, 'src/data/projects.ts'), 'utf8');
const covers = [...source.matchAll(/id: '([^']+)'[\s\S]*?coverImage: '([^']+)'/g)]
  .map(([, id, path]) => ({ id, path }));
const widths = [480, 720, 960];

if (covers.length !== 21) throw new Error(`expected 21 project covers, found ${covers.length}`);

let avifReady = false;
async function image(path) {
  try {
    await sharp(path).metadata();
    return sharp(path);
  } catch {}

  if (extname(path).toLowerCase() !== '.avif') throw new Error(`unsupported cover: ${path}`);
  if (!avifReady) {
    const wasm = await readFile(join(root, 'node_modules/@jsquash/avif/codec/dec/avif_dec.wasm'));
    await initAvif(await WebAssembly.compile(wasm));
    avifReady = true;
  }
  const bytes = await readFile(path);
  const decoded = await decodeAvif(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  return sharp(decoded.data, { raw: { width: decoded.width, height: decoded.height, channels: 4 } });
}

for (const { id, path } of covers) {
  const input = join(root, 'portfolio', path);
  const sourceImage = await image(input);
  for (const width of widths) {
    const output = join(root, 'dist/portfolio/covers', `${id}-${width}.webp`);
    await mkdir(dirname(output), { recursive: true });
    await sourceImage
      .clone()
      .resize(width, Math.round(width * 2 / 3), { fit: 'cover', position: 'centre' })
      .webp({ quality: 78, effort: 6, smartSubsample: true })
      .toFile(output);
  }
}

console.log(`responsive covers generated: ${covers.length * widths.length} files`);

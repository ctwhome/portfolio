import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const manifest = JSON.parse(await readFile(join(root, 'preserve.manifest.json'), 'utf8'));
const excludes = manifest.treeExcludes.map((entry) => entry.split('/').join(sep));

async function walk(entry) {
  const absolute = join(root, entry);
  const info = await stat(absolute);
  if (info.isFile()) return [entry];
  const children = await readdir(absolute, { withFileTypes: true });
  const nested = await Promise.all(children
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((child) => walk(join(entry, child.name))));
  return nested.flat();
}

function excluded(entry) {
  return excludes.some((candidate) => entry === candidate || entry.startsWith(`${candidate}${sep}`));
}

async function sourceFiles() {
  const expanded = await Promise.all([...manifest.files, ...manifest.trees].map(walk));
  return [...new Set(expanded.flat().filter((entry) => !excluded(entry)))].sort();
}

async function digest(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

async function copyAll() {
  for (const entry of await sourceFiles()) {
    const destination = join(dist, entry);
    try {
      await stat(destination);
      throw new Error(`preservation collision: ${relative(root, destination)}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    await mkdir(dirname(destination), { recursive: true });
    await cp(join(root, entry), destination, { errorOnExist: true, force: false });
  }
}

async function verify() {
  const expected = await sourceFiles();
  const copied = (await walk('dist'))
    .map((entry) => relative(dist, join(root, entry)))
    .filter((entry) => expected.includes(entry))
    .sort();
  if (JSON.stringify(copied) !== JSON.stringify(expected)) {
    throw new Error('preserved path set mismatch');
  }
  for (const entry of expected) {
    const [sourceHash, outputHash] = await Promise.all([
      digest(join(root, entry)),
      digest(join(dist, entry))
    ]);
    if (sourceHash !== outputHash) throw new Error(`preserved byte mismatch: ${entry}`);
  }
  console.log(`preservation verified: ${expected.length} files`);
}

const command = process.argv[2];
if (command === 'copy') await copyAll();
else if (command === 'verify') await verify();
else throw new Error('usage: node scripts/preserve.mjs copy|verify');

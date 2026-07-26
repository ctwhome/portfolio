import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoDir = resolve(appDir, '..')
const outputDir = join(appDir, 'out')
const artifactDir = join(repoDir, 'ctw.studio', 'nlesc')
const publicDir = join(appDir, 'public')
const mode = process.argv[2]
const excludedDirectories = new Set(['.next', 'node_modules', 'out'])
const rootInputs = [
  '.eslintrc.json',
  '.npmrc.config',
  '.prettierrc',
  'bun.lock',
  'jsconfig.json',
  'next.config.js',
  'package.json',
]
const sourceDirectories = [
  'components',
  'content',
  'hooks',
  'lib',
  'pages',
  'public',
  'styles',
  'svgs',
  'scripts',
]

function filesIn(directory, root = directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        return excludedDirectories.has(entry.name) ? [] : filesIn(path, root)
      }
      return entry.isFile() ? [relative(root, path)] : []
    })
}

function cleanupGeneratedPwaSource() {
  for (const name of readdirSync(publicDir)) {
    if (name === 'sw.js' || /^workbox-.*\.js(?:\.map)?$/.test(name)) {
      rmSync(join(publicDir, name))
    }
  }
}

function sourceBuildId() {
  const hash = createHash('sha256')
  const sourceFiles = sourceDirectories.flatMap((directory) => {
    const path = join(appDir, directory)
    return existsSync(path)
      ? filesIn(path).map((file) => join(directory, file))
      : []
  })

  for (const file of [...rootInputs, ...sourceFiles].sort()) {
    if (
      file === 'public/sw.js' ||
      /^public\/workbox-.*\.js(?:\.map)?$/.test(file)
    ) {
      continue
    }
    hash.update(file)
    hash.update('\0')
    hash.update(readFileSync(join(appDir, file)))
    hash.update('\0')
  }
  return hash.digest('hex').slice(0, 20)
}

function build() {
  cleanupGeneratedPwaSource()
  rmSync(outputDir, { recursive: true, force: true })

  const result = spawnSync('bun', ['run', 'next', 'build'], {
    cwd: appDir,
    env: {
      ...process.env,
      NLESC_STATIC_EXPORT: '1',
      NLESC_BUILD_ID: sourceBuildId(),
      NEXT_PUBLIC_BASE_PATH: '/nlesc',
    },
    stdio: 'inherit',
  })

  cleanupGeneratedPwaSource()
  if (result.status !== 0) process.exit(result.status ?? 1)
  if (!existsSync(join(outputDir, 'sw.js'))) {
    throw new Error('Static export missing out/sw.js')
  }
}

function sync() {
  rmSync(artifactDir, { recursive: true, force: true })
  cpSync(outputDir, artifactDir, { recursive: true })
  console.log(
    `Synced ${relative(repoDir, outputDir)}/ -> ${relative(
      repoDir,
      artifactDir
    )}/`
  )
}

function compare() {
  const outputFiles = filesIn(outputDir)
  const artifactFiles = filesIn(artifactDir)
  const names = new Set([...outputFiles, ...artifactFiles])
  const differences = [...names].filter((file) => {
    const output = join(outputDir, file)
    const artifact = join(artifactDir, file)
    return (
      !existsSync(output) ||
      !existsSync(artifact) ||
      lstatSync(output).size !== lstatSync(artifact).size ||
      !readFileSync(output).equals(readFileSync(artifact))
    )
  })

  if (differences.length) {
    console.error(`Static artifact stale: ${differences.join(', ')}`)
    process.exit(1)
  }
  console.log(
    `Static artifact fresh: ${outputFiles.length} files match byte-for-byte`
  )
}

if (!['export', 'sync', 'check'].includes(mode)) {
  throw new Error('Usage: static-artifact.mjs <export|sync|check>')
}

build()
if (mode === 'sync') sync()
if (mode === 'check') compare()

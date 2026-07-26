# Repository Guide

## Map

- `about/`: independent Next.js NLeSC portfolio; own `bun.lock`.
- `ctw.studio/`: static CTW Studio portfolio and Signals pages.
- `ctw.studio2/`: alternate static portfolio.
- `dashboard/`: independent Bun Signals dashboard; own `bun.lock`.
- `jessegonzalez.dev/`: SvelteKit portfolio; root Bun workspace.
- `ctw-kit/`: shared Svelte library consumed by `jessegonzalez.dev/`; root Bun workspace.

## Boundaries

- Treat each app directory as its build and deployment root.
- Keep framework-specific Vercel configuration inside its app. Never add a root `vercel.json`.
- `about/` intentionally uses native Next.js/Vercel defaults; do not add `about/vercel.json` without a concrete platform requirement.
- Root `package.json` and `bun.lock` cover only `ctw-kit/` and `jessegonzalez.dev/`.
- Use each independent app's lockfile from that app directory.
- Preserve unrelated apps and generated assets; do not make cross-app changes for an app-local task.

## Setup and Commands

Run commands from the named directory.

| Scope | Setup | Develop | Build/check |
|-------|-------|---------|-------------|
| `about/` | `bun install --frozen-lockfile` | `bun run dev` | `bun run build` |
| `dashboard/` | `bun install --frozen-lockfile` | `bun run dev` | `bun run build:css` |
| `ctw-kit/` | root: `bun install` | — | `bun run build` |
| `jessegonzalez.dev/` | root: `bun install` | `bun run dev` | `bun run check`; `bun run build` |
| `ctw.studio/` | none | serve as static files | `test -f index.html && test -f vercel.json` |
| `ctw.studio2/` | none | serve as static files | no general build |

For CTW Studio Tailwind regeneration, use the command documented in root `README.md`.

## Verification

- Always run `git diff --check` and inspect `git status --short`.
- Targeted change: run setup plus build/check only for affected app.
- Shared-library or root-workspace change: build `ctw-kit/`, then check and build `jessegonzalez.dev/`.
- Cross-app config change: verify every `vercel.json` path and run affected app builds.
- Broad refactor: run all applicable rows above; static apps need focused browser or asset checks for touched pages.
- Report command exit statuses and warnings exactly. Do not convert logged errors into success claims.

## Deployment Pitfalls

| Vercel project | Root Directory | Framework | Production domain |
|----------------|----------------|-----------|-------------------|
| `nlesc-portfolio` | `about` | Next.js | `nlesc.ctwhome.com` |
| `ctw.studio` | `ctw.studio` | Other / static | `ctw.studio` |
| `jessegonzalez.dev` | `jessegonzalez.dev` | SvelteKit | `jessegonzalez.dev` |

- Deployment configuration must be project-local. Never add a repository-root `vercel.json`: it contaminates every Vercel Root Directory with incompatible commands and output paths.
- `about/` uses Next.js defaults. Do not add `about/vercel.json` unless a real local or remote Vercel test proves those defaults insufficient.
- Jesse's SvelteKit settings belong only in `jessegonzalez.dev/vercel.json`; CTW Studio's static settings belong only in `ctw.studio/vercel.json`.
- `about/` runs `next-sitemap` during `postbuild`; its separate configuration issue must not be hidden or coupled to unrelated deployment fixes.
- Local build success does not authorize deployment or Vercel setting changes.

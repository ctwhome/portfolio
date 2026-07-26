# Repository agent guide

## App map and boundaries

- `ctw.studio/` is the static CTW Studio site: plain HTML, CSS, vanilla JS, and committed JSON. Its local `vercel.json` serves that directory without a build.
- `ctw.studio/nlesc/` is the canonical static NLeSC route at `/nlesc/`.
- `ctw.studio/signals/` contains evidence briefs, topic renderers, `data/`, deterministic `scripts/`, and Node integrity tests.
- `about/` is the frozen legacy Next.js NLeSC app. Keep it active until a separately approved redirect and retirement; do not add `about/vercel.json` without a proven platform need.
- `jessegonzalez.dev/`, `about/`, `dashboard/`, `ctw.studio2/`, and `ctw-kit/` are separate applications. Treat each app directory as its build and deployment root.
- Never add a repository-root `vercel.json`. Framework and Vercel settings stay inside the affected app.
- Root `package.json` and `bun.lock` cover only `ctw-kit/` and `jessegonzalez.dev/`; independent apps use their own lockfiles.
- Preserve unrelated apps and generated assets. `ctw.studio/tailwind.css` is generated; Signals and NLeSC route CSS are handwritten.

## Setup and checks

Run commands from the named directory.

| Scope | Setup | Develop | Build/check |
|---|---|---|---|
| `about/` | `bun install --frozen-lockfile` | `bun run dev` | `bun run build` |
| `dashboard/` | `bun install --frozen-lockfile` | `bun run dev` | `bun run build:css` |
| `ctw-kit/` | root: `bun install` | — | `bun run build` |
| `jessegonzalez.dev/` | root: `bun install` | `bun run dev` | `bun run check`; `bun run build` |
| `ctw.studio/` | none | `python3 -m http.server 4173` | `test -f index.html && test -f vercel.json` |
| `ctw.studio2/` | none | serve as static files | no general build |

For CTW Studio Tailwind regeneration, use the command in root `README.md`.

For Signals work, run from `ctw.studio/`:

```bash
node --test signals/tests/*.test.mjs
node --check signals/dashboard.js
node --check signals/food/food.js
node --check signals/housing/housing.js
node --check signals/science/science.js
node --check signals/healthspan/healthspan.js
node --check signals/real-time-ai/real-time-ai.js
python3 -m py_compile signals/scripts/*.py
python3 signals/scripts/update_fred.py
python3 signals/scripts/update_food_data.py
python3 signals/scripts/update_housing_data.py
python3 signals/scripts/update_science_data.py
python3 signals/scripts/update_healthspan_data.py
```

Use targeted checks while editing. Before handoff, run applicable app checks, serve touched static routes/assets, inspect desktop and mobile layouts, run `git diff --check`, and inspect `git status --short`. Report exit statuses and warnings exactly.

## Signals evidence architecture

- Browser code reads committed JSON only. Never add visitor-time evidence API calls or a chart runtime for Signals.
- Updaters own stable official no-key series and validate schema, definitions, units, geography, and chronology before writing.
- Papers, forecasts, experiments, interpretations, and non-API evidence stay manually curated and source-auditable.
- Real-time AI regulatory scope, benchmarks, field evidence, and maturity flags stay manually curated; no source automatically sets a maturity verdict.
- Keep observation, association, experiment, exposure, forecast, scenario, counterfactual, judgment, and hypothesis labels distinct.

## Durable pitfalls

- Scope, period, population, denominator, and unit travel with every public number.
- Publication volume is not discovery; exposure is not job loss; lifespan is not healthy lifespan; unlike waiting-time clocks are not comparable; spending does not prove outcomes.
- Fast inference is not a closed loop; demonstration, operation, reliability, approval, and scale are independent.
- Keep substantive HTML, accessible table alternatives, HTTPS source links, and useful no-JS content.
- Preserve the atlas ten-topic order and verify counts, publication states, switchers, and cross-links together.

## Deployment boundaries

| Vercel project | Root Directory | Framework | Production domain |
|---|---|---|---|
| `nlesc-portfolio` | `about` | Next.js | `nlesc.ctwhome.com` |
| `ctw.studio` | `ctw.studio` | Other / static | `ctw.studio` |
| `jessegonzalez.dev` | `jessegonzalez.dev` | SvelteKit | `jessegonzalez.dev` |

- `/nlesc/` is the canonical replacement route, but `about/` and `nlesc-portfolio` remain active frozen legacy until cutover receives separate approval.
- Preserve `ctw.studio/vercel.json` redirects and static output `.`.
- Jesse's SvelteKit settings belong only in `jessegonzalez.dev/vercel.json`.
- `about/` runs `next-sitemap` during `postbuild`; do not hide or couple its separate configuration issue to unrelated work.
- Rollback-safe cutover: preview → merge/deploy CTW route → verify production → separately approve redirect → verify redirect → retire legacy Vercel project → optionally remove `about/`.
- Local build success never authorizes deployment, domain/DNS changes, redirects, or Vercel project deletion.

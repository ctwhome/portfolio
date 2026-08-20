# Repository agent guide

## Boundaries

- Treat `ctw.studio/`, `about/`, `dashboard/`, `jessegonzalez.dev/`,
  `ctw.studio2/`, and `ctw-kit/` as separate app roots.
- Root package files cover only `ctw-kit/` and `jessegonzalez.dev/`. Never add
  root `vercel.json`.
- `about/` owns NLeSC source. `ctw.studio/nlesc/` is generated, committed, and
  never hand-edited.
- `ctw.studio/` is Astro static output. `src/pages`, `src/layouts`, and
  `src/components` own maintained routes.
- `ctw.studio/preserve.manifest.json` owns byte-identical historical/runtime
  passthrough. Avoid collisions with Astro output.
- Stable legal URLs are directories: `/workshop/privacy/` and
  `/workshop/terms/`. Never add dotted aliases or redirects.
- Keep design guide out of public navigation unless separately approved.
- Deployment, domains, DNS, redirects, and legacy-project retirement require
  separate authorization.

## CTW Studio commands

Run from `ctw.studio/`:

```bash
bun install --frozen-lockfile
bun run dev
bun run check
bun run build
bun run preview
bun run test:signals
bun run test:design
bun run test:syntax
bun run test:dist
bun run test:e2e
bun run test:visual
bun run test:lighthouse
```

`bun run test:ci` is complete canonical order. Lighthouse uses three-run
medians; `test:lighthouse:quick` is non-final one-run feedback.
Public targeted `test:*` commands above and `test:transfer` build first.
Use matching `:built` variants only inside a workflow that has just completed
canonical `bun run build`; `test:syntax` remains source-only.

Use targeted gates while editing. Before handoff run applicable broad gates,
`git diff --check`, protected-path checks, and `git status --short`. Report
exact counts, metrics, exit failures, and warnings.

From repository root, verify design tokens:

```bash
npx --yes @google/design.md@0.3.0 lint DESIGN.md
npx --yes @google/design.md@0.3.0 export --format dtcg DESIGN.md > /tmp/ctw-design-tokens.json
diff -u ctw.studio/design-system/tokens.json /tmp/ctw-design-tokens.json
```

For NLeSC export work, run from `about/`:

```bash
bun run static:sync
bun run static:check
```

## Architecture contracts

- Seventeen maintained Astro pages share `DocumentHead.astro`.
- All route navigation is native. Home and portfolio use CSS-only
  cross-document view transitions; portfolio behavior lives in one page-local
  processed TypeScript module.
- Reduced motion disables nonessential motion.
- Legal pages use Astro directory output at `/workshop/privacy/` and
  `/workshop/terms/`.
- Historical root experiments, `/new/`, workshop pitch/slides, and `/nlesc/`
  remain passthrough. `/signals/roadmap/` remains a byte-preserved permanent
  redirect source, not deployed content.
- CTW Studio has no client UI framework, client router, or Floating UI runtime.
- `DESIGN.md` owns roles; `tokens.css` implements roles; `components.css` owns
  shared components; `compositions.css` owns opt-in compositions; `compat.css`
  owns approved aliases; `tokens.json` is generated.
- `tailwind.css` and responsive portfolio covers are generated. Do not
  hand-edit generated output.

## Signals evidence rules

- Browser code reads committed JSON only. No visitor-time evidence requests or
  chart runtime.
- Updaters validate official no-key series, schema, definition, unit,
  geography, and chronology before writing.
- Papers, forecasts, experiments, interpretations, and maturity flags remain
  manually curated and source-auditable.
- Keep observation, association, experiment, exposure, forecast, scenario,
  counterfactual, judgment, and hypothesis distinct.
- Every public number retains scope, period, population, denominator, and unit.
- Publication volume is not discovery; exposure is not job loss; lifespan is
  not healthy lifespan; spending does not prove outcomes.
- Demographic flows are not stocks/projections. Assessment results, pathway
  access, and tutor experiments are distinct. Financial stocks, flows, service,
  liquidity, sector, and denominators do not form an automatic composite.
- Keep substantive HTML, accessible table alternatives, HTTPS sources, and
  useful no-JS content.

## Preservation and review

- Route audit comes from built output plus manifest-declared preserved routes,
  excluding declared redirect sources. Assert exact 24 content routes,
  directory legal URLs, and absent dotted aliases.
- Preserve NLeSC and historical hashes. Never hand-edit `dist/`.
- Protect Signals JSON facts and updater semantics unless task explicitly
  changes data.
- Inspect desktop/compact output, skip/focus behavior, 44px controls,
  horizontal overflow, lazy media, browser errors, and no-JS reading.
- CI must remain fail-closed for NLeSC diffs and pin every action by commit.

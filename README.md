# Portfolio monorepo

Independent applications sharing one repository:

- `ctw.studio/`: Astro static site for Jesse Gonzalez, CTW Studio, portfolio,
  Writing, Signals, workshop, legal pages, and design guide.
- `about/`: canonical Next.js source for NLeSC; exports the committed
  `ctw.studio/nlesc/` subtree.
- `jessegonzalez.dev/`: retired SvelteKit portfolio; Vercel config redirects
  migrated writing and remaining routes to CTW Studio.
- `dashboard/`: Bun Signals dashboard.
- `ctw-kit/`: shared Svelte library used by `jessegonzalez.dev/`.
- `ctw.studio2/`: historical alternate static portfolio.

Root `package.json` and `bun.lock` cover only `ctw-kit/` and
`jessegonzalez.dev/`. Every independent app uses its own root and lockfile.
Never add a repository-root `vercel.json`.

## CTW Studio

Astro builds a static artifact from `ctw.studio/`. Browser code remains
progressive enhancement: every route has substantive HTML, Signals reads
committed JSON, and historical pages pass through byte-identically.

```bash
cd ctw.studio
bun install --frozen-lockfile
bun run dev
bun run check
bun run build
bun run preview
```

`bun run preview` is canonical built-output preview. `astro dev` is source
development only.

### Architecture and route ownership

Sixteen Astro pages own maintained output:

- `/`, `/portfolio/`, `/signals/`
- `/signals/ai-work/`, `/signals/demography/`, `/signals/education/`,
  `/signals/financial-fragility/`, `/signals/food/`, `/signals/healthspan/`,
  `/signals/housing/`, `/signals/real-time-ai/`, `/signals/science/`
- `/workshop/`, `/workshop/privacy/`, `/workshop/terms/`
- `/design-system/`

`src/pages/` owns route content; `src/layouts/` owns document shells;
`src/components/DocumentHead.astro` owns canonical metadata.
Every route uses native document navigation. Home and portfolio retain native
cross-document view transitions; portfolio interaction is one page-local,
processed TypeScript module over server-rendered HTML.

`preserve.manifest.json` owns deterministic passthrough. Historical root
experiments, `/new/`, workshop pitch/slides, stable runtime assets, and the
generated NLeSC export remain source bytes copied into `dist/`. The preserved
`/signals/roadmap/` source is a permanent redirect source, not one of the 23
deployed content routes. Maintained source HTML is not preserved.

Legal pages use Astro directory output, matching stable production URLs.
Tests reject dotted files, redirects, and extra aliases.

Maintained Astro routes self-host variable Inter and DM Mono 400/500 through
app-local Fontsource packages. Historical preserved pages retain their original
bytes and font links.

CTW Studio has no client UI framework or client router. Feedback initializes
once per document and portfolio remains progressive enhancement.

### Design system

Authority order:

1. `DESIGN.md`: normative language and exportable tokens.
2. `design-system/tokens.css`: browser roles.
3. `design-system/components.css`: shared components.
4. `design-system/compositions.css`: opt-in expressive compositions.
5. `src/pages/design-system/index.astro`: human guide specimens.
6. `design-system/tokens.json`: generated DTCG output; never hand-edit.

The guide stays absent from public navigation until separately approved.
Signals accents remain page-scoped.

From repository root:

```bash
npx --yes @google/design.md@0.3.0 lint DESIGN.md
npx --yes @google/design.md@0.3.0 export --format dtcg DESIGN.md > /tmp/ctw-design-tokens.json
diff -u ctw.studio/design-system/tokens.json /tmp/ctw-design-tokens.json
```

### Signals data

Browser routes read committed JSON only. No visitor-time evidence API or chart
runtime belongs in Signals.

Run family gates from `ctw.studio/`:

```bash
bun run test:signals
bun run test:syntax
```

Official no-key data refreshes are explicit maintainer actions:

```bash
python3 signals/scripts/update_fred.py
python3 signals/scripts/update_food_data.py
python3 signals/scripts/update_housing_data.py
python3 signals/scripts/update_science_data.py
python3 signals/scripts/update_healthspan_data.py
python3 signals/scripts/update_demography_data.py
python3 signals/scripts/update_education_data.py
python3 signals/scripts/update_financial_fragility_data.py
```

Review JSON diffs, definitions, units, geography, period, chronology, and source
URLs before accepting output. Papers, forecasts, experiments, interpretations,
and maturity judgments remain manually curated.

### Verification

Public targeted scripts build fresh output before testing:

```bash
bun run check
bun run build
bun run test:signals
bun run test:design
bun run test:syntax
bun run test:dist
bun run test:e2e
bun run test:visual
bun run test:lighthouse
bun run test:transfer
```

`bun run test:ci` runs `check`, one canonical build, then internal `:built`
variants to avoid repeated builds. Use `test:signals:built`,
`test:design:built`, `test:dist:built`, `test:e2e:built`,
`test:visual:built`, `test:lighthouse:built`,
`test:lighthouse:quick:built`, and `test:transfer:built` only in a workflow
that has just completed `bun run build`. `test:syntax` remains source-only.
Browser gates require installed Chromium:

```bash
bunx playwright install chromium
```

Lighthouse defaults to three runs per page and checks median values.
`bun run test:lighthouse:quick` is one-run local feedback only.

Budgets:

| Page | Performance | Accessibility | Extra |
|---|---:|---:|---|
| `/` | ≥90 | 1.0 | CLS ≤0.01 |
| `/portfolio/` | ≥80 | 1.0 | LCP ≤2500ms, TBT ≤200ms, CLS ≤0.1, transfer ≤1.25MiB |
| `/signals/` | ≥90 | 1.0 | CLS ≤0.01 |
| representative Signals brief | ≥80 | 1.0 | CLS ≤0.1 |
| `/workshop/` | ≥90 | 1.0 | CLS ≤0.01 |
| `/design-system/` | ≥90 | 1.0 | CLS ≤0.01 |

`test:dist` verifies exact 42-route contract, stable legal directories,
preservation hashes, metadata, legacy `nav.js` absence, removed-runtime
absence, and portfolio-only controller ownership.

### Deployment

Vercel project `ctw.studio` uses Root Directory `ctw.studio`, framework Astro,
`bun run build`, and output `dist`. App-local `vercel.json` owns redirects and
headers. Local success does not authorize deployment, DNS/domain changes,
redirect changes, or project deletion.

## NLeSC export

`about/` remains canonical and its legacy Vercel project stays active until
separate cutover approval.

```bash
cd about
bun install --frozen-lockfile
bun run static:sync
bun run static:check
```

Never edit `ctw.studio/nlesc/` by hand. Safe cutover order: preview, deploy CTW
route, verify production, separately approve redirect, verify redirect, then
retire legacy project.

## Portfolio projects

Project copy lives in `ctw.studio/src/data/projects.ts`; stable media lives in
`ctw.studio/portfolio/projects/<project-id>/`. Use AVIF covers and preserve
public media URLs. Build generates responsive cover variants without changing
source media.

## License

MIT

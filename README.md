# Portfolio Monorepo

Portfolio monorepo containing several independently built and deployed applications:

- `about/`: Next.js NLeSC portfolio
- `ctw.studio/`: static CTW Studio portfolio and Signals pages
- `ctw.studio2/`: alternate static portfolio
- `dashboard/`: Bun Signals dashboard
- `jessegonzalez.dev/`: SvelteKit portfolio
- `ctw-kit/`: shared Svelte library used by `jessegonzalez.dev/`

Root `package.json` and `bun.lock` define Bun workspaces only for `ctw-kit/` and
`jessegonzalez.dev/`. Independent applications use their own app-local setup and
lockfiles.

## Vercel deployments

Each Vercel project must set its Root Directory to its application directory.
Framework-specific configuration belongs inside that application; do not add a
repository-root `vercel.json`. `about/` uses native Next.js/Vercel defaults,
`ctw.studio/` owns its static configuration, and `jessegonzalez.dev/` owns its
SvelteKit configuration.

### NLeSC route migration

`about/` is the canonical NLeSC source. Its default build preserves the legacy
Next.js deployment behavior. `ctw.studio/nlesc/` is the generated, committed
static export served at [ctw.studio/nlesc/](https://ctw.studio/nlesc/). Never
edit that generated subtree by hand.

Regenerate and synchronize the artifact:

```bash
cd about
bun install --frozen-lockfile
bun run static:sync
```

Rebuild and byte-compare the committed artifact:

```bash
cd about
bun run static:check
```

The `about/` app and its `nlesc-portfolio` Vercel project remain active until a
separate cutover is approved.

Keep cutover rollback-safe:

1. Verify a preview of the CTW Studio route.
2. Merge and deploy the CTW Studio route, then verify it in production.
3. Separately approve the legacy-domain redirect, then verify it.
4. After redirect verification, retire the legacy `nlesc-portfolio` Vercel
   project. Keep `about/` as the canonical source for `/nlesc/`.

## CTW Studio

Static portfolio site for [ctw.studio](https://ctw.studio). No build framework — plain HTML, CSS, and vanilla JS.

### Design system

The static [design-system guide](https://ctw.studio/design-system/) documents
shared CTW roles and components. It is intentionally absent from public
navigation while adoption remains staged.

Source hierarchy:

1. Root `DESIGN.md` owns normative intent and exportable token values.
2. `ctw.studio/design-system/tokens.css` implements browser role tokens;
   `components.css` implements framework-neutral components; `compositions.css`
   adds the scoped expressive tier.
3. `ctw.studio/design-system/index.html` owns reusable specimens and rules.
4. The guide plus `ctw.studio/index.html` and
   `ctw.studio/signals/index.html` collectively demonstrate shared contracts;
   the latter two are real pilots, and Signals maps its family accent to
   canonical cyan.
5. `ctw.studio/design-system/tokens.json` is generated DTCG output, not a
   hand-edited source.

Verify the contract from the repository root:

```bash
npx --yes @google/design.md@0.3.0 lint DESIGN.md
npx --yes @google/design.md@0.3.0 export --format dtcg DESIGN.md > /tmp/ctw-design-tokens.json
diff -u ctw.studio/design-system/tokens.json /tmp/ctw-design-tokens.json
node --test ctw.studio/design-system/tests/design-system.test.mjs
npx --yes @playwright/test@1.62.0 install chromium
npx --yes --package=@playwright/test@1.62.0 -- sh -c 'NODE_PATH="$(dirname "$(dirname "$(command -v playwright)")")" playwright test --config ctw.studio/design-system/tests/playwright.config.cjs'
(cd ctw.studio && node --test signals/tests/*.test.mjs)
```

Visual audit writes compact and wide screenshots plus HTML report under
`ctw.studio/design-system/test-results/`. CI uploads that directory, including
first-retry traces, as `ctw-design-system-visual-audit` for 14 days.

Adoption is opt-in: wrap migrated markup in `.ctw-scope`, load role tokens and
components, then load compositions only where expressive contracts are used.
`compat.css` provides only
approved role-backed aliases for existing variable names. Keep Signals
page-scoped accents local. This route adds no SvelteKit or other framework,
deployment, Vercel, or public-navigation change.

## Tech Stack

- **HTML/CSS/JS** — Static pages, no framework
- **Tailwind CSS** — Legacy/historical routes only; current landing does not depend on it
- **Google Fonts** — Inter and DM Mono with system fallbacks
- **Vercel** — Hosting and deployment

## Structure

```
ctw.studio/
├── index.html              # Landing page
├── homepage.css            # Thin landing-only layout
├── design-system/          # Tokens, components, compositions, guide, tests
├── tailwind.css             # Generated Tailwind CSS (do not edit directly)
├── tailwind.config.js       # Tailwind configuration
├── portfolio/
│   ├── index.html           # Portfolio grid page
│   ├── portfolio.css        # Portfolio styles + utility classes
│   ├── projects.js          # Project data
│   └── projects/            # Project media assets
├── favicon.png
└── og-image.png
```

## Adding a New Project

Edit `ctw.studio/portfolio/projects.js`. Each project object supports these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | URL-friendly slug (used in `#hash` routing) |
| `title` | string | yes | Project name |
| `client` | string | yes | Client or institution name |
| `category` | string | yes | Short category label (e.g. "Climate Science") |
| `headline` | string | yes | Detail page headline |
| `description` | string | yes | Multi-paragraph description (template literal) |
| `coverImage` | string\|null | yes | Path to cover image (relative to portfolio/), or `null` for gradient |
| `gradientFrom` | string | - | Gradient start color (when `coverImage` is null) |
| `gradientTo` | string | - | Gradient end color (when `coverImage` is null) |
| `gridSpan` | number | yes | Grid width: `1` (1/3), `3` (1/2), or `4` (2/3) |
| `liveUrl` | string\|null | - | Live site URL |
| `repoUrl` | string | - | GitHub repository URL |
| `blogUrl` | string | - | Related blog post URL |
| `tags` | string[] | yes | Technology/topic tags |
| `institution` | string\|null | - | Associated institution badge |
| `gallery` | array | yes | Media items for detail view (see below) |

### Gallery items

```js
{ type: 'image', src: 'projects/my-project/img.avif', caption: 'Optional caption' }
{ type: 'video', src: 'projects/my-project/demo.mp4', caption: 'Optional caption' }
{ type: 'pair',  src: 'projects/my-project/a.avif', src2: 'projects/my-project/b.avif', caption: 'Optional caption' }
```

### Image guidelines

- Use **AVIF** format for all images (convert with `avifenc --min 20 --max 40 input.png output.avif`)
- Place media in `ctw.studio/portfolio/projects/<project-id>/`
- Cover images are displayed in the grid; gallery images appear in the detail view
- Images use `loading="lazy"`, `decoding="async"`, and CSS fade-in on load
- The first 3 grid cards use `fetchpriority="high"` instead of lazy loading

## Landing page

`ctw.studio/index.html` is static HTML styled by scoped design-system CSS and
`homepage.css`. It has no JavaScript rendering dependency or app bundler.
Google Fonts use normal preconnect and stylesheet links, and `feedback.js` is
progressive enhancement.

`ctw.studio/tailwind.css` remains generated for legacy routes. Do not edit it
directly. When changing Tailwind classes on those routes, rebuild from
`ctw.studio/`; `tailwind.config.js` owns the scanned route list:

```bash
cd ctw.studio
bunx tailwindcss -i <(echo '@tailwind base; @tailwind components; @tailwind utilities;') -o tailwind.css --minify
```

## License

MIT

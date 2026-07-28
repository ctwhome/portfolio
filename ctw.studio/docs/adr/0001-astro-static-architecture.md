# ADR 0001: Astro static architecture

- Status: Accepted
- Date: 2026-07-28

## Context

CTW Studio combined maintained HTML, Signals evidence briefs, portfolio
interaction, workshop/legal content, a design guide, historical experiments,
and a generated NLeSC export. Shared metadata and shell behavior had drifted,
while stable URLs and byte-identical historical artifacts constrained a
framework migration.

## Decision

Use Astro static output with `ctw.studio/` as project root.

- Astro pages and reusable layouts own 16 maintained routes.
- `DocumentHead.astro` owns canonical, Open Graph, Twitter, font, icon, and
  design-system metadata.
- Every Astro layout imports one shared Fontsource stylesheet. Variable Inter
  and DM Mono 400/500 are pinned, bundled, and served locally.
- Tailwind utilities map to CTW semantic roles in `src/styles/global.css`;
  design tokens remain authoritative in `DESIGN.md` and browser CSS.
- Svelte remains an island boundary, not an app-wide runtime. Portfolio dialog
  control is hydrated; substantive project HTML remains server-rendered.
- `@floating-ui/dom` stays pinned but must add zero built bytes until a real
  positioned interaction requires it.
- `ClientRouter` progressively enhances safe landing/portfolio navigation.
  Signals links retain native reloads because route-local scripts and evidence
  state require clean initialization. Workshop and guide remain native.
- `prefers-reduced-motion: reduce` removes nonessential animation.
- `preserve.manifest.json` deterministically copies historical routes, runtime
  assets, committed evidence, and generated NLeSC files with byte verification.
- Preserved `/signals/roadmap/` bytes remain a redirect source, not deployed
  content; Vercel permanently redirects that path to `/signals/`.
- Astro-rendered legal pages use directory output matching production:
  `/workshop/privacy/` and `/workshop/terms/`.

## Alternatives

### Keep handwritten HTML

Rejected. It preserved zero-build simplicity but duplicated document metadata,
shells, route auditing, and migration logic across maintained pages.

### SvelteKit

Rejected for this site. SvelteKit provides richer application primitives but
would broaden runtime and routing change beyond mostly static content.
Astro supplies reusable static composition while retaining optional Svelte
islands.

### Starlight for design documentation

Rejected. Existing human-facing guide already tests real system specimens.
Another documentation framework would duplicate navigation and styling.

## Performance evidence and budgets

Static output, selective hydration, stable asset URLs, responsive portfolio
covers, and zero unused Floating UI code keep runtime small. Final performance
gate uses median of three real Lighthouse runs.

- Home: performance ≥90, accessibility 1.0, CLS ≤0.01.
- Portfolio: performance ≥80, accessibility 1.0, LCP ≤2500ms, TBT ≤200ms,
  CLS ≤0.1, transfer ≤1.25MiB.
- Signals atlas: performance ≥90, accessibility 1.0, CLS ≤0.01.
- Representative Signals brief: performance ≥80, accessibility 1.0,
  CLS ≤0.1.
- Workshop and design guide: performance ≥90, accessibility 1.0, CLS ≤0.01.

## Consequences

Maintained content now uses Astro syntax and shared layouts. Builds require Bun
and emit `dist/`. Preservation remains release-critical and stays covered by
output tests. Historical artifacts and NLeSC remain outside Astro ownership.
Client transitions cannot cross Signals without explicit reload semantics.

Rollback uses last known-good static commit and its deployment artifact. Do not
reconstruct rollback by mixing generated output from different commits.

Hosting configuration, publication, production verification, domain changes,
redirect approval, and legacy-project retirement are operational decisions
outside this ADR.

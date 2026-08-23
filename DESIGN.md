---
version: alpha
name: CTW Studio Design System
description: Role-first editorial design system for CTW Studio and its evidence products.
colors:
  primary: "#f7b500"
  palette-coal: "#050505"
  palette-coal-raised: "#11110f"
  palette-chalk: "#f4f1e8"
  palette-paper: "#fffdf6"
  palette-amber: "{colors.primary}"
  palette-cyan: "#57d7ff"
  palette-coral: "#ff6b5f"
  palette-violet: "#a58bff"
  palette-positive: "#61d095"
  palette-critical: "#ff6b5f"
  coal-surface: "{colors.palette-coal}"
  coal-surface-raised: "{colors.palette-coal-raised}"
  coal-text: "{colors.palette-chalk}"
  coal-text-muted: "#aaa79f"
  coal-border: "#3b3a36"
  coal-control-border: "#6f6c63"
  coal-action: "{colors.palette-amber}"
  coal-action-text: "{colors.palette-coal}"
  chalk-surface: "{colors.palette-chalk}"
  chalk-surface-raised: "{colors.palette-paper}"
  chalk-text: "{colors.palette-coal}"
  chalk-text-muted: "#5f5c55"
  chalk-border: "#b8b3a8"
  chalk-control-border: "#88847b"
  chalk-action: "#8a5f00"
  chalk-action-text: "{colors.palette-paper}"
  chalk-positive: "#12663d"
  chalk-critical: "#a3231e"
  role-surface: "{colors.coal-surface}"
  role-surface-raised: "{colors.coal-surface-raised}"
  role-text: "{colors.coal-text}"
  role-text-muted: "{colors.coal-text-muted}"
  role-border: "{colors.coal-border}"
  role-control-border: "{colors.coal-control-border}"
  role-action: "{colors.coal-action}"
  role-action-text: "{colors.coal-action-text}"
  role-focus: "{colors.palette-amber}"
  role-positive: "{colors.palette-positive}"
  role-critical: "{colors.palette-critical}"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: "1"
    letterSpacing: -0.04em
  heading-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: "1.08"
    letterSpacing: -0.03em
  heading-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 650
    lineHeight: "1.2"
    letterSpacing: -0.02em
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: "1.55"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: "1.6"
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: "1.5"
  label:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: 12px
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: 0.08em
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: "1.1"
  badge:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: 12px
    fontWeight: 500
    lineHeight: "1.2"
    letterSpacing: 0.05em
rounded:
  none: 0px
  control: 2px
  card: 4px
  pill: 9999px
spacing:
  0: 0px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 24px
  6: 32px
  7: 48px
  8: 64px
  9: 96px
  touch-target: 44px
  container: 1200px
components:
  button-primary:
    backgroundColor: "{colors.role-action}"
    textColor: "{colors.role-action-text}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "{spacing.3}"
    height: "{spacing.touch-target}"
  button-secondary:
    backgroundColor: "{colors.role-surface}"
    textColor: "{colors.role-text}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "{spacing.3}"
    height: "{spacing.touch-target}"
  card:
    backgroundColor: "{colors.role-surface-raised}"
    textColor: "{colors.role-text}"
    rounded: "{rounded.card}"
    padding: "{spacing.5}"
  badge:
    backgroundColor: "{colors.role-surface-raised}"
    textColor: "{colors.role-text-muted}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "{spacing.2}"
  field:
    backgroundColor: "{colors.role-surface}"
    textColor: "{colors.role-text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "{spacing.3}"
    height: "{spacing.touch-target}"
  masthead:
    backgroundColor: "{colors.role-surface}"
    textColor: "{colors.role-text}"
  nav-link:
    backgroundColor: "{colors.role-surface}"
    textColor: "{colors.role-text-muted}"
    typography: "{typography.badge}"
    rounded: "{rounded.none}"
    padding: "{spacing.3}"
    height: "{spacing.touch-target}"
  chart-frame:
    backgroundColor: "{colors.role-surface-raised}"
    textColor: "{colors.role-text}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "{spacing.5}"
  feedback-control:
    backgroundColor: "{colors.role-surface}"
    textColor: "{colors.role-text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "{spacing.3}"
---

# CTW Studio Design System

## Overview

This file is normative for new shared CTW Studio UI. Machine-readable values
above are source for `ctw.studio/design-system/tokens.json`; CSS implementation
lives in `ctw.studio/design-system/tokens.css`. Prose explains intent and
boundaries. When values conflict, front matter wins; when adoption behavior
conflicts, this prose wins.

CTW Studio should feel like an editorial systems-engineering notebook: coal,
chalk, amber, measured typography, visible structure, and evidence before
decoration. Decide pages make choices legible. Learn pages make provenance and
uncertainty legible. Neither should resemble a generic product dashboard.

Expressive direction is intentionally weighted: **70% Editorial Signal, 20%
Research Instrument, 10% Kinetic Studio**. Editorial hierarchy leads; coordinate
rules, numbered observations, source labels, margin annotations, scale/crop/
registration marks, and visible data boundaries establish instrument character;
restrained CSS-first motion supplies kinetic emphasis.

### Principles

1. **Roles before pigments.** Components consume surface, text, border, action,
   focus, positive, and critical roles. Themes map roles to palette values.
2. **Evidence travels with claims.** Scope, period, population, denominator,
   unit, evidence type, and source remain visible.
3. **Structure supplies depth.** Rules, spacing, type, and tonal steps establish
   hierarchy; decoration does not.
4. **Variation stays controlled.** Signals accents communicate subject identity
   or data series. They never silently redefine action or status meaning.
5. **Adoption stays staged.** Existing routes keep working while shared shells
   and high-reuse components migrate in measured waves.

### Source hierarchy and ownership

| Source | Authority | Owner | Rule |
|---|---|---|---|
| `DESIGN.md` | Normative intent and exportable values | CTW Studio maintainers | Review first |
| `ctw.studio/design-system/tokens.css` | Browser token implementation | CTW Studio maintainers | Keep aligned with front matter |
| `ctw.studio/design-system/components.css` | Framework-neutral shared classes | CTW Studio maintainers | Components use role tokens only |
| `ctw.studio/design-system/compositions.css` | Expressive page-level contracts | CTW Studio maintainers | Scoped, opt-in, specimen-backed |
| `ctw.studio/design-system/compat.css` | Approved migration aliases | Route owner + design-system owner | Add aliases deliberately |
| `ctw.studio/src/pages/design-system/index.astro` + `GuideLayout.astro` | Human examples and adoption guide | CTW Studio maintainers | Built examples must match contracts |
| Route-local CSS | Intentional exceptions and topic data accents | Route/family owner | Never promoted by accident |

Generated `ctw.studio/nlesc` output remains owned by `about/` and outside this
system. Unrelated application roots keep their own design decisions.

### Current-state route and family audit

Exactly 42 deployed routes are in scope. Maintained routes render through Astro;
manifest-owned historical routes remain byte-identical. “Observe” means
documented current state, not automatic migration.

| Family | Route | Current state | Owner | Adoption |
|---|---|---|---|---|
| Studio landing | `/` | Current coal/amber landing | Studio | Wave 2 |
| Studio landing | `/index-0.html` | Historical landing experiment | Studio | Observe |
| Studio landing | `/index-1.html` | Historical landing experiment | Studio | Observe |
| Studio landing | `/index-1a.html` | Historical landing experiment | Studio | Observe |
| Studio landing | `/index-2.html` | Historical landing experiment | Studio | Observe |
| Studio offer | `/stand-out/` | Local-business rebrand and promotion landing | Studio | Wave 1 |
| Design system | `/design-system/` | Maintained Astro guide | Design system | Wave 1 |
| Portfolio | `/new/` | Editorial portfolio exploration | Portfolio | Wave 3 |
| Portfolio | `/portfolio/` | Project grid and detail surface | Portfolio | Wave 3 |
| Writing | `/writing/` | Archive index | Writing | Wave 1 |
| Writing | `/writing/2018-03-11-webpack-problem-with-source-maps-mapping-in-chrome-devtools-fixed/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2018-07-10-focusdiamond/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2018-09-11-beginning-to-understand-the-regular-expressions-in-javascript/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2019-10-08-the-ultimate-infographic-for-seo/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2020-09-01-the-53-rule-the-ultimate-productivity-schedule-a-game-changer-for-your-day/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2021-03-12-nuxt-with-supabase-template-recipe/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2023-07-11-vps-home-server-with-docker-compose-reverse-proxy-and-automatic-ssl/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2023-09-17-prevention-is-the-new-medicine-welcome-to-medicine-3-0/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2023-10-13-the-power-of-interaction-design-ixd-sketching-wireframing-and-prototyping-in-digital-product-development/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2023-11-11-post-google-era-how-google-shaped-the-way-we-create-and-consume-knowledge-and-how-chatgpt-is-revolutionizing-it/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2024-04-26-the-future-of-image-and-video-format/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2024-10-06-modern-education-system/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2024-10-10-my-blueprint/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2025-01-27-the-archaitect-era/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2025-05-30-call-me-jesse/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2025-07-08-media-noise-and-oncemag/` | Archived article | Writing | Wave 1 |
| Writing | `/writing/2025-10-05-remote-work-drives-productivity-and-wellbeing-while-cutting-costs-dramatically/` | Archived article | Writing | Wave 1 |
| Signals | `/signals/` | Atlas and topic switcher | Signals | Wave 1 |
| Signals | `/signals/ai-work/` | Evidence brief | Signals | Wave 2 |
| Signals | `/signals/demography/` | Evidence brief | Signals | Wave 2 |
| Signals | `/signals/education/` | Evidence brief | Signals | Wave 2 |
| Signals | `/signals/financial-fragility/` | Evidence brief | Signals | Wave 2 |
| Signals | `/signals/food/` | Evidence brief | Signals | Wave 2 |
| Signals | `/signals/healthspan/` | Evidence brief | Signals | Wave 2 |
| Signals | `/signals/housing/` | Evidence brief | Signals | Wave 2 |
| Signals | `/signals/real-time-ai/` | Evidence brief | Signals | Wave 2 |
| Signals | `/signals/science/` | Evidence brief | Signals | Wave 2 |
| Workshop | `/workshop/` | Course landing | Workshop | Wave 3 |
| Workshop | `/workshop/pitch/` | Reveal presentation | Workshop | Observe |
| Workshop | `/workshop/privacy/` | Legal content | Workshop | Wave 3 |
| Workshop | `/workshop/slides/` | Reveal presentation | Workshop | Observe |
| Workshop | `/workshop/terms/` | Legal content | Workshop | Wave 3 |

`/signals/roadmap/` remains a byte-preserved redirect source, not deployed
content; Vercel permanently redirects it to `/signals/`.

## Colors

Coal and chalk form reversible editorial themes. Amber identifies interaction
and focus in coal theme. Chalk theme uses a darker amber role so text and
controls retain contrast. Positive and critical colors carry stable meaning;
never use topic accents for those states.

Canonical CSS exposes palette tokens for theme authors and role tokens for
component authors. `.ctw-theme-coal` and `.ctw-theme-chalk` remap roles.
Components must not read `--ctw-palette-*`.

Signals cyan, coral, and violet are controlled coal-surface accents. Keep
topic/chart/page variables local, mapping to canonical palette tokens only when
values and meaning match. On chalk, compositions map these bright spectral
accents to the accessible action role unless a separately verified dark accent
token exists. A topic accent may mark a series, annotation, or section key; it
must not become generic link, focus, success, or error color.

Both themes target WCAG 2.2 AA: 4.5:1 for normal text, 3:1 for large text and
meaningful non-text boundaries. Authors must test real foreground/background
pairs, not isolated swatches.

## Typography

Inter carries narrative, navigation, headings, and controls. DM Mono carries
metadata, evidence labels, units, timestamps, and small system annotations.
Maintained Astro routes self-host variable Inter and DM Mono 400/500 through
pinned app-local Fontsource packages. Fallback stacks are mandatory; content
remains complete while web fonts load or fail.

Display type is reserved for one page proposition. Use sentence case and tight
tracking. Body copy stays at least 16px for primary reading. Metadata may be
12px only with strong contrast and adequate line height. Do not render long
paragraphs in mono or uppercase.

Responsive display sizes use CSS `clamp()` because alpha DESIGN.md exports
cannot encode fluid type. Preserve token endpoints and avoid adding extra steps.
Display compositions may use tighter tracking down to `-0.075em`, controlled
wraps, section numerals, one-pixel outline text, or flat inverted text fields.
Keep body copy readable and never outline long-form text.

## Layout

Base rhythm is 4px, with common composition steps at 8, 16, 24, 32, 48, 64,
and 96px. Default container caps at 1200px. Reading measures cap near 70
characters. Layout uses CSS grid and flexbox; no framework utility dependency.

Canonical breakpoints are CSS/spec details because alpha token export cannot
represent media queries:

- compact: below 48rem;
- wide: 64rem and above;
- maximum content: 75rem.

Interactive targets are at least 44 by 44px on compact layouts. Responsive
reflow must preserve source order, labels, tables, and evidence context. Tables
may scroll inside a labelled region; content must not disappear.

### Adoption waves

1. **Wave 1 — shared contract:** land specification, roles, lab, tests, and use
   new classes for new work.
2. **Wave 2 — high reuse:** migrate Signals shell, focus, source/evidence
   treatments, then current landing shell. Keep topic chart variables local.
3. **Wave 3 — families:** migrate portfolio, workshop, legal, and form patterns
   route by route with visual review.
4. **Observe:** historical experiments, presentation runtimes, and redirects
   receive accessibility fixes only unless separately approved.

## Elevation & Depth

CTW uses flat depth. Raised surfaces differ by tonal step and border; hover
states may translate by at most 1px. Shadows are exceptional, subtle, and never
needed to understand containment. No glass, backdrop blur, or decorative
gradient is part of canonical language.

Motion duration is 140ms for small state changes and 220ms for deliberate
reveals, using a standard ease-out curve. Under `prefers-reduced-motion:
reduce`, remove non-essential animation and scrolling; state changes remain
immediate and understandable.

Expressive compositions may overlap, crop, inset, stack rules, offset flat
planes, use full-bleed media, or keep a chapter label sticky. They do not use
glassmorphism, soft shadow-heavy card UI, decorative gradients, or generic
bento layouts.

## Shapes

Edges are engineered, not bubbly. Controls use 2px radius, cards use 4px, and
pills are reserved for compact categorical badges. Do not put every label in a
pill. Hairline borders and square section rules carry most grouping.

## Components

Shared classes are opt-in beneath `.ctw-scope`; they never reset current pages.
Theme class belongs on or above the scope. `components.css` owns:

- shell, masthead, wordmark, primary navigation, and container;
- display, heading, body, and mono labels;
- links and primary/secondary buttons;
- cards and badges;
- fields and validation text;
- chart frames and feedback controls;
- responsive tables;
- evidence, claim, and source semantics;
- skip link, focus treatment, and footer.

`compositions.css` is a second opt-in tier. Every public class must appear in
the guide or a real pilot. It owns oversized/split heroes, full-width showcase,
case-study facts, argument/evidence sequence, annotated media/captions,
statistical statements, chapter dividers/sticky labels, horizontal project
indexes, source-led chart stories, observations/margin notes, quotes,
article/brief metadata, pagination/related content, system states, closing
thesis/action, and complete footers.

Research-instrument marks expose real structure. Coordinate labels, crop/scale
marks, registration corners, annotations, and data boundaries must describe
the represented object; never use them to imply false precision.

Motion is CSS-first and optional. Content order and meaning remain complete
without JavaScript. `prefers-reduced-motion: reduce` removes scanning,
translation, and smooth scrolling while preserving immediate state feedback.

### Controlled variants

- **Theme:** `.ctw-theme-coal` or `.ctw-theme-chalk`.
- **Button:** primary action or secondary boundary; one primary per decision
  cluster. Disabled buttons require the native `disabled` attribute;
  `aria-disabled` alone does not disable behavior.
- **Card:** default or evidence; evidence adds provenance structure, not visual
  spectacle.
- **Badge:** neutral, positive, critical, or topic accent. Meaning needs text.
- **Page intent:** Decide emphasizes action sequence; Learn emphasizes reading
  measure, evidence type, source, and uncertainty.
- **Expressive accent:** amber is default; cyan, coral, and violet are flat
  structural aliases on coal surfaces. Chalk uses its accessible action role
  unless a separately verified dark accent token exists. Accents do not
  redefine focus, success, or error.

### Shell, masthead, and navigation

Shared owners maintain shell width, masthead structure, wordmark treatment,
navigation wrapping, current state, focus, and 44px targets. Route owners choose
links and set native `aria-current` on the current destination; they do not
replace shared focus or target behavior. Masthead remains a semantic `header`,
primary links remain inside a labelled `nav`, and compact wrapping preserves
source order without horizontal page overflow.

### Charts

Shared owners maintain chart frame, caption, spacing, and table-fallback
contract. Page owners maintain truthful data, units, period, accessible SVG
name and description, series accents, and source. Every chart uses `figure` and
`figcaption`; static SVG carries an accessible name, and a real table exposes
the same values without script or visual interpretation.

### Feedback

Shared owners maintain fieldset, legend, control spacing, focus, and 44px label
targets. Page owners write the question and options. Use native `fieldset`,
`legend`, and radio inputs; feedback stays usable without JavaScript. Submission
behavior is route-local and must never be implied by a non-submitting specimen.

### Accessibility contract

- Begin with a visible-on-focus skip link and one main landmark.
- Keep heading levels ordered and controls natively semantic.
- Every field has a persistent label; errors are text and linked with
  `aria-describedby`.
- Focus uses a strong 3px role-focus outline with 3px offset.
- Never remove focus indication without replacement.
- Links remain recognizable without color alone.
- Tables include captions and header scope.
- Evidence labels name epistemic type: observation, association, experiment,
  exposure, forecast, scenario, counterfactual, judgment, or hypothesis.
- Core guide and route content remains available without JavaScript.
- Empty, loading, unavailable, and error states keep context and use text, not
  animation or color alone.

Privacy is a documented implementation trigger, not a speculative component.
Add consent UI only when actual storage or processing creates a legal or
ethical choice. Do not ship placeholder banners.

### Migration checklist

- [ ] Identify family owner, page intent, and controlled theme/accent.
- [ ] Load `tokens.css`, then `components.css`; load `compat.css` only when an
      approved alias is required.
- [ ] Load `compositions.css` only for an expressive route or specimen using its
      contracts.
- [ ] Add `.ctw-scope` without changing unrelated descendants.
- [ ] Replace repeated raw values with role tokens; keep meaningful data/topic
      variables local.
- [ ] Use native elements before classes: landmarks, headings, links, buttons,
      labels, inputs, captions, tables.
- [ ] Verify hover, focus-visible, active, disabled, invalid, empty, loading,
      unavailable, error, and long-content states that exist on route.
- [ ] Test keyboard order, skip link, contrast, 200% zoom, reduced motion, and
      no-JS reading.
- [ ] Inspect compact and wide layouts with 44px touch targets.
- [ ] Run design-system and affected family tests.
- [ ] Confirm `ctw.studio/nlesc`, preserved route assets, committed evidence,
      updater semantics, and deployment configuration remain in scope.

## Do's and Don'ts

- Do use roles in components; don't couple components to raw palette tokens.
- Do make decision paths and evidence strength visible; don't invent fake
  metrics or dashboard chrome.
- Do keep Signals accents purposeful and local; don't turn them into global
  status or action colors.
- Do keep bright spectral accents on coal surfaces; on chalk use the accessible
  action role unless a separately verified dark accent token exists.
- Do use rules, type, and spacing for hierarchy; don't add glass, ornamental
  gradients, oversized rounded containers, or floating-card clutter.
- Do write specific editorial copy; don't ship filler, generic hero triptychs,
  or “AI-powered” visual clichés.
- Do preserve no-JS content and native semantics; don't require animation or
  script to reveal essential information.
- Do migrate one family contract at a time; don't restyle all routes in one
  change.

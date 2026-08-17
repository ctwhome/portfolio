# ADR 0002: Native progressive enhancement

- Status: Accepted
- Date: 2026-07-28
- Supersedes: ADR 0001 client runtime decisions

## Context

ADR 0001 introduced one markup-free Svelte island and Astro ClientRouter for
home/portfolio navigation. Both added runtime code without owning rendered
content. Floating UI remained unused. Native cross-document view transitions
now cover the intended visual continuity.

## Decision

- Every route uses native document navigation.
- Existing `@view-transition { navigation: auto }` provides progressive
  cross-document transitions. Static CSS names the wordmark and
  home/portfolio lead; reduced-motion rules remain authoritative.
- Portfolio dialog behavior uses one processed TypeScript module imported only
  by `/portfolio/`. Server-rendered HTML remains complete without JavaScript.
- Portfolio history, direct and malformed hashes, focus, scroll, lazy media,
  and body locking retain their existing contracts. The controller manages
  dialog-local state; native document history owns away/back scroll restoration.
- Feedback runs once per document behind its existing idempotence guard.
- Svelte, Astro's Svelte integration, Floating UI, ClientRouter, islands, and
  router-only attributes leave CTW Studio.

## Consequences

Home and portfolio navigation becomes full-document navigation with no router
or polyfill. Native view transitions enhance supporting browsers; other
browsers navigate normally. Portfolio remains its only controller consumer,
and browser restoration works through bfcache or ordinary history reload.

ADR 0001 remains authoritative for static route ownership, metadata, design
system, preservation, legal URLs, Signals boundaries, and operational limits.

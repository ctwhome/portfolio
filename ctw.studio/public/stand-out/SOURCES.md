# Stand Out asset provenance

All imagery in this directory is original, deterministic procedural raster
material generated locally for `/stand-out/` by
`scripts/generate-stand-out-assets.mjs`.

- `signal-poster.avif`: pixel-generated ember focus, horizon line, and grain;
  static fallback for the hero signal canvas.
- `beauty-material.avif`: pixel-generated folds, flare, and grain; no person,
  treatment, premises, customer, or result is depicted.
- `restaurant-material.avif`: pixel-generated light pool and textile-like
  grain; no dish, venue, staff member, or customer is depicted.
- `home-services-material.avif`: pixel-generated grid, light, and structural
  line; no property, tradesperson, completed work, or customer is depicted.

Method: seeded integer noise plus mathematical color fields written directly
to RGB pixel buffers, then encoded to AVIF with repository-installed `sharp`.
No remote media, stock media, generative-image model, or customer asset was
used.

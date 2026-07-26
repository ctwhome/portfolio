# CTW Signals

A lightweight, evidence-led dashboard inside `ctw.studio`. It treats important claims as inspectable briefings rather than a stream of context-free metrics.

## Published briefs

- **Signals atlas** (`index.html`) — the shared five-question evidence contract, three geographic lenses and the ten-subject publication roadmap.
- **Brief 001 · AI & work** (`ai-work/index.html`) — observed U.S. labor-market conditions, global AI exposure, early-career signals, employer expectations, adoption and productivity evidence.
- **Brief 002 · Food, animals & the planet** (`food/index.html`) — animal slaughter, fish-count uncertainty, livestock emissions, product footprints, land, deforestation, water, oceans and health evidence.
- **Brief 003 · Housing & affordability** (`housing/index.html`) — world housing adequacy, Dutch prices, rents, financing, tenure burden, supply and household formation, plus mechanism-led country comparisons.
- **Brief 004 · Science & discovery** (`science/index.html`) — R&D inputs, publication volume, reliability, open data/software, translation and demonstrated AI-assisted acceleration kept separate.
- **Brief 005 · Healthspan & care** (`healthspan/index.html`) — lifespan, healthy life years, avoidable mortality, access, workforce, spending and AMR with explicit evidence-category boundaries.

## Files

- `index.html` and `atlas.css` — Signals Atlas homepage and ten-subject roadmap
- `ai-work/index.html` — AI/jobs editorial storyboard and accessible chart containers
- `dashboard.js` — dependency-free AI/jobs rendering and interactions
- `signals.css` — shared Signals visual system plus Brief 001 components
- `data/ai-jobs.json` — curated AI/jobs evidence and baked FRED/BLS observations
- `scripts/update_fred.py` — no-key refresh for FRED/BLS CSV series
- `food/index.html` — food-system editorial storyboard
- `food/food.js` — dependency-free food charts and source ledger
- `food/food.css` — Brief 002 visual components
- `data/food-system.json` — curated food-system evidence and baked observations
- `scripts/update_food_data.py` — no-key refresh for FAO slaughter and product-footprint data via OWID
- `housing/index.html` — Brief 003 housing storyboard using the shared five-question / three-lens contract
- `housing/housing.js` and `housing/housing.css` — dependency-free housing charts, interactions and visual layer
- `data/housing.json` — curated housing interpretation plus baked World Bank, OECD, Eurostat, CBS and ECB observations
- `scripts/update_housing_data.py` — no-key refresh for eight official housing source series
- `roadmap/index.html` — noindex static fallback for the permanently redirected former Atlas route
- `science/index.html`, `science/science.js`, `science/science.css` — Brief 004 page, dependency-free renderer and topic composition
- `data/science.json` — official science series plus manually curated primary evidence and source ledger
- `scripts/update_science_data.py` — no-key World Bank refresh for R&D intensity and journal-article series
- `healthspan/index.html`, `healthspan/healthspan.js`, `healthspan/healthspan.css` — Brief 005 page, renderer and topic composition
- `data/healthspan.json` — life/healthy-life outcomes, workforce series, evidence boundaries and source ledger
- `scripts/update_healthspan_data.py` — no-key World Bank and Eurostat refresh for life expectancy, physicians and healthy life years
- `tests/*.test.mjs` — source/data/markup integrity checks

## Refreshing the data

From `ctw.studio/`:

```bash
python3 signals/scripts/update_fred.py
python3 signals/scripts/update_food_data.py
python3 signals/scripts/update_housing_data.py
python3 signals/scripts/update_science_data.py
python3 signals/scripts/update_healthspan_data.py
node --test signals/tests/*.test.mjs
```

The scripts fetch and bake observations into JSON. Visitors do not call upstream APIs, so the public pages stay fast, deterministic and private.

The AI/jobs updater downloads FRED CSV series sourced from BLS:

- `JTSJOL` — total nonfarm job openings
- `JTSHIL` — total nonfarm hires
- `UNRATE` — unemployment rate

The food-system updater downloads:

- FAOSTAT slaughter observations republished in the OWID Grapher
- Poore & Nemecek product-level supply-chain footprints republished in the OWID Grapher

The housing updater downloads and reconciles:

- World Bank / UN-Habitat urban slum share and matching world urban population
- OECD analytical house-price, rent, price-to-income and price-to-rent indices
- Eurostat housing-cost overburden and tenure shares
- CBS existing-home prices, dwelling-stock changes and private households
- ECB / DNB new-mortgage interest rates

The science updater atomically downloads:

- World Bank WDI R&D expenditure as a share of GDP, sourced from UNESCO UIS
- World Bank WDI scientific and technical journal-article counts
- Stanford HAI 2026 AI Index Figure 1.6.1 publication counts and AI share of computer-science publications

The healthspan updater downloads:

- World Bank WDI life expectancy at birth
- World Bank WDI physicians per 1,000 people
- Eurostat life expectancy and healthy life years at birth for EU27 and the Netherlands

Updaters validate source identity, geography, dimensions, chronology and minimum observation counts before writing. They fail closed on schema or definition gaps. Papers, benchmarks, regulatory material, AMR interpretation and other non-API evidence remain manually curated in JSON.

After any refresh:

1. Review the diff for revisions, missing observations and definition changes.
2. Confirm the source date and current-period labels.
3. Run the full test suite.
4. Inspect every affected page at desktop and mobile widths before publishing.
5. Commit the generated JSON with the source and script changes.

## Editorial rules

1. **Observations, experiments, exposure estimates and forecasts are different evidence types.** Label them.
2. **Scope travels with every number.** Preserve geography, population, period and denominator.
3. **Do not infer causation from timing alone.** AI-era labor movement is not automatically AI-caused.
4. **Do not convert agriculture-wide shares into livestock shares.** Irrigation, crops, livestock and aquaculture overlap but are not interchangeable.
5. **Do not combine official animal counts with modelled fish estimates.** Show the fish ranges and uncertainty separately.
6. **Relative risk is not absolute risk.** Explain IARC evidence classes and effect-size units.
7. **Scenarios are not forecasts.** A modelled plant-based land footprint says what a counterfactual system could require, not when behavior will change.
8. **Housing prices are not housing affordability.** Keep prices, rents, income, financing and total burden distinct.
9. **Country indices show change, not rank.** A 2015=100 comparison cannot establish absolute affordability.
10. **National housing totals do not prove allocation.** Location, tenure, price, suitability, vacancy and accumulated backlog remain material.
11. **Every new atlas brief answers the shared contract.** Show where we are, direction, distribution, competing explanations and what would change the conclusion, then label possibilities as hypotheses.
12. **Prefer primary sources.** Use syntheses only when they expose the underlying study and definitions.
13. **Publication volume is not discovery speed.** Keep inputs, output, reliability, translation and demonstrated acceleration separate.
14. **Lifespan is not healthy lifespan.** Do not combine population outcomes, system performance, individual risks, clinical evidence, consumer devices or speculative longevity.
15. **Waiting times need matching clocks and procedures.** Expose a data gap instead of ranking unlike definitions.
16. **Spending is allocation, not causal proof.** Prevention or treatment expenditure does not itself demonstrate an outcome.
17. **Guidance stays classified.** Observed evidence, conditional judgment, hypotheses and reversal indicators must remain visible.

## Adding the next brief

Follow the atlas contract in `index.html`: one data file, a reproducible no-key updater where feasible, an inspectable source ledger, explicit world / Europe-Netherlands / selected-country scopes, and tests that fail on silent data gaps or denominator changes.

## Verification

From `ctw.studio/`:

```bash
node --test signals/tests/*.test.mjs
node --check signals/dashboard.js
node --check signals/food/food.js
node --check signals/housing/housing.js
node --check signals/science/science.js
node --check signals/healthspan/healthspan.js
python3 -m py_compile signals/scripts/*.py
python3 -m http.server 4173
```

Probe `/signals/`, `/signals/ai-work/`, `/signals/food/`, `/signals/housing/`, `/signals/science/` and `/signals/healthspan/`. Confirm `/signals/roadmap` and `/signals/roadmap/` redirect exactly to `/signals/`. Inspect desktop and true-mobile viewports for console errors and horizontal overflow. Visitors receive baked JSON; no page calls upstream evidence APIs.

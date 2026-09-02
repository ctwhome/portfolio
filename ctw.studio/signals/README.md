# CTW Signals

A lightweight, evidence-led dashboard inside `ctw.studio`. It treats important claims as inspectable briefings rather than a stream of context-free metrics.

## Published briefs

- **Signals atlas** (`index.html`) — the shared five-question evidence contract, three geographic lenses and canonical ten-subject taxonomy.
- **Brief 001 · AI & work** (`ai-work/index.html`) — observed U.S. labor-market conditions, global AI exposure, early-career signals, employer expectations, adoption and productivity evidence.
- **Brief 002 · Food, animals & the planet** (`food/index.html`) — animal slaughter, fish-count uncertainty, livestock emissions, product footprints, land, deforestation, water, oceans and health evidence.
- **Brief 003 · Housing & affordability** (`housing/index.html`) — world housing adequacy, Dutch prices, rents, financing, tenure burden, supply and household formation, plus mechanism-led country comparisons.
- **Brief 004 · Science & discovery** (`science/index.html`) — R&D inputs, publication volume, reliability, open data/software, translation and demonstrated AI-assisted acceleration kept separate.
- **Brief 005 · Healthspan & care** (`healthspan/index.html`) — lifespan, healthy life years, avoidable mortality, access, workforce, spending and AMR with explicit evidence-category boundaries.
- **Brief 006 · Real-time AI** (`real-time-ai/index.html`) — bounded six-stage loops, timing classes, field reliability, authority, scale, exception handling and retained human work kept separate.
- **Brief 007 · Demography, migration & aging** (`demography/index.html`) — population stocks, migration flows, fertility, age structure, household formation, regional divergence and projections kept on their own clocks.
- **Brief 008 · Education & human capability** (`education/index.html`) — assessments, pathways, adult learning, teacher capacity and bounded AI-tutor experiments without a synthetic capability score.
- **Brief 009 · Financial fragility** (`financial-fragility/index.html`) — household, government, bank and pension balance sheets, flows, buffers and shock channels kept dimensionally separate.

## Canonical subject taxonomy

Atlas order, coverage and brief mapping:

| # | Subject | Atlas anchor | Published briefs |
|---|---|---|---|
| 1 | Housing & affordability | `/signals/#subject-housing-affordability` | Brief 003 |
| 2 | Food, animals & planet | `/signals/#subject-food-animals-planet` | Brief 002 |
| 3 | Healthspan & care | `/signals/#subject-healthspan-care` | Brief 005 |
| 4 | Work, education & human capability | `/signals/#subject-work-education-human-capability` | Briefs 001, 008 |
| 5 | Prosperity & financial security | `/signals/#subject-prosperity-financial-security` | Brief 009 |
| 6 | Energy, compute & infrastructure | `/signals/#subject-energy-compute-infrastructure` | Planned |
| 7 | Demography, migration & aging | `/signals/#subject-demography-migration-aging` | Brief 007 |
| 8 | Democracy, trust & information | `/signals/#subject-democracy-trust-information` | Planned |
| 9 | Science, discovery & AI systems | `/signals/#subject-science-discovery-ai-systems` | Briefs 004, 006 |
| 10 | Global resilience | `/signals/#subject-global-resilience` | Planned |

Current state: **9 published briefs**, **7 of 10 subjects with published coverage**, **3 planned subjects**. Coverage is not a completeness claim. Atlas and brief-page subject navigation uses seven canonical brief routes plus three visibly planned noninteractive rows; each brief marks its mapped subject with `aria-current="location"`. The Signals brand links to `/signals/`.

Every copy follows one static component contract: `.subject-menu` plus one placement class (`.atlas-topics`, `.topic-switcher`, `.evidence-topics`, `.housing-topics` or `.fragility-topics`), one `.subject-menu__brand`, and exactly ten `.subject-menu__option` children. Planned spans also use `.subject-menu__option--planned` with a `.subject-menu__badge`; `aria-current="location"` alone marks the mapped current subject.

`subject-menu.css` owns component layout, typography, states, options, badges, trigger, panel and responsive behavior. Page styles may use the retained placement class only for outer spacing. At 760px and below, `subject-menu.js` idempotently moves the ten options into a compact accessible disclosure. Without JavaScript, the static menu remains visible with seven canonical links and three noninteractive planned rows.

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
- `real-time-ai/index.html`, `real-time-ai/real-time-ai.js`, `real-time-ai/real-time-ai.css` — Brief 006 static evidence page, progressive case selection and topic composition
- `data/real-time-ai.json` — manually curated bounded-loop cases, timing and maturity taxonomies, reversal indicators, feedback risks and source ledger
- `demography/index.html`, `demography/demography.js`, `demography/demography.css` — Brief 007 page, dependency-free renderer and topic composition
- `data/demography.json` — population, fertility, age, migration, household, regional and projection evidence with source ledger
- `scripts/update_demography_data.py` — no-key World Bank refresh for population and 65+ share
- `education/index.html`, `education/education.js`, `education/education.css` — Brief 008 page, dependency-free renderer and topic composition
- `data/education.json` — assessment, pathway, adult-learning, teacher-capacity and AI-tutor evidence with source ledger
- `scripts/update_education_data.py` — no-key World Bank/UIS refresh for Dutch primary gross enrollment
- `financial-fragility/index.html`, `financial-fragility/financial-fragility.js`, `financial-fragility/financial-fragility.css` — Brief 009 page, dependency-free renderer and topic composition
- `data/financial-fragility.json` — dimensioned balance-sheet, series, distribution, safeguard and source-ledger evidence
- `scripts/update_financial_fragility_data.py` — no-key refresh for whitelisted BIS, ECB and Eurostat series
- `tests/*.test.mjs` — source/data/markup integrity checks

## Refreshing the data

From `ctw.studio/`:

```bash
python3 signals/scripts/update_fred.py
python3 signals/scripts/update_food_data.py
python3 signals/scripts/update_housing_data.py
python3 signals/scripts/update_science_data.py
python3 signals/scripts/update_healthspan_data.py
python3 signals/scripts/update_demography_data.py
python3 signals/scripts/update_education_data.py
python3 signals/scripts/update_financial_fragility_data.py
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

Real-time AI has no deterministic updater. Regulatory scope, intended use, papers, benchmarks, field evidence and maturity caveats receive a monthly editorial replay; no source is converted automatically into a maturity verdict.

The demography updater owns World Bank total-population and 65+ share observations. Eurostat age, fertility and migration extracts, CBS population/household/regional tables and the pinned UN WPP projection remain manually curated.

The education updater owns only the stable World Bank/UIS Dutch primary-enrollment series. PISA, learning-poverty estimates, Eurostat survey extracts, pathway and teacher evidence, and AI-tutor studies remain edition-pinned and manually reviewed.

The financial-fragility updater owns only whitelisted BIS household credit/debt-service, ECB new-mortgage-rate and Eurostat saving/government-finance series. ECB/EBA supervision, CBS distributions and DNB pensions remain manually reviewed.

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
18. **Real time is task-relative.** Evaluate bounded Sense → Interpret → Predict → Decide → Act → Observe loops against explicit deadlines, intended use and failure boundaries.
19. **Maturity flags are independent.** Demonstration, operation, reliability, approval and scale never imply one another; unknown is not failed and approval can be not applicable.
20. **Task automation is not position removal.** Require full-loop coverage, reliable operation, authority, integration, economics and exception handling before making a position-removal claim.
21. **Demographic flows are not stocks or projections.** Immigration, resident populations and conditional future variants keep distinct clocks, categories and assumptions.
22. **Education constructs do not collapse.** Assessment results, pathway access and AI-tutor experiments answer different questions; bounded study effects do not establish system-wide adaptation.
23. **Financial fragility has no defensible composite.** Preserve sector, stock/flow, denominator, liquidity, service burden and distribution instead of netting unlike balance-sheet dimensions.

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
node --check signals/real-time-ai/real-time-ai.js
node --check signals/demography/demography.js
node --check signals/education/education.js
node --check signals/financial-fragility/financial-fragility.js
python3 -m py_compile signals/scripts/*.py
python3 -m http.server 55039
```

Probe `/signals/`, `/signals/ai-work/`, `/signals/food/`, `/signals/housing/`, `/signals/science/`, `/signals/healthspan/`, `/signals/real-time-ai/`, `/signals/demography/`, `/signals/education/` and `/signals/financial-fragility/`. Confirm `/signals/roadmap` and `/signals/roadmap/` redirect exactly to `/signals/`. The updater list is the eight commands under “Refreshing the data”; run them only when intentionally refreshing committed evidence. Inspect desktop and true-mobile viewports for console errors and horizontal overflow. Visitors receive baked JSON; no page calls upstream evidence APIs.

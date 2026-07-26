# Repository agent guide

## Map and boundaries

- `ctw.studio/` is the static `ctw.studio` site: plain HTML, CSS, vanilla JS and baked JSON. Its local `vercel.json` serves that directory without a build.
- `ctw.studio/signals/` contains evidence briefs, topic renderers, `data/`, deterministic `scripts/`, and Node integrity tests.
- `jessegonzalez.dev/`, `about/`, `dashboard/` and `ctw-kit/` are separate applications. Do not cross-copy code or assume root Vercel settings deploy `ctw.studio/`.
- `ctw.studio/tailwind.css` is generated. Signals topic CSS is handwritten.

## Canonical commands

Run static Signals work from `ctw.studio/`:

```bash
python3 -m http.server 4173
node --test signals/tests/*.test.mjs
node --check signals/dashboard.js
node --check signals/food/food.js
node --check signals/housing/housing.js
node --check signals/science/science.js
node --check signals/healthspan/healthspan.js
node --check signals/demography/demography.js
node --check signals/education/education.js
node --check signals/financial-fragility/financial-fragility.js
python3 -m py_compile signals/scripts/*.py
python3 signals/scripts/update_fred.py
python3 signals/scripts/update_food_data.py
python3 signals/scripts/update_housing_data.py
python3 signals/scripts/update_science_data.py
python3 signals/scripts/update_healthspan_data.py
python3 signals/scripts/update_demography_data.py
python3 signals/scripts/update_education_data.py
python3 signals/scripts/update_financial_fragility_data.py
```

Use targeted tests and syntax checks while editing. Before handoff, run every Signals test, compile every updater, serve all routes/assets, inspect desktop and mobile layouts, and run `git diff --check`.

## Evidence architecture

- Browser code reads committed JSON only. Never add visitor-time evidence API calls or a chart runtime for Signals.
- Updaters own stable official no-key series and must validate schema, definitions, units, geography and chronology before writing.
- Papers, forecasts, experiments, interpretations and non-API evidence stay manually curated and source-auditable.
- Keep observation, association, experiment, exposure, forecast, scenario, counterfactual, judgment and hypothesis labels distinct.

## Durable pitfalls

- Scope, period, population, denominator and unit travel with every public number.
- Publication volume is not discovery; exposure is not job loss; lifespan is not healthy lifespan; unlike waiting-time clocks are not comparable; spending does not prove outcomes.
- Demographic flows are not population stocks or projections; keep timing, category and variant assumptions explicit.
- Assessment results, pathway access and AI-tutor experiments are distinct; bounded effects do not prove system-wide adaptation.
- Financial balance-sheet dimensions do not net into a composite; keep stocks, flows, service, liquidity, sector and denominator separate.
- Keep substantive HTML, accessible table alternatives, HTTPS source links and useful no-JS content.
- Preserve the atlas ten-topic order and verify counts, publication states, switchers and cross-links together.

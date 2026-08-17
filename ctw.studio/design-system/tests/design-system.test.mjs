import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const designDir = resolve(here, "..");
const studioDir = resolve(designDir, "..");
const rootDir = resolve(studioDir, "..");
const read = (path) => readFileSync(path, "utf8");
const design = read(join(rootDir, "DESIGN.md"));
const tokensCss = read(join(designDir, "tokens.css"));
const componentsCss = read(join(designDir, "components.css"));
const compositionsCss = read(join(designDir, "compositions.css"));
const compatCss = read(join(designDir, "compat.css"));
const guide = read(join(studioDir, "dist/design-system/index.html"));
const guideCss = read(join(designDir, "guide.css"));
const manifest = JSON.parse(read(join(studioDir, "preserve.manifest.json")));
const vercel = JSON.parse(read(join(studioDir, "vercel.json")));
const homepage = [
  read(join(studioDir, "src/components/DocumentHead.astro")),
  read(join(studioDir, "src/layouts/SiteLayout.astro")),
  read(join(studioDir, "src/components/SiteHeader.astro")),
  read(join(studioDir, "src/pages/index.astro")),
  read(join(studioDir, "src/components/SiteFooter.astro")),
].join("\n");
const homepageCss = read(join(studioDir, "homepage.css"));
const transitionsCss = read(join(studioDir, "src/styles/transitions.css"));
const atlas = read(join(studioDir, "dist/signals/index.html"));
const atlasCss = read(join(studioDir, "signals/atlas.css"));
const workflow = read(join(rootDir, ".github/workflows/check-ctw-design-system.yml"));
const tokens = JSON.parse(read(join(designDir, "tokens.json")));
const visualConfigPath = join(here, "playwright.config.cjs");
const visualSpecPath = join(here, "guide.visual.spec.cjs");

const git = (args) =>
  execFileSync("git", args, {
    cwd: rootDir,
    encoding: "utf8",
  }).trim();

function gitRefExists(ref) {
  try {
    git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

function contrastRatio(first, second) {
  const luminance = (hex) => {
    const channels = hex
      .slice(1)
      .match(/../g)
      .map((value) => Number.parseInt(value, 16) / 255)
      .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function parseComponentComposites() {
  const block = design.match(/\ncomponents:\n([\s\S]*?)\n---/)?.[1] ?? "";
  const components = {};
  let current;
  for (const line of block.split("\n")) {
    const component = line.match(/^  ([\w-]+):$/);
    if (component) {
      current = component[1];
      components[current] = {};
      continue;
    }
    const property = line.match(/^    ([\w-]+):\s*(.+)$/);
    if (property && current) components[current][property[1]] = property[2].replace(/^"|"$/g, "");
  }
  return components;
}

function resolveDtcg(value) {
  const reference = value.match(/^\{([^.]+)\.([^}]+)\}$/);
  if (!reference) return value;
  const group = reference[1] === "colors" ? "color" : reference[1];
  return tokens[group]?.[reference[2]]?.$value;
}

function cssRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return componentsCss.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "s"))?.[1] ?? "";
}

function cssDeclarations(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const body = css.match(new RegExp(`(?:^|})[^{}]*${escaped}[^{}]*\\{([^}]*)\\}`, "s"))?.[1] ?? "";
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
  );
}

function resolveCssProperty(name, properties, seen = new Set()) {
  assert.ok(!seen.has(name), `Circular CSS variable: ${name}`);
  const value = properties[name];
  assert.notEqual(value, undefined, `Missing CSS variable: ${name}`);
  const reference = value.match(/^var\((--[\w-]+)(?:,\s*([^)]+))?\)$/);
  if (!reference) return value;
  const [, target, fallback] = reference;
  if (!(target in properties)) return fallback;
  return resolveCssProperty(target, properties, new Set([...seen, name]));
}

const routeAudit = design.match(/### Current-state route and family audit([\s\S]*?)## Colors/)?.[1] ?? "";
const routeFamilies = [...routeAudit.matchAll(/^\| ([^|]+?) \| `([^`]+)` \|/gm)]
  .reduce((families, [, family, route]) => {
    (families[family] ??= []).push(route);
    return families;
  }, {});
const expectedRoutes = [
  "/",
  "/design-system/",
  "/index-0.html",
  "/index-1.html",
  "/index-1a.html",
  "/index-2.html",
  "/new/",
  "/portfolio/",
  "/signals/",
  "/signals/ai-work/",
  "/signals/demography/",
  "/signals/education/",
  "/signals/financial-fragility/",
  "/signals/food/",
  "/signals/healthspan/",
  "/signals/housing/",
  "/signals/real-time-ai/",
  "/signals/science/",
  "/workshop/",
  "/workshop/pitch/",
  "/workshop/privacy/",
  "/workshop/slides/",
  "/workshop/terms/",
].sort();

function discoverHtmlRoutes(dir, prefix = "", excludedTrees = []) {
  return readdirSync(dir)
    .flatMap((name) => {
      if (!prefix && excludedTrees.includes(name)) return [];
      const path = join(dir, name);
      const next = join(prefix, name);
      if (statSync(path).isDirectory()) return discoverHtmlRoutes(path, next, excludedTrees);
      if (!name.endsWith(".html")) return [];
      return [next === "index.html" ? "/" : `/${next.replace(/\/index\.html$/, "/")}`];
    });
}

test("DESIGN.md follows alpha section order and owns machine-readable roles", () => {
  const headings = [...design.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  assert.deepEqual(headings, [
    "Overview",
    "Colors",
    "Typography",
    "Layout",
    "Elevation & Depth",
    "Shapes",
    "Components",
    "Do's and Don'ts",
  ]);
  for (const contract of [
    "version: alpha",
    "role-surface:",
    "role-text:",
    "role-action:",
    "role-focus:",
    "Current-state route and family audit",
    "Source hierarchy and ownership",
    "Controlled variants",
    "Accessibility contract",
    "Adoption waves",
    "Migration checklist",
  ]) {
    assert.match(design, new RegExp(contract));
  }
});

test("route audit covers exactly 23 deployed routes by family", () => {
  const actualRoutes = discoverHtmlRoutes(
    join(studioDir, "dist"),
    "",
    manifest.routeContract.excludedTrees,
  ).sort();
  const redirectSources = [...manifest.routeContract.redirectSources].sort();
  const preservedRoutes = [...manifest.routeContract.preservedRoutes].sort();
  const contentRoutes = actualRoutes.filter((route) => !redirectSources.includes(route));

  assert.equal(expectedRoutes.length, 23);
  assert.deepEqual(manifest.routeContract.excludedTrees, ["nlesc"]);
  assert.deepEqual(redirectSources, ["/signals/roadmap/"]);
  assert.ok(preservedRoutes.every((route) => expectedRoutes.includes(route)));
  assert.deepEqual(contentRoutes, expectedRoutes);
  assert.ok(actualRoutes.includes("/design-system/"));
  assert.ok(actualRoutes.includes("/signals/roadmap/"));
  assert.ok(existsSync(join(studioDir, "dist/workshop/privacy/index.html")));
  assert.ok(existsSync(join(studioDir, "dist/workshop/terms/index.html")));
  assert.ok(!existsSync(join(studioDir, "dist/workshop/privacy.html")));
  assert.ok(!existsSync(join(studioDir, "dist/workshop/terms.html")));

  const audited = [...routeAudit.matchAll(/\| `([^`]+)` \|/g)].map((match) => match[1]).sort();
  assert.deepEqual(audited, expectedRoutes);
  assert.doesNotMatch(routeAudit, /\/nlesc\//);
  assert.match(routeAudit, /\/signals\/roadmap\/.*redirect source, not deployed\s+content/s);

  const guideAudit = guide.match(/<section[^>]+id="ownership"([\s\S]*?)<\/section>/)?.[1] ?? "";
  const guideTable = guideAudit.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? "";
  for (const [family, routes] of Object.entries(routeFamilies)) {
    assert.match(guideAudit, new RegExp(`>${family}<`));
    for (const route of routes) assert.ok(guideAudit.includes(`<code>${route}</code>`), route);
  }
  assert.equal((guideAudit.match(/<tr>/g) ?? []).length - 1, 23);
  assert.deepEqual(
    [...guideTable.matchAll(/<code>([^<]+)<\/code>/g)].map((match) => match[1]).sort(),
    expectedRoutes,
  );
  assert.doesNotMatch(guideAudit, /\/nlesc\//);
  assert.match(guideAudit, /\/signals\/roadmap\/.*redirect source, not deployed content/);

  assert.deepEqual(
    readFileSync(join(studioDir, "signals/roadmap/index.html")),
    readFileSync(join(studioDir, "dist/signals/roadmap/index.html")),
  );
  assert.ok(vercel.redirects.some((redirect) =>
    redirect.source === "/signals/roadmap/"
    && redirect.destination === "/signals/"
    && redirect.permanent === true
  ));
});

test("browser tokens expose themes and components consume roles", () => {
  for (const token of [
    "--ctw-palette-coal",
    "--ctw-palette-chalk",
    "--ctw-palette-amber",
    "--ctw-color-surface",
    "--ctw-color-text",
    "--ctw-color-action",
    "--ctw-color-focus",
    "--ctw-size-touch",
  ]) {
    assert.ok(tokensCss.includes(token), token);
  }
  assert.match(tokensCss, /\.ctw-theme-coal/);
  assert.match(tokensCss, /\.ctw-theme-chalk/);
  const defaultTheme = tokensCss.match(/:root,[\s\S]*?\{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(defaultTheme, /--ctw-color-scheme:\s*dark/);
  assert.doesNotMatch(defaultTheme, /(^|\n)\s*color-scheme\s*:/);
  assert.match(tokensCss, /\.ctw-scope\s*\{\s*color-scheme:\s*var\(--ctw-color-scheme\);\s*\}/);
  assert.doesNotMatch(componentsCss, /--ctw-palette-/);
  assert.match(componentsCss, /\.ctw-scope/);
  assert.doesNotMatch(componentsCss, /(^|})\s*(html|body|\*)\s*[{,]/m);
  assert.match(compositionsCss, /\.ctw-scope/);
  assert.doesNotMatch(compositionsCss, /(^|})\s*(html|body|\*)\s*[{,]/m);
});

test("expressive composition tier is scoped, documented, and specimen-backed", () => {
  assert.match(design, /70% Editorial Signal, 20%\s*Research Instrument, 10% Kinetic Studio/);
  assert.match(design, /Privacy is a documented implementation trigger/);
  assert.doesNotMatch(compositionsCss, /(?:linear|radial)-gradient\([^)]*,[^)]*,/);
  for (const contract of [
    "ctw-hero",
    "ctw-split-hero",
    "ctw-showcase",
    "ctw-case-study",
    "ctw-argument",
    "ctw-annotated-media",
    "ctw-stat",
    "ctw-chapter",
    "ctw-chapter-divider",
    "ctw-project-index",
    "ctw-chart-story",
    "ctw-margin-note",
    "ctw-observation",
    "ctw-quote",
    "ctw-byline",
    "ctw-brief-meta",
    "ctw-pagination",
    "ctw-related",
    "ctw-state",
    "ctw-closing",
    "ctw-footer--complete",
  ]) {
    assert.ok(compositionsCss.includes(`.${contract}`), contract);
    assert.ok(guide.includes(contract) || homepage.includes(contract) || atlas.includes(contract), `${contract} has no specimen`);
  }
  for (const motif of ["ctw-coordinate", "ctw-source-label", "ctw-registration", "ctw-legend"]) {
    assert.ok(compositionsCss.includes(`.${motif}`), motif);
    assert.ok(guide.includes(motif) || homepage.includes(motif), `${motif} has no specimen`);
  }
  for (const value of ["var(--ctw-palette-cyan)", "var(--ctw-palette-coral)", "var(--ctw-palette-violet)"]) {
    assert.ok(compositionsCss.includes(value), value);
  }
  assert.match(compositionsCss, /@media \(prefers-reduced-motion: reduce\)/);
});

test("every supported composition accent meets text contrast in coal and chalk themes", () => {
  const baseTheme = cssDeclarations(tokensCss, ".ctw-theme-coal");
  const baseComposition = cssDeclarations(compositionsCss, ".ctw-scope");
  const chalkTheme = cssDeclarations(tokensCss, ".ctw-theme-chalk");
  const chalkComposition = cssDeclarations(compositionsCss, ".ctw-theme-chalk.ctw-scope");
  assert.deepEqual(
    Object.fromEntries(
      ["cyan", "coral", "violet"].map((accent) => [
        accent,
        chalkComposition[`--ctw-accent-${accent}`],
      ]),
    ),
    {
      cyan: "var(--ctw-color-action)",
      coral: "var(--ctw-color-action)",
      violet: "var(--ctw-color-action)",
    },
  );

  for (const [theme, overrides] of Object.entries({ coal: {}, chalk: { ...chalkTheme, ...chalkComposition } })) {
    const properties = { ...baseTheme, ...baseComposition, ...overrides };
    const surface = resolveCssProperty("--ctw-color-surface", properties);
    for (const accent of ["default", "cyan", "coral", "violet"]) {
      const name = accent === "default" ? "--ctw-accent" : `--ctw-accent-${accent}`;
      const color = resolveCssProperty(name, properties);
      assert.ok(
        contrastRatio(color, surface) >= 4.5,
        `${theme}/${accent}: ${color} on ${surface} = ${contrastRatio(color, surface).toFixed(3)}:1`,
      );
    }
  }
});

test("compatibility layer contains only explicit role-backed aliases", () => {
  const declarations = [...compatCss.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)];
  assert.ok(declarations.length > 0);
  for (const [, name, value] of declarations) {
    assert.ok(["--coal", "--ink", "--amber", "--bg", "--text", "--muted", "--border"].includes(name), name);
    assert.match(value, /^var\(--ctw-color-[\w-]+\)$/);
  }
  assert.doesNotMatch(compatCss, /--(?:topic|chart|page|subject)-/);
});

test("committed tokens.json is valid DTCG output with role tokens", () => {
  assert.equal(tokens.$schema, "https://www.designtokens.org/schemas/2025.10/format.json");
  assert.equal(tokens.color.$type, "color");
  assert.equal(tokens.color["role-surface"].$value.hex, "#050505");
  assert.equal(tokens.color["role-action"].$value.hex, "#f7b500");
  assert.equal(tokens.color["coal-control-border"].$value.hex, "#6f6c63");
  assert.equal(tokens.color["chalk-control-border"].$value.hex, "#88847b");
  assert.equal(tokens.color["chalk-positive"].$value.hex, "#12663d");
  assert.equal(tokens.color["chalk-critical"].$value.hex, "#a3231e");
  assert.equal(tokens.color["role-control-border"].$value.hex, "#6f6c63");
  assert.equal(tokens.spacing["touch-target"].$value.value, 44);
  assert.equal(tokens.typography.label.$value.fontFamily, "DM Mono, ui-monospace, monospace");
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(tokens.typography).map(([name, token]) => [name, token.$value.lineHeight]),
    ),
    {
      display: 1,
      "heading-lg": 1.08,
      "heading-md": 1.2,
      "body-lg": 1.55,
      body: 1.6,
      "body-sm": 1.5,
      label: 1.4,
      button: 1.1,
      badge: 1.2,
    },
  );
  assert.ok(
    contrastRatio(
      tokens.color["coal-control-border"].$value.hex,
      tokens.color["coal-surface"].$value.hex,
    ) >= 3,
  );
  assert.ok(
    contrastRatio(
      tokens.color["chalk-control-border"].$value.hex,
      tokens.color["chalk-surface"].$value.hex,
    ) >= 3,
  );
});

test("every front-matter component composite resolves through DTCG and matches CSS", () => {
  const composites = parseComponentComposites();
  const selectors = {
    "button-primary": [".ctw-button"],
    "button-secondary": [".ctw-button", ".ctw-button--secondary"],
    card: [".ctw-card"],
    badge: [".ctw-badge"],
    field: [".ctw-field :where(input, select, textarea)"],
    masthead: [".ctw-masthead"],
    "nav-link": [".ctw-primary-nav__link"],
    "chart-frame": [".ctw-chart-frame"],
    "feedback-control": [".ctw-feedback-control"],
  };
  assert.deepEqual(Object.keys(composites).sort(), Object.keys(selectors).sort());

  for (const [component, properties] of Object.entries(composites)) {
    const rules = selectors[component].map(cssRule).join("\n");
    assert.ok(rules, component);
    for (const [property, source] of Object.entries(properties)) {
      const resolved = resolveDtcg(source);
      assert.notEqual(resolved, undefined, `${component}.${property} -> ${source}`);
      const token = source.match(/^\{([^.]+)\.([^}]+)\}$/)?.[2];
      if (property === "backgroundColor" || property === "textColor") {
        assert.match(source, /^\{colors\.role-/);
        const role = token.replace(/^role-/, "");
        const cssProperty = property === "backgroundColor" ? "background" : "color";
        assert.match(rules, new RegExp(`${cssProperty}:\\s*var\\(--ctw-color-${role}\\)`), `${component}.${property}`);
      } else if (property === "typography") {
        const family = resolved.fontFamily.startsWith("DM Mono") ? "mono" : "sans";
        assert.match(
          rules,
          new RegExp(
            `font:\\s*${resolved.fontWeight} var\\(--ctw-type-${token}\\)/${resolved.lineHeight} var\\(--ctw-font-${family}\\)`,
          ),
          `${component}.${property}`,
        );
        if (resolved.letterSpacing) {
          assert.match(
            rules,
            new RegExp(`letter-spacing:\\s*${resolved.letterSpacing.value}${resolved.letterSpacing.unit}`),
            `${component}.${property}.letterSpacing`,
          );
        }
      } else if (property === "rounded") {
        const value = token === "none" ? "0" : `var\\(--ctw-radius-${token}\\)`;
        assert.match(rules, new RegExp(`border-radius:\\s*${value}`), `${component}.${property}`);
      } else if (property === "padding") {
        const value = token ? `var\\(--ctw-space-${token}\\)` : source;
        assert.match(rules, new RegExp(`padding:\\s*${value}`), `${component}.${property}`);
      } else if (property === "height") {
        assert.equal(token, "touch-target");
        assert.match(rules, /height:\s*var\(--ctw-size-touch\)/, `${component}.${property}`);
      } else {
        assert.fail(`Untested component property: ${component}.${property}`);
      }
    }
  }
});

test("browser tokens mirror source roles and fields use control borders", () => {
  for (const declaration of [
    "--ctw-coal-control-border: #6f6c63",
    "--ctw-chalk-control-border: #88847b",
    "--ctw-chalk-positive: #12663d",
    "--ctw-chalk-critical: #a3231e",
    "--ctw-color-control-border: var(--ctw-coal-control-border)",
    "--ctw-color-control-border: var(--ctw-chalk-control-border)",
    "--ctw-color-positive: var(--ctw-chalk-positive)",
    "--ctw-color-critical: var(--ctw-chalk-critical)",
  ]) {
    assert.ok(tokensCss.includes(declaration), declaration);
  }
  assert.match(
    componentsCss,
    /\.ctw-field :where\(input, select, textarea\)\s*\{[^}]*border:\s*1px solid var\(--ctw-color-control-border\)/s,
  );
  for (const selector of [".ctw-card", ".ctw-badge", ".ctw-table-wrap"]) {
    assert.match(
      componentsCss,
      new RegExp(`${selector.replace(".", "\\.")}\\s*\\{[^}]*border:\\s*1px solid var\\(--ctw-color-border\\)`, "s"),
    );
  }
  assert.doesNotMatch(componentsCss, /\.ctw-button\[aria-disabled="true"\]/);
  assert.match(design, /native `disabled` attribute;[\s\S]*`aria-disabled` alone does not disable behavior/);
});

test("workflow pins actions and resolves a fail-closed history base", () => {
  for (const expected of [
    "actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4",
    "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4",
    "oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6 # v2",
    "actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4",
    "bunx playwright install --with-deps chromium",
    "bun run test:e2e:built",
    "bun run test:visual:built",
    "bun run test:lighthouse:built",
    "retention-days: 14",
    "if-no-files-found: ignore",
    "- 'AGENTS.md'",
    "- 'README.md'",
    "- 'ctw.studio/**'",
    "bun install --frozen-lockfile",
    "bun run build",
    "CTW_STUDIO_BASE_SHA=$base_sha",
    "PUSH_REF_NAME:",
    'git fetch --no-tags origin "$candidate_base" || true',
    "refusing a partial comparison",
    'git diff --quiet "$CTW_STUDIO_BASE_SHA" HEAD -- ctw.studio/nlesc',
  ]) {
    assert.ok(workflow.includes(expected), expected);
  }
  assert.match(workflow, /PR_BASE_SHA:[\s\S]*PUSH_BEFORE_SHA:[\s\S]*DEFAULT_BRANCH:/);
  assert.match(workflow, /refs\/heads\/\$DEFAULT_BRANCH:refs\/remotes\/origin\/\$DEFAULT_BRANCH/);
  assert.match(workflow, /git merge-base HEAD "origin\/\$DEFAULT_BRANCH"/);
  assert.doesNotMatch(workflow, /HEAD\^|hash-object/);
  assert.ok(existsSync(visualConfigPath));
  assert.ok(existsSync(visualSpecPath));
  const visualFiles = `${read(visualConfigPath)}\n${read(visualSpecPath)}`;
  for (const expected of ["390", "844", "1440", "900", "compact", "wide"]) {
    assert.ok(visualFiles.includes(expected), expected);
  }
});

test("guide is static, semantic, accessible, and complete without JavaScript", () => {
  assert.match(guide, /^<!doctype html>/i);
  assert.doesNotMatch(guide, /<script\b/i);
  for (const href of [
    "/design-system/tokens.css",
    "/design-system/components.css",
    "/design-system/compositions.css",
    "/design-system/guide.css",
  ]) {
    assert.match(guide, new RegExp(`href="${href}"`));
  }
  for (const requirement of [
    'class="ctw-skip-link"',
    "<main",
    "<h1",
    "<nav",
    "<caption>",
    "<figure",
    "<figcaption>",
    "<svg",
    "<fieldset",
    "<legend",
    'type="radio"',
    'class="ctw-masthead"',
    'class="ctw-primary-nav"',
    'class="ctw-primary-nav__link"',
    'scope="col"',
    'aria-describedby=',
    'id="component-table-hint"',
    'aria-describedby="component-table-hint"',
    'id="spacing-chart-table-hint"',
    'aria-describedby="spacing-chart-table-hint"',
    'id="story-chart-table-hint"',
    'aria-describedby="story-chart-table-hint"',
    'id="route-table-hint"',
    'aria-describedby="route-table-hint"',
    "Swipe table to see every column",
    'aria-invalid="true"',
    "Foundations",
    "Themes",
    "Typography",
    "Spacing + layout",
    "Components + states",
    "Header + nav",
    "Charts",
    "Feedback",
    "Evidence semantics",
    "Expressive compositions",
    "Full-width project showcase",
    "Argument / Evidence",
    "Annotated media",
    "Source-led chart story",
    "Empty",
    "Loading",
    "Unavailable",
    "Error",
    "Privacy is a trigger",
    "Accessibility",
    "Do + don",
    "Route + ownership audit",
    "Staged adoption",
    "Migration checklist",
    "Decide",
    "Learn",
  ]) {
    assert.ok(guide.includes(requirement), requirement);
  }
  assert.doesNotMatch(guide, /glassmorphism|lorem ipsum|AI-powered/i);
  assert.match(guide, /@font-face\{font-family:Inter Variable/);
  assert.match(guide, /@font-face\{font-family:DM Mono/);
  assert.match(guide, /url\(\/_astro\/inter-latin-wght-normal\.[^)]+\.woff2\)/);
  assert.doesNotMatch(guide, /fonts\.(?:googleapis|gstatic)\.com/);
  assert.match(
    guide,
    /<input id="boundary"[^>]*\brequired\b[^>]*\bpattern="[^"]*\[12\]\[0-9\]\{3\}[^"]*"[^>]*\btitle="[^"]*1000 to 2999[^"]*"/,
  );
  assert.match(guide, /<button class="ctw-button" type="submit">Record decision<\/button>/);
  assert.match(guide, /<svg[^>]+role="img"[^>]+aria-labelledby=/);
  assert.match(guide, /<figure class="ctw-chart-frame"[\s\S]*<table class="ctw-table">[\s\S]*<\/figure>/);
  assert.match(guide, /<fieldset class="ctw-feedback">[\s\S]*<label class="ctw-feedback-control"><input type="radio"/);
  for (const [tag] of guide.matchAll(/<div class="ctw-table-wrap[^"]*"[^>]*>/g)) {
    const hintId = tag.match(/aria-describedby="([^"]+)"/)?.[1];
    assert.ok(hintId, `${tag} needs a scroll hint`);
    assert.ok(guide.includes(`id="${hintId}"`), `${hintId} must resolve`);
  }
  assert.doesNotMatch(guideCss, /\.guide-(?:masthead|wordmark|nav)/);
});

test("guide local paths stay inside worktree and resolve", () => {
  for (const [, value] of guide.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (value.startsWith("#") || /^https:\/\//.test(value)) continue;
    assert.doesNotMatch(value, /^(?:file:|javascript:)|(?:^|\/)\.\.(?:\/\.\.){3,}/);
    const target = value.startsWith("/")
      ? resolve(studioDir, "dist", `.${value.split("#")[0]}`)
      : resolve(studioDir, "dist/design-system", value.split("#")[0]);
    assert.ok(target === rootDir || target.startsWith(`${rootDir}${sep}`), value);
    assert.ok(existsSync(target), `${value} -> ${relative(rootDir, target)}`);
  }
});

test("responsive, touch-target, focus, and reduced-motion contracts exist", () => {
  for (const css of [componentsCss, compositionsCss, guideCss]) {
    assert.match(css, /@media \(max-width: 47\.99rem\)/);
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  }
  assert.match(componentsCss, /min-height:\s*44px/);
  assert.match(componentsCss, /\.ctw-skip-link\s*\{[^}]*min-height:\s*var\(--ctw-size-touch\)/s);
  assert.match(componentsCss, /\.ctw-wordmark\s*\{[^}]*min-height:\s*var\(--ctw-size-touch\)/s);
  assert.match(componentsCss, /\.ctw-primary-nav\s*\{[^}]*flex-wrap:\s*wrap/s);
  assert.match(componentsCss, /\.ctw-primary-nav__link\s*\{[^}]*height:\s*var\(--ctw-size-touch\)/s);
  assert.match(componentsCss, /\.ctw-primary-nav__link\[aria-current\]/);
  assert.match(componentsCss, /\.ctw-feedback-control\s*\{[^}]*min-height:\s*var\(--ctw-size-touch\)/s);
  assert.match(componentsCss, /\.ctw-link--standalone\s*\{[^}]*display:\s*inline-flex[^}]*min-height:\s*var\(--ctw-size-touch\)[^}]*align-items:\s*center/s);
  assert.match(componentsCss, /\.ctw-scroll-hint\s*\{[^}]*display:\s*none/s);
  assert.match(componentsCss, /@media \(max-width: 48rem\)[\s\S]*\.ctw-scroll-hint\s*\{[^}]*display:\s*block/s);
  assert.match(componentsCss, /scrollbar-color:\s*var\(--ctw-color-action\)/);
  assert.match(componentsCss, /\.ctw-scope \.ctw-feedback-button:focus-visible,\s*\.ctw-scope \.ctw-feedback-textarea:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--ctw-color-focus\)[^}]*outline-offset:\s*3px/s);
  assert.match(componentsCss, /outline:\s*3px solid var\(--ctw-color-focus\)/);
  assert.match(componentsCss, /animation-duration:\s*0\.01ms !important/);
});

test("standalone links opt into touch targets while prose links remain inline", () => {
  for (const [markup, labels] of [
    [homepage, ["All projects →", "About →", "Full bio &amp; portfolio ↗"]],
    [guide, ["Trace evidence", "Check access", "Read case-study contract →"]],
  ]) {
    for (const label of labels) {
      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert.match(
        markup,
        new RegExp(`<a\\b[^>]*class="[^"]*\\bctw-link--standalone\\b[^"]*"[^>]*>${escaped}<\\/a>`),
        label,
      );
    }
  }
  assert.match(
    guide,
    /<p><a class="ctw-link" href="#ownership">Inline link keeps underline<\/a> so interaction does not depend on color\.<\/p>/,
  );
});

test("homepage restores historical composition through current static design system", () => {
  for (const href of [
    "/design-system/tokens.css",
    "/design-system/components.css",
    "/design-system/compositions.css",
    "/homepage.css",
  ]) {
    assert.match(homepage, new RegExp(`href="${href}"`));
  }
  for (const text of [
    "Applied Research",
    "17+ years in software engineering",
    "50+",
    "15",
    "Jesse Gonzalez",
    "Research Data Infrastructure",
    "ML Systems &amp; Responsible AI",
    "Scientific Visualization &amp; Digital Exhibits",
    "Collaborative Research Platforms",
    "Planning",
    "Visibility",
    "Implementation",
    "Sustainability",
    "Notidian",
    "IdeasDiamond",
    "NextHuman",
    "Josh Colston, PhD",
    "Elli Bleeker, PhD",
    "Valentina Azzara, PhD",
    "Kody Moodley, PhD",
    "Veronica Pang",
    "Netherlands eScience Center",
    "Smithsonian Institution",
    "contact@ctw.studio",
    "accepting projects 2026-2027",
  ]) {
    assert.ok(homepage.includes(text), text);
  }
  assert.match(homepage, /<nav class="ctw-primary-nav" aria-label="Primary navigation">/);
  for (const href of ["/portfolio/", "/signals/", "/workshop/", "/#about", "/#contact"]) {
    assert.match(homepage, new RegExp(`href="${href.replaceAll("/", "\\/")}"`));
  }
  assert.match(homepage, /bodyClass="studio-home"/);
  assert.match(componentsCss, /\.ctw-masthead--studio \.ctw-wordmark::before/);
  assert.doesNotMatch(componentsCss, /\.ctw-masthead--studio \.ctw-wordmark[^}]*font-size:\s*0/s);
  assert.match(componentsCss, /\.ctw-masthead--studio \.ctw-primary-nav__link[^}]*text-transform:\s*none/s);
  assert.match(componentsCss, /\.ctw-masthead--studio \.ctw-primary-nav__link:last-child[^}]*border-radius:\s*var\(--ctw-radius-pill\)/s);
  assert.match(componentsCss, /\.ctw-nav-glitch:hover::before[^}]*animation:\s*ctw-nav-glitch-1/s);
  assert.match(componentsCss, /\.ctw-nav-glitch:hover::after[^}]*animation:\s*ctw-nav-glitch-2/s);
  assert.match(componentsCss, /\.ctw-masthead__glass[^}]*backdrop-filter:\s*blur\(24px\)/s);
  assert.match(componentsCss, /\.ctw-masthead__glass-edge[^}]*blur\(60px\) saturate\(140%\) brightness\(1\.2\)/s);
  assert.match(componentsCss, /@media \(max-width: 30rem\)[\s\S]*\.ctw-wordmark__label/s);
  assert.match(homepage, /<script is:inline src="\/feedback\.js"><\/script>/);
  assert.doesNotMatch(homepage, /ClientRouter|data-astro-(?:reload|rerun)|transition:(?:name|animate)/);
  assert.match(transitionsCss, /@view-transition\s*\{\s*navigation:\s*auto;/s);
  assert.match(transitionsCss, /\.ctw-wordmark\s*\{\s*view-transition-name:\s*site-mark;/s);
  assert.match(transitionsCss, /\.ctw-hero__title,\s*\.portfolio-lead\s*\{\s*view-transition-name:\s*portfolio-lead;/s);
  assert.match(transitionsCss, /::view-transition-old\(site-mark\),\s*::view-transition-new\(site-mark\)\s*\{\s*animation:\s*none;/s);
  assert.doesNotMatch(homepage, /tailwind\.css|anime(?:\.min)?\.js|three(?:\.min)?\.js|blueprint-canvas|onclick=|opacity-0|bento/i);
  assert.doesNotMatch(homepage, /<script[^>]+src="nav\.js"/);
  assert.equal((homepage.match(/<details class="studio-card">/g) ?? []).length, 4);
  assert.equal((homepage.match(/<summary>/g) ?? []).length, 4);
  assert.equal((homepage.match(/<blockquote class="studio-card">/g) ?? []).length, 5);
  assert.match(homepage, /id="field-notes-cue">Scroll field notes →<\/p>/);
  assert.match(homepage, /<section class="studio-facts" aria-labelledby="studio-facts-title">/);
  assert.match(homepage, /<dl class="studio-facts__stats ctw-coordinate">/);
  assert.doesNotMatch(homepage, /data-feedback-host/);
  assert.match(homepage, /<section class="studio-section studio-notes" id="methodology">/);
  assert.match(homepage, /class="studio-quotes" role="region" tabindex="0" aria-labelledby="notes-title" aria-describedby="field-notes-cue"/);
  assert.match(homepageCss, /\.studio-quotes:focus-visible\s*\{[^}]*outline:/s);
  assert.match(homepageCss, /\.studio-quotes\s*\{[^}]*overflow-x:\s*auto[^}]*scroll-snap-type:\s*inline mandatory/s);
  assert.match(homepageCss, /\.studio-home \.ctw-button\s*\{[^}]*border-radius:\s*var\(--ctw-radius-pill\)/s);
  assert.match(homepageCss, /\.studio-product\s*\{[^}]*aspect-ratio:\s*5 \/ 3/s);
  assert.match(homepageCss, /\.studio-product img\s*\{[^}]*object-fit:\s*contain/s);
  for (const [name, width, height] of [
    ["notidian", "1200", "720"],
    ["ideasdiamond", "1200", "720"],
    ["nexthuman", "1801", "1081"],
  ]) {
    assert.match(
      homepage,
      new RegExp(`<img src="\\/homepage\\/${name}\\.avif" width="${width}" height="${height}" alt="[^"]+" loading="lazy" decoding="async" \\/>`),
    );
    assert.ok(existsSync(join(studioDir, `public/homepage/${name}.avif`)), name);
  }
  assert.doesNotMatch(homepage, /<img[^>]+src="https?:\/\//);
  assert.doesNotMatch(homepageCss, /(^|\n)\s*:root\b/);
  for (const value of homepageCss.matchAll(/var\((--[^,)]+)/g)) {
    assert.match(value[1], /^--(?:ctw|studio)-/);
  }
  for (const tag of homepage.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(tag[0], /rel="noopener noreferrer"/);
  }
  const homepageEffects = homepageCss
    .replaceAll("box-shadow: none", "")
    .replaceAll("-webkit-backdrop-filter: none", "")
    .replaceAll("backdrop-filter: none", "");
  assert.doesNotMatch(homepageEffects, /(?:linear|radial)-gradient|backdrop-filter|box-shadow/);
});

test("Signals atlas pilot opts into shared cyan composition without changing taxonomy", () => {
  for (const href of [
    "/design-system/tokens.css",
    "/design-system/components.css",
    "/design-system/compositions.css",
    "/signals/signals.css",
    "/signals/atlas.css",
    "/signals/subject-menu.css",
  ]) {
    assert.match(atlas, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  }
  assert.match(atlas, /<body class="ctw-scope ctw-accent--cyan">/);
  assert.equal((atlas.match(/\bdata-status="published"/g) ?? []).length, 7);
  assert.equal((atlas.match(/\bdata-status="planned"/g) ?? []).length, 3);
  assert.equal((atlas.match(/Brief 00[1-9]/g) ?? []).length >= 18, true);
  assert.equal(cssDeclarations(atlasCss, ":root")["--atlas-green"], undefined);
  assert.equal(
    cssDeclarations(atlasCss, ".roadmap-page body")["--atlas-green"],
    "var(--ctw-accent-cyan, var(--ctw-palette-cyan, #57d7ff))",
  );
  assert.match(atlasCss, /\.lens-grid article\s*\{[^}]*border-radius:\s*0[^}]*background:\s*transparent/s);
  assert.doesNotMatch(atlasCss, /(?:linear|radial)-gradient\([^)]*,[^)]*,/);
  assert.doesNotMatch(atlas, /tailwind\.css/);
  assert.match(atlas, /subject-menu\.js/);
  assert.match(atlas, /<nav class="ctw-primary-nav" aria-label="Primary navigation">/);
  assert.doesNotMatch(atlas, /\.\.\/nav\.js/);
  assert.match(atlas, /src="\/feedback\.js"/);
});

test("generated NLeSC subtree has no local changes", () => {
  const status = git(["status", "--porcelain", "--", "ctw.studio/nlesc"]);
  assert.equal(status, "");

  let base = process.env.DESIGN_SYSTEM_BASE_SHA;
  if (base) {
    assert.doesNotMatch(base, /^0+$/);
    assert.ok(gitRefExists(base), `Invalid DESIGN_SYSTEM_BASE_SHA: ${base}`);
  } else if (gitRefExists("origin/main")) {
    base = git(["merge-base", "HEAD", "origin/main"]);
  }

  if (!base) return;
  assert.equal(git(["diff", "--name-only", base, "HEAD", "--", "ctw.studio/nlesc"]), "");
});

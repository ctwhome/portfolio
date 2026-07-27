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
const compatCss = read(join(designDir, "compat.css"));
const guide = read(join(designDir, "index.html"));
const guideCss = read(join(designDir, "guide.css"));
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

const routeFamilies = {
  "Studio landing": ["/", "/index-0.html", "/index-1.html", "/index-1a.html", "/index-2.html"],
  Portfolio: ["/new/", "/portfolio/"],
  Signals: [
    "/signals/",
    "/signals/ai-work/",
    "/signals/demography/",
    "/signals/education/",
    "/signals/financial-fragility/",
    "/signals/food/",
    "/signals/healthspan/",
    "/signals/housing/",
    "/signals/real-time-ai/",
    "/signals/roadmap/",
    "/signals/science/",
  ],
  Workshop: [
    "/workshop/",
    "/workshop/pitch/",
    "/workshop/privacy/",
    "/workshop/slides/",
    "/workshop/terms/",
  ],
};
const expectedRoutes = Object.values(routeFamilies).flat().sort();

function discoverHtmlRoutes(dir, prefix = "") {
  return readdirSync(dir)
    .flatMap((name) => {
      if (!prefix && ["design-system", "nlesc"].includes(name)) return [];
      const path = join(dir, name);
      const next = join(prefix, name);
      if (statSync(path).isDirectory()) return discoverHtmlRoutes(path, next);
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

test("route audit covers exactly 23 handwritten routes by family", () => {
  assert.equal(expectedRoutes.length, 23);
  assert.deepEqual(discoverHtmlRoutes(studioDir).sort(), expectedRoutes);

  const audit = design.match(/### Current-state route and family audit([\s\S]*?)## Colors/)?.[1] ?? "";
  const audited = [...audit.matchAll(/\| `([^`]+)` \|/g)].map((match) => match[1]).sort();
  assert.deepEqual(audited, expectedRoutes);
  assert.doesNotMatch(audit, /\/nlesc\//);

  const guideAudit = guide.match(/<section[^>]+id="ownership"([\s\S]*?)<\/section>/)?.[1] ?? "";
  for (const [family, routes] of Object.entries(routeFamilies)) {
    assert.match(guideAudit, new RegExp(`>${family}<`));
    for (const route of routes) assert.ok(guideAudit.includes(`<code>${route}</code>`), route);
  }
  assert.equal((guideAudit.match(/<tr>/g) ?? []).length - 1, 23);
  assert.doesNotMatch(guideAudit, /\/nlesc\//);
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
    "actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4",
    "@playwright/test@1.62.0 install --with-deps chromium",
    "--package=@playwright/test@1.62.0",
    "NODE_PATH=",
    "playwright test --config ctw.studio/design-system/tests/playwright.config.cjs",
    "retention-days: 14",
    "if-no-files-found: error",
    "- 'AGENTS.md'",
    "- 'README.md'",
    "DESIGN_SYSTEM_BASE_SHA=$base_sha",
    "PUSH_REF_NAME:",
    'git fetch --no-tags origin "$candidate_base" || true',
    "refusing a partial comparison",
    'git diff --quiet "$DESIGN_SYSTEM_BASE_SHA" HEAD -- ctw.studio/nlesc',
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
  for (const href of ["tokens.css", "components.css", "guide.css"]) {
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
  assert.match(guide, /fonts\.googleapis\.com\/[^"]+&amp;family=[^"]+&amp;display=swap/);
  assert.doesNotMatch(guide, /fonts\.googleapis\.com\/[^"]+&(?:family|display)=/);
  assert.match(
    guide,
    /<input id="boundary"[^>]*\brequired\b[^>]*\bpattern="[^"]*\[12\]\[0-9\]\{3\}[^"]*"[^>]*\btitle="[^"]*1000 to 2999[^"]*"/,
  );
  assert.match(guide, /<button class="ctw-button" type="submit">Record decision<\/button>/);
  assert.match(guide, /<svg[^>]+role="img"[^>]+aria-labelledby=/);
  assert.match(guide, /<figure class="ctw-chart-frame"[\s\S]*<table class="ctw-table">[\s\S]*<\/figure>/);
  assert.match(guide, /<fieldset class="ctw-feedback">[\s\S]*<label class="ctw-feedback-control"><input type="radio"/);
  assert.doesNotMatch(guideCss, /\.guide-(?:masthead|wordmark|nav)/);
});

test("guide local paths stay inside worktree and resolve", () => {
  for (const [, value] of guide.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (value.startsWith("#") || /^https:\/\//.test(value)) continue;
    assert.doesNotMatch(value, /^(?:\/|file:|javascript:)|(?:^|\/)\.\.(?:\/\.\.){3,}/);
    const target = resolve(designDir, value.split("#")[0]);
    assert.ok(target === rootDir || target.startsWith(`${rootDir}${sep}`), value);
    assert.ok(existsSync(target), `${value} -> ${relative(rootDir, target)}`);
  }
});

test("responsive, touch-target, focus, and reduced-motion contracts exist", () => {
  for (const css of [componentsCss, guideCss]) {
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
  assert.match(guideCss, /\.guide-theme \.ctw-link\s*\{[^}]*min-height:\s*var\(--ctw-size-touch\)/s);
  assert.match(componentsCss, /\.ctw-scroll-hint\s*\{[^}]*display:\s*none/s);
  assert.match(componentsCss, /@media \(max-width: 48rem\)[\s\S]*\.ctw-scroll-hint\s*\{[^}]*display:\s*block/s);
  assert.match(componentsCss, /scrollbar-color:\s*var\(--ctw-color-action\)/);
  assert.match(componentsCss, /outline:\s*3px solid var\(--ctw-color-focus\)/);
  assert.match(componentsCss, /animation-duration:\s*0\.01ms !important/);
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

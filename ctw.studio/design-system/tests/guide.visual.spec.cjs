const { expect, test } = require("@playwright/test");

const viewports = [
  { name: "compact", width: 390, height: 844 },
  { name: "wide", width: 1440, height: 900 },
];

const routes = [
  {
    name: "guide",
    path: "/design-system/",
    title: "Design system — CTW Studio",
    heading: /Design for decisions/,
    core: /Privacy is a trigger/,
    minimumStyles: 4,
  },
  {
    name: "homepage",
    path: "/",
    title: "CTW Studio – Applied Research Software",
    heading: /Applied Research Software/i,
    core: /Research Data Infrastructure/,
    minimumStyles: 4,
  },
  {
    name: "atlas",
    path: "/signals/",
    title: "The Signals atlas — CTW Signals",
    heading: /Important questions/,
    core: /What Signals will track/,
    minimumStyles: 6,
  },
];

function contrastRatio(foreground, background) {
  const channels = (value) => value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
  const luminance = (value) => {
    const linear = channels(value)
      .map((channel) => channel / 255)
      .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const viewport of viewports) {
  for (const route of routes) {
    test(`${viewport.name} ${route.name} visual and accessibility audit`, async ({ browser, page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const routePath = route.path;
      const runtimeErrors = [];
      const localStyles = [];

      page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
      });
      page.on("response", (response) => {
        const url = new URL(response.url());
        if (url.origin === "http://127.0.0.1:4173" && response.request().resourceType() === "stylesheet") {
          localStyles.push({ path: url.pathname, status: response.status(), ok: response.ok() });
        }
      });

      await page.goto(routePath, { waitUntil: "networkidle" });
      await expect(page).toHaveTitle(route.title);
      await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
      expect(localStyles.length, JSON.stringify(localStyles)).toBeGreaterThanOrEqual(route.minimumStyles);
      expect(localStyles.filter((response) => !response.ok), JSON.stringify(localStyles)).toEqual([]);

      const overflow = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);

      await page.keyboard.press("Tab");
      const skipLink = page.getByRole("link", { name: /Skip to/ });
      await expect(skipLink).toBeFocused();
      const focusRing = await skipLink.evaluate((element) => {
        const style = getComputedStyle(element);
        return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
      });
      expect(focusRing.style).not.toBe("none");
      expect(focusRing.width).toBeGreaterThanOrEqual(3);
      await skipLink.evaluate((element) => element.blur());

      if (viewport.name === "compact" && ["homepage", "atlas"].includes(route.name)) {
        const feedbackButton = page.getByRole("button", { name: "Feedback", exact: true });
        await feedbackButton.focus();
        await expect(feedbackButton).toBeFocused();
        const buttonFocusRing = await feedbackButton.evaluate((element) => {
          const style = getComputedStyle(element);
          return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
        });
        expect(buttonFocusRing.style).not.toBe("none");
        expect(buttonFocusRing.width).toBeGreaterThanOrEqual(3);

        await feedbackButton.click();
        const feedbackTextarea = page.locator(".ctw-feedback-textarea");
        await expect(feedbackTextarea).toBeFocused();
        const textareaFocusRing = await feedbackTextarea.evaluate((element) => {
          const style = getComputedStyle(element);
          return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
        });
        expect(textareaFocusRing.style).not.toBe("none");
        expect(textareaFocusRing.width).toBeGreaterThanOrEqual(3);
        await page.keyboard.press("Escape");
        await expect(page.locator(".ctw-feedback-modal")).toBeHidden();
      }

      const contrast = await page.locator("h1").evaluate((element) => {
        const foreground = getComputedStyle(element).color;
        let backgroundElement = element;
        let background = getComputedStyle(backgroundElement).backgroundColor;
        while (backgroundElement.parentElement && background.endsWith(", 0)")) {
          backgroundElement = backgroundElement.parentElement;
          background = getComputedStyle(backgroundElement).backgroundColor;
        }
        return { foreground, background };
      });
      expect(contrastRatio(contrast.foreground, contrast.background), JSON.stringify(contrast)).toBeGreaterThanOrEqual(4.5);

      if (viewport.name === "compact") {
        const undersized = await page
          .locator('a, button, input:not([type="radio"]), select, textarea, summary, [tabindex="0"], label:has(> input[type="radio"])')
          .evaluateAll((elements) =>
            elements.flatMap((element) => {
              if (!element.checkVisibility()) return [];
              if (
                element.matches(".ctw-link:not(.ctw-link--standalone)")
                && element.closest("p, li, figcaption")
              ) return [];
              const rect = element.getBoundingClientRect();
              return rect.width < 44 || rect.height < 44
                ? [{ tag: element.tagName, text: element.textContent?.trim(), width: rect.width, height: rect.height }]
                : [];
            }),
          );
        expect(undersized).toEqual([]);
      }

      expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
      if (route.name === "guide") {
        expect(await page.locator('[data-state="loading"]').evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
      } else {
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
      }

      if (route.name === "guide") {
        const chart = page.locator("figure.ctw-chart-frame").first();
        await expect(chart.locator("figcaption")).toBeVisible();
        await expect(chart.getByRole("img")).toBeVisible();
        await expect(chart.getByRole("table")).toBeVisible();
        await expect(page.locator(".ctw-state")).toHaveCount(4);
        const fallbackTables = page.locator(".ctw-chart-frame__fallback");
        await expect(fallbackTables).toHaveCount(2);
        for (const table of await fallbackTables.all()) {
          await expect(table).toHaveAttribute("aria-describedby", /-chart-table-hint$/);
        }
        const chartHints = page.locator("#spacing-chart-table-hint, #story-chart-table-hint");
        await expect(chartHints).toHaveCount(2);
        for (const hint of await chartHints.all()) {
          if (viewport.name === "compact") await expect(hint).toBeVisible();
          else await expect(hint).toBeHidden();
        }
      }
      if (route.name === "homepage") {
        await expect(page.locator(".studio-process details")).toHaveCount(4);
        await expect(page.locator(".studio-quotes blockquote")).toHaveCount(5);
        await expect(page.locator(".studio-product img")).toHaveCount(3);
        await page.locator(".studio-products").scrollIntoViewIfNeeded();
        for (const image of await page.locator(".studio-product img").all()) {
          await expect(image).toHaveAttribute("alt", /.+/);
          await expect(image).toHaveAttribute("loading", "lazy");
          await expect(image).toHaveJSProperty("complete", true);
        }
      }
      if (route.name === "atlas") {
        await expect(page.locator(".atlas-card")).toHaveCount(10);
        await expect(page.locator('.atlas-card[data-status="published"]')).toHaveCount(7);
        const outlinedHeading = await page.locator(".atlas-hero h1 em").evaluate((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return {
            text: element.textContent.trim(),
            hasRenderedBox: element.getClientRects().length > 0 && rect.width > 0 && rect.height > 0,
            strokeColor: style.webkitTextStrokeColor,
            strokeWidth: Number.parseFloat(style.webkitTextStrokeWidth),
          };
        });
        expect(outlinedHeading.text.length).toBeGreaterThan(0);
        expect(outlinedHeading.hasRenderedBox).toBe(true);
        expect(outlinedHeading.strokeColor).toBe("rgb(87, 215, 255)");
        expect(outlinedHeading.strokeWidth).toBeGreaterThan(0);
        const lensTreatment = await page.locator(".lens-grid article").first().evaluate((element) => {
          const style = getComputedStyle(element);
          return { background: style.backgroundColor, radius: style.borderRadius };
        });
        expect(lensTreatment).toEqual({ background: "rgba(0, 0, 0, 0)", radius: "0px" });
      }

      const noJsContext = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce",
      });
      const noJsPage = await noJsContext.newPage();
      await noJsPage.goto(routePath, { waitUntil: "domcontentloaded" });
      await expect(noJsPage.locator("body")).toContainText(route.core);
      await expect(noJsPage.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
      await noJsContext.close();

      const screenshotPath = testInfo.outputPath(
        `${route.name}-${viewport.name}-${viewport.width}x${viewport.height}.png`,
      );
      const screenshot = await page.screenshot({ path: screenshotPath, animations: "disabled", fullPage: true });
      expect(screenshot.byteLength).toBeGreaterThan(0);
      await testInfo.attach(`${route.name} ${viewport.name} full page`, {
        path: screenshotPath,
        contentType: "image/png",
      });

      expect(runtimeErrors).toEqual([]);
    });
  }
}

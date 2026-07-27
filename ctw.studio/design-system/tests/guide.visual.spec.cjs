const { expect, test } = require("@playwright/test");

const viewports = [
  { name: "compact", width: 390, height: 844 },
  { name: "wide", width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test(`reviewed ${viewport.name} guide screenshot`, async ({ page }, testInfo) => {
      const runtimeErrors = [];
      const localStyles = [];
      page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
      });
      page.on("response", (response) => {
        const url = new URL(response.url());
        if (url.origin === "http://127.0.0.1:4173" && response.request().resourceType() === "stylesheet") {
          localStyles.push({ url: response.url(), status: response.status(), ok: response.ok() });
        }
      });

      await page.goto("/design-system/", { waitUntil: "networkidle" });
      await expect(page).toHaveTitle("Design system — CTW Studio");
      await expect(page.getByRole("heading", { level: 1, name: /Design for decisions/ })).toBeVisible();
      expect(localStyles.length).toBe(3);
      expect(localStyles.filter((response) => !response.ok), JSON.stringify(localStyles)).toEqual([]);

      const overflow = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);

      await page.keyboard.press("Tab");
      const skipLink = page.getByRole("link", { name: "Skip to design system" });
      await expect(skipLink).toBeFocused();
      const focusRing = await skipLink.evaluate((element) => {
        const style = getComputedStyle(element);
        return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
      });
      expect(focusRing.style).not.toBe("none");
      expect(focusRing.width).toBeGreaterThanOrEqual(3);
      await page.evaluate(() => document.activeElement?.blur());

      const routeHint = page.locator("#route-table-hint");
      if (viewport.name === "compact") {
        await expect(routeHint).toBeVisible();
        const undersized = await page
          .locator('a, button, input:not([type="radio"]), select, textarea, summary, [tabindex="0"]')
          .evaluateAll((elements) =>
            elements.flatMap((element) => {
              const style = getComputedStyle(element);
              if (style.display === "none" || style.visibility === "hidden") return [];
              const inlineProseLink =
                element.matches("a.ctw-link") && Boolean(element.closest("p, li, figcaption"));
              if (inlineProseLink) return [];
              const rect = element.getBoundingClientRect();
              return rect.width < 44 || rect.height < 44
                ? [{ tag: element.tagName, text: element.textContent?.trim(), width: rect.width, height: rect.height }]
                : [];
            }),
          );
        expect(undersized).toEqual([]);
      } else {
        await expect(routeHint).toBeHidden();
      }

      const contrastSamples = await page.evaluate(() => {
        const selectors = [
          "h1",
          ".guide-hero .ctw-lede",
          ".ctw-primary-nav__link[aria-current]",
          ".ctw-chart-frame > figcaption",
          ".ctw-feedback__legend",
        ];
        const channels = (value) => value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
        const luminance = (value) => {
          const rgb = channels(value).map((channel) => channel / 255);
          const linear = rgb.map((channel) =>
            channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
          );
          return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
        };
        return selectors.map((selector) => {
          const element = document.querySelector(selector);
          const foreground = getComputedStyle(element).color;
          let backgroundElement = element;
          let background = getComputedStyle(backgroundElement).backgroundColor;
          while (backgroundElement.parentElement && background.endsWith(", 0)")) {
            backgroundElement = backgroundElement.parentElement;
            background = getComputedStyle(backgroundElement).backgroundColor;
          }
          const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
          return { selector, foreground, background, ratio: (values[0] + 0.05) / (values[1] + 0.05) };
        });
      });
      for (const sample of contrastSamples) {
        expect(sample.ratio, JSON.stringify(sample)).toBeGreaterThanOrEqual(4.5);
      }

      const chart = page.locator("figure.ctw-chart-frame");
      await expect(chart.locator("figcaption")).toBeVisible();
      await expect(chart.getByRole("img", { name: /CTW spacing token values/ })).toBeVisible();
      await expect(chart.getByRole("table", { name: /Table fallback/ })).toBeVisible();

      const feedback = page.locator("fieldset.ctw-feedback");
      await expect(feedback.locator("legend")).toBeVisible();
      await expect(feedback.getByRole("radio")).toHaveCount(3);
      const feedbackTargets = await feedback.locator("label").evaluateAll((labels) =>
        labels.map((label) => label.getBoundingClientRect().height),
      );
      expect(feedbackTargets.every((height) => height >= 44)).toBe(true);

      const invalidField = page.locator("#boundary");
      expect(await invalidField.evaluate((input) => input.validity.patternMismatch)).toBe(true);

      const screenshotPath = testInfo.outputPath(
        `${viewport.name}-${viewport.width}x${viewport.height}.png`,
      );
      const screenshot = await page.screenshot({
        path: screenshotPath,
        animations: "disabled",
        fullPage: true,
      });
      expect(screenshot.byteLength).toBeGreaterThan(0);
      await testInfo.attach(`${viewport.name} reviewed screenshot`, {
        path: screenshotPath,
        contentType: "image/png",
      });

      expect(await invalidField.evaluate((input) => input.validity.patternMismatch)).toBe(true);
      expect(runtimeErrors).toEqual([]);
    });
  });
}

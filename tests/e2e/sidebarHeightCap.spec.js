/**
 * E2E: the saved sidebar height is a ceiling, not a fixed size.
 *
 * The panel fits its content (compact while little is rendered) and grows
 * as content arrives, up to the height the user last dragged it to. Only a
 * drag of the resize handle is persisted; content-driven growth is not.
 */
const { test, expect } = require('@playwright/test');
const { setupExtensionPage } = require('./_helpers');
const fixtures = require('./fixtures/sources');

const fm = fixtures.yamlFrontmatter;
const SIZE_KEY = 'grdc_sidebar_size';

async function setup(page, savedSize) {
  await page.addInitScript(([key, size]) => {
    localStorage.setItem(key, JSON.stringify(size));
    localStorage.setItem('grdc_sidebar_collapsed', '0');
    localStorage.setItem('grdc_sidebar_tab', 'threads');
  }, [SIZE_KEY, savedSize]);
  await setupExtensionPage(page, 'yaml-frontmatter', {
    rawSource: { [fm.path]: fm.source },
  });
  await expect(page.locator('.grdc-sidebar')).toBeVisible();
}

test('a tall saved height does not stretch a sparse sidebar', async ({ page }) => {
  await setup(page, { width: 480, height: 700 });
  const box = await page.locator('.grdc-sidebar').boundingBox();
  expect(box.height).toBeLessThan(400);
});

test('content changes do not overwrite the saved size', async ({ page }) => {
  await setup(page, { width: 480, height: 700 });
  await page.keyboard.press('3'); // Outline: different content height
  await page.waitForTimeout(600); // longer than the 250 ms persist debounce
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SIZE_KEY);
  expect(saved).toEqual({ width: 480, height: 700 });
});

test('content taller than the saved height is capped at it', async ({ page }) => {
  await setup(page, { width: 480, height: 130 });
  await page.keyboard.press('3');
  const box = await page.locator('.grdc-sidebar').boundingBox();
  expect(box.height).toBeLessThanOrEqual(131);
});

/**
 * E2E: Outline toolbar "Collapse all" folds every heading at every level,
 * and "Expand all" reverses it.
 */
const { test, expect } = require('@playwright/test');
const { setupExtensionPage } = require('./_helpers');
const fixtures = require('./fixtures/sources');

const fm = fixtures.yamlFrontmatter;
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  .map((h) => `.prose-diff .markdown-body ${h}`).join(', ');

test('Collapse all folds every heading; Expand all unfolds them', async ({ page }) => {
  await setupExtensionPage(page, 'yaml-frontmatter', {
    rawSource: { [fm.path]: fm.source },
  });
  await page.keyboard.press('3');
  const collapseAll = page.locator('.grdc-sidebar-collapse-all');
  await expect(collapseAll).toBeVisible();

  const headings = page.locator(HEADINGS);
  const total = await headings.count();
  expect(total).toBeGreaterThan(1);

  await collapseAll.click();
  await expect(page.locator(`:is(${HEADINGS}).grdc-section-collapsed`)).toHaveCount(total);

  await page.locator('.grdc-sidebar-expand-all').click();
  await expect(page.locator(`:is(${HEADINGS}).grdc-section-collapsed`)).toHaveCount(0);
});

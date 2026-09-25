/**
 * E2E: the new-comment form mirrors GitHub's native line-comment form —
 * "Add a comment on line N" header, Write / Preview tabs sharing a row with
 * an Octicon Markdown toolbar, and a Comment button that stays disabled
 * while the editor is empty.
 */
const { test, expect } = require('@playwright/test');
const { setupExtensionPage } = require('./_helpers');
const fixtures = require('./fixtures/sources');

const fm = fixtures.yamlFrontmatter;

test('new-comment form matches GitHub\'s layout and gating', async ({ page }) => {
  await setupExtensionPage(page, 'yaml-frontmatter', {
    rawSource: { [fm.path]: fm.source },
  });
  const target = page.locator('.grdc-hoverable').nth(3);
  await target.hover();
  await target.locator('.grdc-comment-btn').first().click();

  const box = page.locator('.grdc-comment-box');
  await expect(box.locator('.grdc-comment-box-title')).toContainText('Add a comment on line');
  await expect(box.locator('.grdc-line-input')).toBeVisible();

  const header = box.locator('.grdc-editor-header');
  await expect(header.locator('.grdc-tab')).toHaveText(['Write', 'Preview']);
  await expect(header.locator('.grdc-tb-btn svg')).toHaveCount(9);

  const submit = box.locator('.grdc-btn-primary');
  await expect(submit).toBeDisabled();
  await box.locator('.grdc-editor-textarea').fill('Looks good');
  await expect(submit).toBeEnabled();
  await box.locator('.grdc-editor-textarea').fill('   ');
  await expect(submit).toBeDisabled();
});

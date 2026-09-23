'use strict';

const { test, expect } = require('@playwright/test');
const { setupExtensionPage } = require('./_helpers');
const { yamlFrontmatter } = require('./fixtures/sources');

test('rendered Markdown with no threads does not offer redundant bulk rendering', async ({ page }) => {
  await setupExtensionPage(page, 'yaml-frontmatter', {
    rawSource: { [yamlFrontmatter.path]: yamlFrontmatter.source },
  });

  await page.locator('.grdc-sidebar-tab[data-grdc-tab="threads"]').click();

  await expect(page.locator('.grdc-sidebar-empty-msg')).toHaveText('No review threads visible.');
  await expect(page.locator('.grdc-sidebar-empty-cta')).toHaveCount(0);
});

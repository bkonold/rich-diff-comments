'use strict';

const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');
const {
  REPO_ROOT,
  FAKE_PR_URL,
  setupFixture,
  injectExtension,
} = require('./_helpers');
const { yamlFrontmatter } = require('./fixtures/sources');

const fixtureHtml = fs.readFileSync(
  path.join(REPO_ROOT, 'tests', 'e2e', 'fixtures', 'yaml-frontmatter.html'),
  'utf8'
);

test('runtime loaded on Pull requests initializes after SPA navigation into Files changed', async ({ page }) => {
  await setupFixture(page, 'yaml-frontmatter', {
    rawSource: { [yamlFrontmatter.path]: yamlFrontmatter.source },
  });

  await page.goto('https://github.com/test-owner/test-repo/pulls', {
    waitUntil: 'domcontentloaded',
  });
  await injectExtension(page);
  await expect(page.locator('.grdc-sidebar')).toHaveCount(0);

  await page.evaluate(({ html, prUrl }) => {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    history.pushState(history.state, '', prUrl);
    document.body.innerHTML = parsed.body.innerHTML;
  }, { html: fixtureHtml, prUrl: FAKE_PR_URL });

  await expect(page.locator('.grdc-sidebar')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.grdc-sidebar-outline-tree')).toContainText('Overview');
});

const { test, expect } = require('@playwright/test');
const {
  setupFixture,
  gotoPRPage,
  injectExtension,
  waitForInit,
} = require('./_helpers');
const sources = require('./fixtures/sources');

const fixture = sources.yamlFrontmatter;

async function expectOneFileGuidance(page) {
  await expect(page.locator('.grdc-sidebar-render-md')).toBeHidden();
  await expect(page.locator('.grdc-sidebar-empty-cta')).toHaveCount(0);
  await expect(page.getByText(/Review Markdown files one at a time/i).first()).toBeVisible();
  await expect(page.getByText(/switch each file to rich diff as needed/i).first()).toBeVisible();
}

test('mode=virtualization replaces bulk render with one-file guidance', async ({ page }) => {
  await setupFixture(page, 'yaml-frontmatter', {
    rawSource: { [fixture.path]: fixture.source },
  });
  await gotoPRPage(page);
  await page.evaluate(() => history.replaceState(null, '', '/test-owner/test-repo/pull/1/changes?mode=virtualization#diff-example'));
  await injectExtension(page);
  await waitForInit(page);

  await expectOneFileGuidance(page);
});

test('single-file transition link remains a fallback large-PR signal', async ({ page }) => {
  await setupFixture(page, 'yaml-frontmatter', {
    rawSource: { [fixture.path]: fixture.source },
  });
  await gotoPRPage(page);
  await page.evaluate(() => {
    const link = document.createElement('a');
    link.href = '/test-owner/test-repo/pull/1/changes?mode=single#diff-example';
    link.textContent = 'Switch to single file mode';
    document.body.prepend(link);
  });
  await injectExtension(page);
  await waitForInit(page);

  await expectOneFileGuidance(page);
});

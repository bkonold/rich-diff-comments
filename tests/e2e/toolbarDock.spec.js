/**
 * E2E: collapsed sidebar docks into GitHub's files toolbar.
 *
 * On the React Files-changed view, collapsing the sidebar moves the whole
 * `.grdc-sidebar` element into GitHub's sticky files toolbar, just before
 * the "N / M viewed" controls. Expanding moves it back to <body>. When no
 * toolbar is present (classic `/files` view) the collapsed strip stays
 * floating exactly as before.
 *
 * The fixtures don't include GitHub's toolbar, so each test that needs one
 * injects a minimal stand-in with the same CSS-module class prefixes the
 * extension matches (captured from github.com, 2026-09). The hashed
 * suffixes are deliberately different from production to prove the
 * selectors only depend on the stable prefix.
 */
const { test, expect } = require('@playwright/test');
const {
  setupExtensionPage, setupFixture, gotoPRPage, injectExtension, waitForInit,
} = require('./_helpers');
const fixtures = require('./fixtures/sources');

const fm = fixtures.yamlFrontmatter;

async function injectFilesToolbar(page) {
  await page.evaluate(() => {
    const toolbar = document.createElement('section');
    toolbar.className = 'PullRequestFilesToolbar-module__toolbar__test1';
    toolbar.innerHTML = `
      <div class="left-group"></div>
      <div class="right-group" style="display:flex;align-items:center">
        <div class="d-flex PullRequestFilesToolbar-module__file-controls__test2">0 / 3 viewed</div>
        <button type="button" class="submit-review">Submit review</button>
      </div>`;
    document.body.prepend(toolbar);
  });
}

async function ensureExpanded(page) {
  const collapsed = await page.locator('.grdc-sidebar').evaluate((el) =>
    el.classList.contains('grdc-sidebar-collapsed')
  );
  if (collapsed) await page.keyboard.press('t');
}

test.describe('toolbar dock', () => {
  test.beforeEach(async ({ page }) => {
    await setupExtensionPage(page, 'yaml-frontmatter', {
      rawSource: { [fm.path]: fm.source },
    });
    await expect(page.locator('.grdc-sidebar')).toBeVisible({ timeout: 5000 });
  });

  test('collapsing docks the strip before the viewed controls; expanding restores it', async ({ page }) => {
    await injectFilesToolbar(page);
    await ensureExpanded(page);

    await page.keyboard.press('t');
    const sidebar = page.locator('.grdc-sidebar');
    await expect(sidebar).toHaveClass(/grdc-sidebar-docked/);

    const placement = await page.evaluate(() => {
      const dock = document.querySelector('.grdc-toolbar-dock');
      const controls = document.querySelector('[class*="PullRequestFilesToolbar-module__file-controls__"]');
      return {
        sidebarInDock: document.querySelector('.grdc-sidebar').parentElement === dock,
        dockBeforeControls: dock?.nextElementSibling === controls,
        position: getComputedStyle(document.querySelector('.grdc-sidebar')).position,
      };
    });
    expect(placement).toEqual({ sidebarInDock: true, dockBeforeControls: true, position: 'static' });

    // Docked controls must still be usable and visibly sized.
    const box = await sidebar.boundingBox();
    expect(box.width).toBeGreaterThan(100);

    await page.keyboard.press('t');
    await expect(sidebar).not.toHaveClass(/grdc-sidebar-docked/);
    const restored = await page.evaluate(() => ({
      parentIsBody: document.querySelector('.grdc-sidebar').parentElement === document.body,
      dockGone: !document.querySelector('.grdc-toolbar-dock'),
      position: getComputedStyle(document.querySelector('.grdc-sidebar')).position,
    }));
    expect(restored).toEqual({ parentIsBody: true, dockGone: true, position: 'fixed' });
  });

  test('the docked collapse button expands the sidebar', async ({ page }) => {
    await injectFilesToolbar(page);
    await ensureExpanded(page);
    await page.keyboard.press('t');
    await expect(page.locator('.grdc-sidebar')).toHaveClass(/grdc-sidebar-docked/);

    await page.locator('.grdc-toolbar-dock .grdc-sidebar-collapse').click();
    await expect(page.locator('.grdc-sidebar')).not.toHaveClass(/grdc-sidebar-collapsed/);
    await expect(page.locator('.grdc-sidebar')).not.toHaveClass(/grdc-sidebar-docked/);
  });

  test('without a files toolbar the collapsed strip stays floating', async ({ page }) => {
    await ensureExpanded(page);
    await page.keyboard.press('t');
    const sidebar = page.locator('.grdc-sidebar');
    await expect(sidebar).toHaveClass(/grdc-sidebar-collapsed/);
    await expect(sidebar).not.toHaveClass(/grdc-sidebar-docked/);
    expect(await sidebar.evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
  });

  test('a collapsed strip docks when the toolbar renders later', async ({ page }) => {
    await ensureExpanded(page);
    await page.keyboard.press('t');
    await expect(page.locator('.grdc-sidebar')).not.toHaveClass(/grdc-sidebar-docked/);

    await injectFilesToolbar(page);
    await expect(page.locator('.grdc-sidebar')).toHaveClass(/grdc-sidebar-docked/);
  });

  test('re-docks after GitHub replaces the toolbar it was docked in', async ({ page }) => {
    await injectFilesToolbar(page);
    await ensureExpanded(page);
    await page.keyboard.press('t');
    await expect(page.locator('.grdc-sidebar')).toHaveClass(/grdc-sidebar-docked/);

    // Simulate a React re-render that throws away the whole toolbar subtree,
    // taking the docked sidebar with it, then mounts a fresh toolbar.
    await page.evaluate(() => {
      document.querySelector('section[class*="PullRequestFilesToolbar-module__toolbar"]').remove();
    });
    await injectFilesToolbar(page);

    await expect(page.locator('.grdc-sidebar')).toHaveCount(1);
    await expect(page.locator('.grdc-toolbar-dock .grdc-sidebar')).toHaveCount(1);
  });
});

test('every page load starts collapsed and docked', async ({ page }) => {
  await setupFixture(page, 'yaml-frontmatter', { rawSource: { [fm.path]: fm.source } });
  await gotoPRPage(page);
  // A stored preference from an older version must not matter.
  await page.evaluate(() => localStorage.setItem('grdc_sidebar_collapsed', '0'));
  await injectFilesToolbar(page);
  await injectExtension(page);
  await waitForInit(page, { keepCollapsed: true });

  const sidebar = page.locator('.grdc-sidebar');
  await expect(sidebar).toHaveClass(/grdc-sidebar-collapsed/);
  await expect(sidebar).toHaveClass(/grdc-sidebar-docked/);
  expect(await page.evaluate(() => localStorage.getItem('grdc_sidebar_collapsed'))).toBeNull();
});

test('expanding is not persisted and survives sidebar rebuilds', async ({ page }) => {
  await setupExtensionPage(page, 'yaml-frontmatter', {
    rawSource: { [fm.path]: fm.source },
  });
  const sidebar = page.locator('.grdc-sidebar');
  await expect(sidebar).not.toHaveClass(/grdc-sidebar-collapsed/);
  expect(await page.evaluate(() => localStorage.getItem('grdc_sidebar_collapsed'))).toBeNull();

  // Toggling the unresolved filter rebuilds the sidebar in place; the
  // user's expand must stick.
  await page.keyboard.press('2');
  await page.locator('.grdc-sidebar-filter-cb').check();
  await page.waitForTimeout(300);
  await expect(sidebar).not.toHaveClass(/grdc-sidebar-collapsed/);
});

test('Shift+T reset opens the full sidebar', async ({ page }) => {
  await setupExtensionPage(page, 'yaml-frontmatter', {
    rawSource: { [fm.path]: fm.source },
    keepCollapsed: true,
  });
  await expect(page.locator('.grdc-sidebar')).toHaveClass(/grdc-sidebar-collapsed/);

  await page.keyboard.press('Shift+T');
  await expect(page.locator('.grdc-sidebar')).not.toHaveClass(/grdc-sidebar-collapsed/);
});

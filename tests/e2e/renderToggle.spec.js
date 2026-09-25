/**
 * E2E: the header book / code button toggles every Markdown file between
 * rich diff and source diff.
 *
 * The fixtures are captured with rich diff already active and without
 * GitHub's per-file toggle, so each test injects a stand-in segmented
 * control ("Display the source diff" / "Display the rich diff") into every
 * file container. Clicking a segment shows or hides that file's
 * `.prose-diff`, which is what the extension reads to decide render state.
 */
const { test, expect } = require('@playwright/test');
const { setupExtensionPage } = require('./_helpers');
const fixtures = require('./fixtures/sources');

const fm = fixtures.yamlFrontmatter;

async function injectDiffToggles(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.prose-diff').forEach((prose) => {
      const container = prose.closest('div[id^="diff-"], [data-tagsearch-path], .file[data-path]');
      if (!container || container.querySelector('.test-diff-toggle')) return;
      const group = document.createElement('div');
      group.className = 'test-diff-toggle';
      group.innerHTML = `
        <button type="button" aria-label="Display the source diff">Source</button>
        <button type="button" aria-label="Display the rich diff" aria-current="true">Rich</button>`;
      const [source, rich] = group.querySelectorAll('button');
      const show = (renderedView) => {
        prose.style.display = renderedView ? '' : 'none';
        rich.setAttribute('aria-current', String(renderedView));
        source.setAttribute('aria-current', String(!renderedView));
      };
      source.addEventListener('click', () => show(false));
      rich.addEventListener('click', () => show(true));
      container.prepend(group);
    });
  });
}

test.describe('render toggle', () => {
  test.beforeEach(async ({ page }) => {
    await setupExtensionPage(page, 'yaml-frontmatter', {
      rawSource: { [fm.path]: fm.source },
    });
    await injectDiffToggles(page);
  });

  test('flips all Markdown files to source and back, swapping its icon', async ({ page }) => {
    const btn = page.locator('.grdc-sidebar-render-md');
    const prose = page.locator('.prose-diff').first();

    // Everything starts rendered, so the button offers "back to source".
    await expect(btn).toHaveAttribute('data-grdc-next', 'source');
    await expect(btn).toHaveAttribute('title', /source diff/i);

    await btn.click();
    await expect(prose).toBeHidden();
    await expect(btn).toHaveAttribute('data-grdc-next', 'rich');
    await expect(btn).toHaveAttribute('title', /Render all Markdown/);

    await btn.click();
    await expect(prose).toBeVisible();
    await expect(btn).toHaveAttribute('data-grdc-next', 'source');
  });

  test('does not expand a collapsed sidebar or switch tabs', async ({ page }) => {
    const sidebar = page.locator('.grdc-sidebar');
    if (!(await sidebar.evaluate((el) => el.classList.contains('grdc-sidebar-collapsed')))) {
      await page.keyboard.press('t');
    }
    const tabBefore = await page.evaluate(() => localStorage.getItem('grdc_sidebar_tab'));

    await page.keyboard.press('b');
    await expect(page.locator('.prose-diff').first()).toBeHidden();

    await expect(sidebar).toHaveClass(/grdc-sidebar-collapsed/);
    expect(await page.evaluate(() => localStorage.getItem('grdc_sidebar_tab'))).toBe(tabBefore);
  });
});

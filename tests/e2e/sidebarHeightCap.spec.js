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

test('the sidebar grows with its content up to the saved height', async ({ page }) => {
  await setup(page, { width: 480, height: 600 });
  const sidebar = page.locator('.grdc-sidebar');
  const sparse = (await sidebar.boundingBox()).height;

  // Simulate threads arriving as files render.
  const addRows = (n) => page.evaluate((count) => {
    const list = document.querySelector('.grdc-sidebar-list');
    for (let i = 0; i < count; i++) {
      const row = document.createElement('div');
      row.style.height = '30px';
      row.textContent = `thread ${i}`;
      list.appendChild(row);
    }
  }, n);

  await addRows(5);
  const grown = (await sidebar.boundingBox()).height;
  expect(grown).toBeGreaterThan(sparse + 100);

  await addRows(40);
  const capped = (await sidebar.boundingBox()).height;
  expect(capped).toBeGreaterThan(590);
  expect(capped).toBeLessThanOrEqual(601);
  const scrolls = await page.evaluate(() => {
    const list = document.querySelector('.grdc-sidebar-list');
    return list.scrollHeight > list.clientHeight;
  });
  expect(scrolls).toBe(true);
});

test('a click on the resize corner without dragging keeps the saved size', async ({ page }) => {
  await setup(page, { width: 480, height: 600 });
  const box = await page.locator('.grdc-sidebar').boundingBox();
  await page.mouse.click(box.x + box.width - 4, box.y + box.height - 4);

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SIZE_KEY);
  expect(saved).toEqual({ width: 480, height: 600 });
  // Still content-sized, with the old cap back in place.
  expect((await page.locator('.grdc-sidebar').boundingBox()).height).toBeCloseTo(box.height, 0);
  expect(await page.locator('.grdc-sidebar').evaluate((el) => getComputedStyle(el).maxHeight)).toBe('598px');
});

test('dragging the resize corner saves the new size as the cap', async ({ page }) => {
  await setup(page, { width: 480, height: 600 });
  // Headless Chromium can't drive the native `resize: both` grip, so do what
  // it does: press on the corner, change the inline size, release.
  const result = await page.evaluate(() => {
    const sidebar = document.querySelector('.grdc-sidebar');
    const rect = sidebar.getBoundingClientRect();
    sidebar.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true, button: 0, clientX: rect.right - 4, clientY: rect.bottom - 4,
    }));
    sidebar.style.width = '520px';
    sidebar.style.height = `${rect.height + 150}px`;
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    return { before: rect.height, maxHeight: getComputedStyle(sidebar).maxHeight };
  });

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SIZE_KEY);
  expect(saved.width).toBe(522); // border-box: 520 content + 2 × 1px border
  // Inline height is content-box; the saved size is border-box (+2px).
  expect(Math.abs(saved.height - (result.before + 152))).toBeLessThanOrEqual(1);
  expect(result.maxHeight).toBe(`${saved.height - 2}px`);
});

test('a restored width matches the saved width exactly', async ({ page }) => {
  await setup(page, { width: 522, height: 600 });
  expect(await page.locator('.grdc-sidebar').evaluate((el) => el.offsetWidth)).toBe(522);
});

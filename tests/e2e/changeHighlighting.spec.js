/**
 * E2E: rich-diff change highlighting.
 *
 * Added / removed blocks get a full-width source-diff tint, a solid rail
 * and a +/− glyph; changed blocks get a solid attention rail. The stand-in
 * blocks mirror GitHub's rich-diff markup (captured 2026-09): top-level
 * `.rich-diff-level-zero.added` / `.removed` / `.changed` elements and
 * block-level `<ins>` / `<del>` wrappers under `.markdown-body`.
 */
const { test, expect } = require('@playwright/test');
const { setupExtensionPage } = require('./_helpers');
const fixtures = require('./fixtures/sources');

const fm = fixtures.yamlFrontmatter;

test('added, removed and changed blocks are highlighted', async ({ page }) => {
  await setupExtensionPage(page, 'yaml-frontmatter', {
    rawSource: { [fm.path]: fm.source },
  });
  const styles = await page.evaluate(() => {
    const body = document.querySelector('.prose-diff .markdown-body');
    body.insertAdjacentHTML('beforeend', `
      <ul class="removed rich-diff-level-zero" id="t-removed"><li>old item</li></ul>
      <ins id="t-ins"><p class="rich-diff-level-one">new paragraph</p></ins>
      <div class="changed rich-diff-level-zero" id="t-changed">
        <ul class="rich-diff-level-one"><li class="added" id="t-li">new</li><li class="unchanged">same</li></ul>
      </div>`);
    const read = (id, pseudo) => {
      const cs = getComputedStyle(document.getElementById(id), pseudo);
      return { bg: cs.backgroundColor, shadow: cs.boxShadow, content: cs.content, image: cs.backgroundImage };
    };
    return {
      removed: read('t-removed'), removedGlyph: read('t-removed', '::before'),
      ins: read('t-ins'), insGlyph: read('t-ins', '::before'),
      changed: read('t-changed'), liGutter: read('t-li', '::before'),
    };
  });

  expect(styles.removed.bg).toBe('rgb(255, 235, 233)');
  expect(styles.removed.shadow).toBe('rgb(207, 34, 46) 4px 0px 0px 0px inset');
  expect(styles.removedGlyph.content).toBe('"−"');
  expect(styles.ins.bg).toBe('rgb(218, 251, 225)');
  expect(styles.insGlyph.content).toBe('"+"');
  expect(styles.changed.shadow).toBe('rgb(154, 103, 0) 4px 0px 0px 0px inset');
  expect(styles.liGutter.content).toBe('"+"');
  expect(styles.liGutter.image).toContain('linear-gradient');
});

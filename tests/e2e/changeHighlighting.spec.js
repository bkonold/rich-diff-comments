/**
 * E2E: rich-diff change highlighting.
 *
 * Added / removed blocks get a full-width source-diff tint and a solid
 * rail; changed blocks get a solid attention rail. The stand-in blocks
 * mirror GitHub's rich-diff markup (captured 2026-09): top-level
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
      removed: read('t-removed'),
      ins: read('t-ins'),
      changed: read('t-changed'), liGutter: read('t-li', '::before'),
    };
  });

  expect(styles.removed.bg).toBe('rgb(255, 235, 233)');
  expect(styles.removed.shadow).toBe('rgb(207, 34, 46) 4px 0px 0px 0px inset');
  expect(styles.ins.bg).toBe('rgb(218, 251, 225)');
  expect(styles.changed.shadow).toBe('rgb(154, 103, 0) 4px 0px 0px 0px inset');
  expect(styles.liGutter.content).toBe('""');
  expect(styles.liGutter.image).toContain('linear-gradient');
});

test('consecutive added blocks form one continuous highlight', async ({ page }) => {
  await setupExtensionPage(page, 'yaml-frontmatter', {
    rawSource: { [fm.path]: fm.source },
  });
  const gaps = await page.evaluate(() => {
    const body = document.querySelector('.prose-diff .markdown-body');
    const run = document.createElement('div');
    body.append(run);
    // Mirrors a brand-new file: one <ins> per element (headings followed by
    // an anchor-only <ins>), plus a level-zero `.added` list.
    run.outerHTML = `
      <ins class="t-run"><h1 class="rich-diff-level-zero">Cycling</h1></ins>
      <ins class="t-run"><a class="anchor rich-diff-level-zero" href="#x"></a></ins>
      <ins class="t-run"><h2 class="rich-diff-level-zero">Bike shops</h2></ins>
      <ul class="added rich-diff-level-zero t-run"><li>an item</li></ul>
      <ins class="t-run"><p class="rich-diff-level-zero">a paragraph</p></ins>`;
    const els = [...document.querySelectorAll('.t-run')];
    return els.slice(1).map((el, i) =>
      Math.round(el.getBoundingClientRect().top - els[i].getBoundingClientRect().bottom));
  });
  expect(gaps).toEqual([0, 0, 0, 0]);
});

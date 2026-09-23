'use strict';

const { test, expect } = require('@playwright/test');
const { setupExtensionPage } = require('./_helpers');
const fixtures = require('./fixtures/sources');

function makeThread(id, endLine, body, options) {
  const opts = options || {};
  return {
    id: String(id),
    subjectType: opts.startLine ? 'MULTI_LINE' : 'LINE',
    isResolved: !!opts.isResolved,
    viewerCanReply: true,
    viewerCanResolve: true,
    commentsData: {
      comments: [{
        databaseId: id * 10,
        body,
        author: { login: 'reviewer', avatarUrl: '' },
        createdAt: opts.createdAt || `2026-09-23T13:${String(id - 300).padStart(2, '0')}:00.000Z`,
      }],
    },
  };
}

function routeDataWithCodeThreads() {
  return {
    diffSummaries: [{
      path: fixtures.codeMarkers.path,
      pathDigest: 'code1',
      changeType: 'MODIFIED',
      markersMap: {
        R4: { threads: [{ id: '301' }, { id: '302' }] },
        R5: { threads: [{ id: '303' }, { id: '304', start: 'R4' }] },
      },
    }],
    markers: {
      threads: {
        301: makeThread(301, 4, 'First alpha-line thread.', { createdAt: '2026-09-23T13:01:00.000Z' }),
        302: makeThread(302, 4, 'Resolved alpha-line thread.', {
          isResolved: true,
          createdAt: '2026-09-23T13:02:00.000Z',
        }),
        303: makeThread(303, 5, 'Beta-line thread.', { createdAt: '2026-09-23T13:03:00.000Z' }),
        304: makeThread(304, 5, 'Alpha-to-beta range thread.', {
          startLine: 4,
          createdAt: '2026-09-23T13:04:00.000Z',
        }),
      },
    },
  };
}

test.describe('GitHub code-line thread markers', () => {
  test('marks exact fenced lines and cycles through their conversations', async ({ page }) => {
    await setupExtensionPage(page, 'code-markers', {
      rawSource: { [fixtures.codeMarkers.path]: fixtures.codeMarkers.source },
      routeData: routeDataWithCodeThreads(),
    });

    const pre = page.locator('.markdown-body pre');
    const line4Marker = pre.locator('.grdc-code-line-thread-marker[data-line="4"]');
    const line5Marker = pre.locator('.grdc-code-line-thread-marker[data-line="5"]');

    await expect(line4Marker).toHaveCount(1);
    await expect(line5Marker).toHaveCount(1);
    await expect(line4Marker).toHaveAttribute('data-count', '3');
    await expect(line5Marker).toHaveAttribute('data-count', '2');
    await expect(line4Marker).toHaveAttribute('data-thread-ids', '301,302,304');
    await expect(line5Marker).toHaveAttribute('data-thread-ids', '304,303');
    await expect(pre).toContainText('alpha: 1');
    await expect(pre).toContainText('delta: 4');

    const centerDifferences = await pre.evaluate((element) => {
      const preRect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      const paddingTop = parseFloat(styles.paddingTop);
      const lineHeight = parseFloat(styles.lineHeight);
      return Array.from(element.querySelectorAll('.grdc-code-line-thread-marker')).map((marker) => {
        const sourceLine = Number(marker.dataset.line);
        const expectedCenter = preRect.top + paddingTop + (sourceLine - 4 + 0.5) * lineHeight;
        const markerRect = marker.getBoundingClientRect();
        return Math.abs(expectedCenter - (markerRect.top + markerRect.height / 2));
      });
    });
    expect(centerDifferences).toHaveLength(2);
    centerDifferences.forEach((difference) => expect(difference).toBeLessThanOrEqual(1));

    await line4Marker.click();
    await expect(page.locator('.grdc-thread-badge[data-grdc-thread-id="301"]')).toBeFocused();
    await line4Marker.press('Enter');
    const resolvedBadge = page.locator('.grdc-thread-badge[data-grdc-thread-id="302"]');
    await expect(resolvedBadge).toBeFocused();
    await expect(resolvedBadge.locator('xpath=..').locator('.grdc-thread-body')).toBeVisible();
    await line4Marker.press('Enter');
    await expect(page.locator('.grdc-thread-badge[data-grdc-thread-id="304"]')).toBeFocused();
  });
});

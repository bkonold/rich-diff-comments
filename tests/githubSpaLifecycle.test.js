'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'extensions', 'github', 'manifest.json'), 'utf8'));
const content = fs.readFileSync(path.join(ROOT, 'extensions', 'github', 'content.js'), 'utf8');

test('GitHub runtime is present when SPA navigation starts from the pull-request list', () => {
  const matches = manifest.content_scripts[0].matches;
  assert.ok(matches.includes('https://github.com/*/pull/*'));
  assert.ok(matches.includes('https://github.com/*/pulls*'));
});

test('GitHub PR changes reset every PR-scoped cache before reinitializing', () => {
  assert.match(content, /if \(nextPrKey !== activePrKey\) \{\s*resetPrScopedState\(\);\s*activePrKey = nextPrKey;/);
  assert.match(
    content,
    /function resetPrScopedState\(\)[\s\S]*?routeData = null;[\s\S]*?pathDigestMap\.clear\(\);[\s\S]*?pathChangeTypeMap\.clear\(\);[\s\S]*?rawSourceCache\.clear\(\);[\s\S]*?fileLineMap\.clear\(\);[\s\S]*?existingComments = \[\];[\s\S]*?mentionSuggestionCache = null;[\s\S]*?mentionIdsResolved = null;/
  );
  assert.match(content, /if \(initGeneration !== routeLifecycleGeneration\) return;/);
  assert.match(content, /const fetchGeneration = routeLifecycleGeneration;/);
  assert.match(content, /if \(fetchGeneration !== routeLifecycleGeneration\) return null;/);
});
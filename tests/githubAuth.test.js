'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(ROOT, ...parts), 'utf8');

const content = read('extensions', 'github', 'content.js');
const privacy = read('PRIVACY.md');
const publishing = read('docs', 'PUBLISHING.md');
const chromeSubmission = read('.github', 'skills', 'rdc-publish-check', 'templates', 'CHROME_SUBMISSION.md');
const edgeSubmission = read('.github', 'skills', 'rdc-publish-check', 'templates', 'EDGE_SUBMISSION.md');

test('GitHub runtime deletes legacy PAT storage without reading credentials', () => {
  assert.match(content, /localStorage\.removeItem\('grdc_github_token'\)/);
  assert.match(content, /localStorage\.removeItem\('grdc_use_pat'\)/);
  assert.doesNotMatch(content, /localStorage\.getItem\(['"]grdc_(?:github_token|use_pat)['"]\)/);

  const cleanupIndex = content.indexOf("localStorage.removeItem('grdc_github_token')");
  const helperInitIndex = content.indexOf('const {');
  assert.ok(cleanupIndex > 0 && cleanupIndex < helperInitIndex, 'legacy credential cleanup must run at startup');
});

test('GitHub comment submission has no PAT or public REST fallback', () => {
  for (const removedSymbol of [
    'getGitHubToken',
    'setGitHubToken',
    'promptForToken',
    'postReviewCommentApi'
  ]) {
    assert.doesNotMatch(content, new RegExp(`\\b${removedSymbol}\\b`));
  }
  assert.doesNotMatch(content, /https:\/\/api\.github\.com/);
  assert.doesNotMatch(content, /Authorization\s*:\s*[`'"]token\b/i);
  assert.doesNotMatch(content, /settings\/tokens/);
  assert.match(
    content,
    /async function postReviewComment\(path, line, body, opts\)\s*\{\s*return postReviewCommentInternal\(path, line, body, opts\);\s*\}/
  );
});

test('GitHub privacy and store guidance describe session-only authentication', () => {
  for (const [name, document] of [
    ['PRIVACY.md', privacy],
    ['docs/PUBLISHING.md', publishing],
    ['CHROME_SUBMISSION.md', chromeSubmission],
    ['EDGE_SUBMISSION.md', edgeSubmission]
  ]) {
    assert.doesNotMatch(document, /optional opt-in PAT|optional PAT mode|grdc_use_pat|grdc_github_token/i, name);
  }

  assert.match(privacy, /does not handle, store, or transmit your GitHub password or a Personal Access Token/);
  assert.match(chromeSubmission, /does not read or store passwords, raw session cookies, Personal Access Tokens, or OAuth tokens/);
  assert.match(edgeSubmission, /does not read or store passwords, raw session cookies, Personal Access Tokens, or OAuth tokens/);
});

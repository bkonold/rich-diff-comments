'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const content = fs.readFileSync(path.join(ROOT, 'extensions', 'github', 'content.js'), 'utf8');
const styles = fs.readFileSync(path.join(ROOT, 'extensions', 'github', 'styles.css'), 'utf8');

test('owned comments expose Edit and Delete as direct header actions', () => {
  assert.match(content, /const editLinkMarkup = isOwn[\s\S]*grdc-comment-edit-link/);
  assert.match(content, /const deleteLinkMarkup = isOwn[\s\S]*grdc-comment-delete-link/);
  assert.match(content, /\$\{editLinkMarkup\}\s*\$\{deleteLinkMarkup\}/);
  assert.doesNotMatch(content, /grdc-comment-menu|grdc-menu-delete|GitHub ↗/);
});

test('direct Delete keeps confirmation and disables while deleting', () => {
  assert.match(content, /deleteLinkBtn\.addEventListener\('click', async/);
  assert.match(content, /if \(!confirm\('Delete this comment\?'\)\) return;/);
  assert.match(content, /deleteLinkBtn\.disabled = true;\s*const result = await deleteReviewComment\(c\.dbId\);/);
  assert.match(content, /else \{\s*deleteLinkBtn\.disabled = false;/);
});

test('Delete retains destructive styling without overflow-menu CSS', () => {
  assert.match(styles, /\.grdc-comment-delete-link\s*\{[\s\S]*?color:\s*var\(--fgColor-danger/);
  assert.doesNotMatch(styles, /\.grdc-comment-menu|\.grdc-menu-delete|\.grdc-comment-link/);
});

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  decodeAdoMentions,
  encodeAdoMentions,
  rebaseAdoMentions,
} = require('../src/lib/mentions.js');

const ID = '12732dd0-f63b-4121-ab06-3d4fc7dd6a1a';
const TOKEN = `@<${ID.toUpperCase()}>`;
const identityForId = (id) => id === ID ? { displayName: 'Example User' } : null;

test('decodeAdoMentions exposes a readable label and records its exact range', () => {
  assert.deepEqual(decodeAdoMentions(`Hello ${TOKEN}!`, identityForId), {
    content: 'Hello @Example User!',
    mentions: [{ start: 6, end: 19, label: '@Example User', token: TOKEN }],
  });
});

test('decodeAdoMentions preserves unresolved tokens verbatim', () => {
  const unknown = '@<AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA>';
  assert.deepEqual(decodeAdoMentions(`Hello ${unknown}`, identityForId), {
    content: `Hello ${unknown}`,
    mentions: [],
  });
});

test('encodeAdoMentions replaces only tracked labels with duplicate visible text', () => {
  const content = '@Example User asked @Example User';
  const mentions = [{ start: 20, end: 33, label: '@Example User', token: TOKEN }];
  assert.equal(encodeAdoMentions(content, mentions), `@Example User asked ${TOKEN}`);
});

test('encodeAdoMentions ignores a tracked range after its label is edited', () => {
  const mention = { start: 0, end: 13, label: '@Example User', token: TOKEN };
  assert.equal(encodeAdoMentions('@Example XUser', [mention]), '@Example XUser');
});

test('rebaseAdoMentions shifts a mention when text is inserted before it', () => {
  const mention = { start: 6, end: 19, label: '@Example User', token: TOKEN };
  assert.deepEqual(rebaseAdoMentions('Hello @Example User', 'Well, Hello @Example User', [mention]), [
    { ...mention, start: 12, end: 25 },
  ]);
});

test('rebaseAdoMentions keeps edits after a mention and removes overlapping mentions', () => {
  const mention = { start: 0, end: 13, label: '@Example User', token: TOKEN };
  assert.deepEqual(rebaseAdoMentions('@Example User hi', '@Example User hello', [mention]), [mention]);
  assert.deepEqual(rebaseAdoMentions('@Example User hi', '@Example XUser hi', [mention]), []);
});

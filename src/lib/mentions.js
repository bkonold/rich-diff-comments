/**
 * Pure helpers for keeping readable ADO mention labels linked to their native
 * GUID tokens while users edit plain-text comment fields.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module && module.exports) {
    module.exports = api;
  } else {
    root.GRDC = root.GRDC || {};
    Object.assign(root.GRDC, api);
  }
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  const ADO_MENTION_TOKEN_RE = /@<([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})>/gi;

  function decodeAdoMentions(content, identityForId) {
    const mentions = [];
    let visible = '';
    let sourceEnd = 0;
    String(content || '').replace(ADO_MENTION_TOKEN_RE, (token, id, sourceStart) => {
      const identity = typeof identityForId === 'function' ? identityForId(String(id).toLowerCase()) : null;
      if (!identity?.displayName) return token;
      visible += String(content).slice(sourceEnd, sourceStart);
      const label = `@${identity.displayName}`;
      const start = visible.length;
      visible += label;
      mentions.push({ start, end: start + label.length, label, token: `@<${String(id).toUpperCase()}>` });
      sourceEnd = sourceStart + token.length;
      return token;
    });
    visible += String(content || '').slice(sourceEnd);
    return { content: visible, mentions };
  }

  function encodeAdoMentions(content, mentions) {
    let result = String(content || '');
    const valid = (mentions || []).filter((mention) =>
      Number.isInteger(mention?.start) && Number.isInteger(mention?.end) &&
      mention.start >= 0 && mention.end >= mention.start &&
      result.slice(mention.start, mention.end) === mention.label
    ).sort((a, b) => b.start - a.start);
    valid.forEach((mention) => {
      result = result.slice(0, mention.start) + mention.token + result.slice(mention.end);
    });
    return result;
  }

  function rebaseAdoMentions(previousContent, nextContent, mentions) {
    const previous = String(previousContent || '');
    const next = String(nextContent || '');
    if (previous === next) return (mentions || []).map((mention) => ({ ...mention }));

    let prefix = 0;
    const maxPrefix = Math.min(previous.length, next.length);
    while (prefix < maxPrefix && previous[prefix] === next[prefix]) prefix++;

    let suffix = 0;
    const maxSuffix = Math.min(previous.length - prefix, next.length - prefix);
    while (suffix < maxSuffix && previous[previous.length - 1 - suffix] === next[next.length - 1 - suffix]) suffix++;

    const oldEnd = previous.length - suffix;
    const delta = next.length - previous.length;
    const insertion = prefix === oldEnd;

    return (mentions || []).flatMap((mention) => {
      if (!Number.isInteger(mention?.start) || !Number.isInteger(mention?.end)) return [];
      if (insertion) {
        if (prefix <= mention.start) return [{ ...mention, start: mention.start + delta, end: mention.end + delta }];
        if (prefix >= mention.end) return [{ ...mention }];
        return [];
      }
      if (oldEnd <= mention.start) return [{ ...mention, start: mention.start + delta, end: mention.end + delta }];
      if (prefix >= mention.end) return [{ ...mention }];
      return [];
    });
  }

  return {
    ADO_MENTION_TOKEN_RE,
    decodeAdoMentions,
    encodeAdoMentions,
    rebaseAdoMentions,
  };
});

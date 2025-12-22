const { normalizeMessage } = require("../engines/messageNormalizer");

// REFACTOR NOTE: normalizeText removed to prevent duplication.
// Use normalizeMessage imported from messageNormalizer directly.

function asArray(val) {
  if (Array.isArray(val)) return val;
  return [];
}

function buildPreview(text) {
  // Directly use the authoritative normalizer
  const t = normalizeMessage(text);
  if (!t) return "";
  return t.length > 80 ? t.slice(0, 80) : t;
}

module.exports = {
  asArray,
  buildPreview
};
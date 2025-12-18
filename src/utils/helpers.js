const { normalizeMessage } = require("../engines/messageNormalizer");

// USE CENTRAL LOGIC: Wrapper around the authoritative messageNormalizer
// This ensures PII scrubbing (Safety) applies even to utility calls.
function normalizeText(s) {
  return normalizeMessage(s);
}

function asArray(val) {
  if (Array.isArray(val)) return val;
  return [];
}

function buildPreview(text) {
  // normalizeMessage handles trimming and spacing
  const t = normalizeText(text);
  if (!t) return "";
  return t.length > 80 ? t.slice(0, 80) : t;
}

module.exports = {
  normalizeText,
  asArray,
  buildPreview
};
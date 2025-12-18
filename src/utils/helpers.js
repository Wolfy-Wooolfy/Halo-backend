function normalizeText(s) {
  return String(s || "").trim();
}

function asArray(val) {
  if (Array.isArray(val)) return val;
  return [];
}

function buildPreview(text) {
  const t = normalizeText(text).replace(/\s+/g, " ");
  if (!t) return "";
  return t.length > 80 ? t.slice(0, 80) : t;
}

module.exports = {
  normalizeText,
  asArray,
  buildPreview
};
function normalizeMessage(raw) {
  if (!raw) {
    return '';
  }

  let text = raw;

  if (typeof text !== 'string') {
    text = String(text);
  }

  const trimmed = text.trim();
  const singleSpaced = trimmed.replace(/\s+/g, ' ');

  return singleSpaced;
}

module.exports = {
  normalizeMessage
};

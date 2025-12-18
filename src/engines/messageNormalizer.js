function scrubSensitiveData(text) {
  if (!text) return "";
  // Mask Egyptian Phone Numbers (approximate 11 digits)
  let scrubbed = text.replace(/\b01[0125][0-9]{8}\b/g, "[PHONE_REDACTED]");
  // Mask National IDs (14 digits)
  scrubbed = scrubbed.replace(/\b[23][0-9]{13}\b/g, "[ID_REDACTED]");
  return scrubbed;
}

function normalizeMessage(raw) {
  if (!raw) {
    return '';
  }

  let text = raw;

  if (typeof text !== 'string') {
    text = String(text);
  }

  // 1) Trim and single space
  let processed = text.trim().replace(/\s+/g, ' ');

  // 2) Safety Scrub (PII Protection)
  processed = scrubSensitiveData(processed);

  return processed;
}

module.exports = {
  normalizeMessage
};
function detectLanguage(text) {
  if (!text) {
    return {
      language: 'unknown',
      confidence: 0
    };
  }

  let t = text;
  if (typeof t !== 'string') {
    t = String(t);
  }

  const trimmed = t.trim();
  if (trimmed.length === 0) {
    return {
      language: 'unknown',
      confidence: 0
    };
  }

  const arabicRange = /[\u0600-\u06FF]/;
  const englishRange = /[A-Za-z]/;

  const hasArabic = arabicRange.test(trimmed);
  const hasEnglish = englishRange.test(trimmed);

  if (hasArabic && !hasEnglish) {
    return {
      language: 'arabic',
      confidence: 1.0
    };
  }

  if (!hasArabic && hasEnglish) {
    return {
      language: 'english',
      confidence: 1.0
    };
  }

  if (hasArabic && hasEnglish) {
    return {
      language: 'mixed',
      confidence: 0.75
    };
  }

  return {
    language: 'unknown',
    confidence: 0.2
  };
}

module.exports = {
  detectLanguage
};

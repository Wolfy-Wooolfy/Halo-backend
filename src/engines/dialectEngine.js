function normalizeText(s) {
  return String(s || "").trim();
}

function hasAny(text, arr) {
  const t = normalizeText(text);
  if (!t) return false;
  return arr.some((k) => t.includes(k));
}

function detectArabicDialectFromText(text) {
  const t = normalizeText(text);
  if (!t) return "arabic";

  const eg = [
    "مش",
    "ليه",
    "إيه",
    "ايه",
    "ازاي",
    "إزاي",
    "بتاع",
    "عايز",
    "عاوز",
    "كده",
    "دلوقتي",
    "لسه",
    "تمام",
    "مفيش"
  ];

  const levant = [
    "شو",
    "ليش",
    "هلأ",
    "هلق",
    "تمام",
    "مو",
    "كتير",
    "وين"
  ];

  const gulf = [
    "شلون",
    "وشلون",
    "وينك",
    "هالحين",
    "الحين",
    "مره",
    "مرة",
    "زين",
    "وش"
  ];

  const maghreb = [
    "واش",
    "فين",
    "علاش",
    "بزاف",
    "دابا",
    "شنو",
    "عفاك"
  ];

  const scoreEg = eg.filter((w) => t.includes(w)).length;
  const scoreLev = levant.filter((w) => t.includes(w)).length;
  const scoreGulf = gulf.filter((w) => t.includes(w)).length;
  const scoreMaghreb = maghreb.filter((w) => t.includes(w)).length;

  const best = Math.max(scoreEg, scoreLev, scoreGulf, scoreMaghreb);

  if (best <= 0) return "arabic";

  if (best === scoreEg) return "arabic-eg";
  if (best === scoreLev) return "arabic-levant";
  if (best === scoreGulf) return "arabic-gulf";
  if (best === scoreMaghreb) return "arabic-maghreb";

  return "arabic";
}

function detectEnglishVariantFromText(text) {
  const t = normalizeText(text).toLowerCase();
  if (!t) return "english";

  const indian = ["kindly", "do the needful", "revert back", "prepone"];
  const british = ["cheers", "mate", "bloody", "whilst", "fancy"];
  const american = ["gonna", "wanna", "gotta", "y'all"];
  const african = ["how far", "abeg", "na wa"];

  const scoreIndian = indian.filter((w) => t.includes(w)).length;
  const scoreBritish = british.filter((w) => t.includes(w)).length;
  const scoreAmerican = american.filter((w) => t.includes(w)).length;
  const scoreAfrican = african.filter((w) => t.includes(w)).length;

  const best = Math.max(scoreIndian, scoreBritish, scoreAmerican, scoreAfrican);
  if (best <= 0) return "english";

  if (best === scoreIndian) return "english-indian";
  if (best === scoreBritish) return "english-british";
  if (best === scoreAmerican) return "english-american";
  if (best === scoreAfrican) return "english-african";

  return "english";
}

function normalizeLanguageVariant(languageInfo, messageText) {
  if (!languageInfo) return "en";

  if (typeof languageInfo === "string") {
    const v = languageInfo.toLowerCase();
    if (v.startsWith("arabic")) {
      if (v === "arabic") return detectArabicDialectFromText(messageText);
      return v;
    }
    if (v.startsWith("english")) {
      if (v === "english") return detectEnglishVariantFromText(messageText);
      return v;
    }
    if (v === "ar") return detectArabicDialectFromText(messageText);
    if (v === "en") return detectEnglishVariantFromText(messageText);
    return v;
  }

  const raw = String(languageInfo.language || "").toLowerCase();

  if (raw.startsWith("arabic")) {
    if (raw === "arabic") return detectArabicDialectFromText(messageText);
    return raw;
  }

  if (raw.startsWith("english")) {
    if (raw === "english") return detectEnglishVariantFromText(messageText);
    return raw;
  }

  if (raw === "ar") return detectArabicDialectFromText(messageText);
  if (raw === "en") return detectEnglishVariantFromText(messageText);

  return raw || "en";
}

module.exports = {
  normalizeLanguageVariant,
  detectArabicDialectFromText,
  detectEnglishVariantFromText
};

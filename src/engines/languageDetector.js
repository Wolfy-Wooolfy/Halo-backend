const { normalizeText } = require("../utils/helpers");

function hasArabicChars(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function hasLatinChars(text) {
  return /[A-Za-z]/.test(text);
}

function countMatches(text, patterns) {
  let c = 0;
  for (const p of patterns) {
    if (p.test(text)) c += 1;
  }
  return c;
}

function detectArabicVariant(t) {
  const text = normalizeText(t).toLowerCase();
  if (!text) return { language: "arabic", confidence: 0.6 };

  const egypt = [
    /\bبقالي\b/,
    /\bمش\b/,
    /\bعايز\b/,
    /\bعاوزه\b/,
    /\bليه\b/,
    /\bازاي\b/,
    /\bدلوقتي\b/,
    /\bلسه\b/,
    /\bكده\b/,
    /\bبتاع\b/,
    /\bجامد\b/,
    /\bمفيش\b/,
    /\bحاجة\b/,
    /\bأوي\b/,
    /\bاوي\b/,
    /\bيعني\b/,
    /\bعاوزين\b/,
    /\bهعمل\b/,
    /\bهنعمل\b/
  ];

  const gulf = [
    /\bوش\b/,
    /\bشلون\b/,
    /\bزين\b/,
    /\bمره\b/,
    /\bمرّة\b/,
    /\bالحين\b/,
    /\bدحين\b/,
    /\bابي\b/,
    /\bأبي\b/,
    /\bمو\b/,
    /\bوشلون\b/,
    /\bترى\b/,
    /\bيا\s?ولد\b/,
    /\bيا\s?رجال\b/
  ];

  const levant = [
    /\bشو\b/,
    /\bليش\b/,
    /\bهلق\b/,
    /\bهلأ\b/,
    /\bلسّا\b/,
    /\bلسه\b/,
    /\bكتير\b/,
    /\bكتير\b/,
    /\bيعطيك\b/,
    /\bتمام\b/,
    /\bبدي\b/,
    /\bبدو\b/,
    /\bمو\s?هيك\b/,
    /\bهيك\b/
  ];

  const maghreb = [
    /\bبزاف\b/,
    /\bواش\b/,
    /\bشنو\b/,
    /\bعلش\b/,
    /\bعلاش\b/,
    /\bدابا\b/,
    /\bهاد\b/,
    /\bغادي\b/,
    /\bيا\s?خي\b/,
    /\bخويا\b/
  ];

  const msa = [
    /\bإن\b/,
    /\bإنه\b/,
    /\bلذلك\b/,
    /\bبالنسبة\b/,
    /\bيجب\b/,
    /\bحيث\b/,
    /\bسوف\b/,
    /\bقد\b/,
    /\bلكن\b/,
    /\bلأن\b/,
    /\bمن\s+أجل\b/
  ];

  const egScore = countMatches(text, egypt);
  const gulfScore = countMatches(text, gulf);
  const levScore = countMatches(text, levant);
  const magScore = countMatches(text, maghreb);
  const msaScore = countMatches(text, msa);

  const scores = [
    { lang: "arabic-eg", score: egScore },
    { lang: "arabic-gulf", score: gulfScore },
    { lang: "arabic-levant", score: levScore },
    { lang: "arabic-maghreb", score: magScore },
    { lang: "arabic-msa", score: msaScore }
  ].sort((a, b) => b.score - a.score);

  const top = scores[0];

  if (!top || top.score === 0) {
    return { language: "arabic", confidence: 0.7 };
  }

  let conf = 0.75;
  if (top.score >= 2) conf = 0.85;
  if (top.score >= 3) conf = 0.9;
  if (top.score >= 5) conf = 0.95;

  return { language: top.lang, confidence: conf };
}

function detectEnglishVariant(t) {
  const text = normalizeText(t);
  if (!text) return { language: "english", confidence: 0.6 };

  const lower = text.toLowerCase();

  const american = [
    /\bcolor\b/,
    /\bfavorite\b/,
    /\bcenter\b/,
    /\borganize\b/,
    /\btruck\b/,
    /\bapartment\b/,
    /\bvacation\b/
  ];

  const british = [
    /\bcolour\b/,
    /\bfavourite\b/,
    /\bcentre\b/,
    /\borganise\b/,
    /\blorry\b/,
    /\bflat\b/,
    /\bholiday\b/,
    /\bcheers\b/
  ];

  const indian = [
    /\bkindly\b/,
    /\bplease do the needful\b/,
    /\brevert back\b/,
    /\bprepone\b/,
    /\bonwards\b/,
    /\bupdation\b/
  ];

  const african = [
    /\bhow far\b/,
    /\bwahala\b/,
    /\bno wahala\b/,
    /\bchop\b/,
    /\bdash\b/
  ];

  const canadian = [
    /\bcolour\b/,
    /\bcentre\b/,
    /\btoque\b/,
    /\bloonie\b/,
    /\btuque\b/
  ];

  const usScore = countMatches(lower, american);
  const ukScore = countMatches(lower, british);
  const inScore = countMatches(lower, indian);
  const afScore = countMatches(lower, african);
  const caScore = countMatches(lower, canadian);

  const scores = [
    { lang: "english-us", score: usScore },
    { lang: "english-uk", score: ukScore },
    { lang: "english-in", score: inScore },
    { lang: "english-af", score: afScore },
    { lang: "english-ca", score: caScore }
  ].sort((a, b) => b.score - a.score);

  const top = scores[0];

  if (!top || top.score === 0) {
    return { language: "english", confidence: 0.75 };
  }

  let conf = 0.75;
  if (top.score >= 2) conf = 0.85;
  if (top.score >= 3) conf = 0.9;

  return { language: top.lang, confidence: conf };
}

function detectLanguage(text) {
  if (!text) {
    return { language: "unknown", confidence: 0 };
  }

  const t = normalizeText(text);
  if (!t) {
    return { language: "unknown", confidence: 0 };
  }

  const hasAr = hasArabicChars(t);
  const hasEn = hasLatinChars(t);

  if (hasAr && !hasEn) {
    return detectArabicVariant(t);
  }

  if (!hasAr && hasEn) {
    return detectEnglishVariant(t);
  }

  if (hasAr && hasEn) {
    return { language: "mixed", confidence: 0.75 };
  }

  return { language: "unknown", confidence: 0.2 };
}

module.exports = {
  detectLanguage
};
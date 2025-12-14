function normalizeText(s) {
  return String(s || "").trim();
}

function hasAny(t, arr) {
  const x = normalizeText(t).toLowerCase();
  if (!x) return false;
  return arr.some((k) => x.includes(String(k).toLowerCase()));
}

function detectArabicDialect(text) {
  const t = normalizeText(text);

  const eg = [
    "انا", "إحنا", "احنا", "مش", "ليه", "عايز", "عاوزه", "عاوز", "عايزه",
    "عايزين", "عايزك", "بتاع", "بتاعة", "بتوعي", "دلوقتي", "لسه", "كده",
    "ازاي", "إزاي", "فين", "عاوزين", "مفيش", "تمام", "حلو", "جامد", "خالص",
    "أوي", "اوي", "بلاش", "هعمل", "هتعمل", "عاوز", "عايز", "مأثر", "ماثر"
  ];

  const levant = [
    "شو", "ليش", "هلأ", "هلق", "كتير", "كتير", "مو", "منيح", "تمام", "يعني",
    "بدي", "بدّي", "بدك", "بدّك", "بدنا", "بدكن", "لك", "لكن", "مو هيك"
  ];

  const gulf = [
    "شلون", "وشلون", "شنو", "وشنو", "وين", "هالحين", "الحين", "ياخي", "ياخي",
    "ترى", "ترى", "مايبغى", "ما أبي", "مابي", "أبي", "ابغى", "أبغى", "ودي",
    "ودي", "تونا", "توه", "زود", "وايد"
  ];

  const msa = [
    "إنني", "إني", "أريد", "أرغب", "سوف", "لن", "قد", "حيث", "لذلك", "بالتالي",
    "نظراً", "نظرًا", "بناءً", "بناء على", "أعتقد", "أظن", "من فضلك", "رجاءً"
  ];

  const score = {
    eg: 0,
    levant: 0,
    gulf: 0,
    msa: 0
  };

  for (const k of eg) if (hasAny(t, [k])) score.eg += 1;
  for (const k of levant) if (hasAny(t, [k])) score.levant += 1;
  for (const k of gulf) if (hasAny(t, [k])) score.gulf += 1;
  for (const k of msa) if (hasAny(t, [k])) score.msa += 1;

  const entries = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  const topKey = top[0];
  const topVal = top[1];

  if (topVal === 0) return { dialect: "arabic", confidence: 0.55 };

  if (topKey === "eg") return { dialect: "arabic-eg", confidence: 0.9 };
  if (topKey === "levant") return { dialect: "arabic-levant", confidence: 0.85 };
  if (topKey === "gulf") return { dialect: "arabic-gulf", confidence: 0.85 };
  if (topKey === "msa") return { dialect: "arabic-msa", confidence: 0.8 };

  return { dialect: "arabic", confidence: 0.6 };
}

function detectEnglishVariant(text) {
  const t = normalizeText(text).toLowerCase();

  const us = ["color", "favorite", "center", "organize", "analyze", "truck", "elevator"];
  const uk = ["colour", "favourite", "centre", "organise", "analyse", "lorry", "lift"];
  const india = ["kindly", "do the needful", "prepone", "revert back", "only", "itself"];
  const africa = ["how far", "dash", "wahala", "gist"];

  const score = { "english-us": 0, "english-uk": 0, "english-in": 0, "english-af": 0 };

  for (const k of us) if (t.includes(k)) score["english-us"] += 1;
  for (const k of uk) if (t.includes(k)) score["english-uk"] += 1;
  for (const k of india) if (t.includes(k)) score["english-in"] += 1;
  for (const k of africa) if (t.includes(k)) score["english-af"] += 1;

  const entries = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  if (!top || top[1] === 0) return { variant: "english", confidence: 0.7 };

  return { variant: top[0], confidence: Math.min(0.9, 0.7 + top[1] * 0.05) };
}

function detectLanguage(text) {
  const trimmed = normalizeText(text);
  if (!trimmed) {
    return { language: "unknown", confidence: 0 };
  }

  const arabicRange = /[\u0600-\u06FF]/;
  const englishRange = /[A-Za-z]/;

  const hasArabic = arabicRange.test(trimmed);
  const hasEnglish = englishRange.test(trimmed);

  if (hasArabic && !hasEnglish) {
    const d = detectArabicDialect(trimmed);
    return { language: d.dialect, confidence: d.confidence };
  }

  if (!hasArabic && hasEnglish) {
    const v = detectEnglishVariant(trimmed);
    return { language: v.variant, confidence: v.confidence };
  }

  if (hasArabic && hasEnglish) {
    return { language: "mixed", confidence: 0.75 };
  }

  return { language: "unknown", confidence: 0.2 };
}

module.exports = {
  detectLanguage
};

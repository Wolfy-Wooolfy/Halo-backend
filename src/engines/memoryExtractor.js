function nowISO() {
  return new Date().toISOString();
}

function normalizeText(s) {
  return String(s || "").trim();
}

function hasAny(text, arr) {
  const t = text.toLowerCase();
  return arr.some((k) => t.includes(k));
}

function detectLanguageHeuristic(text) {
  const t = normalizeText(text);
  const arabicChars = (t.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (t.match(/[A-Za-z]/g) || []).length;
  if (arabicChars === 0 && latinChars === 0) return "en";
  return arabicChars >= latinChars ? "ar" : "en";
}

function extractDecisionSignal(text, lang) {
  const t = normalizeText(text);
  if (!t) return null;

  let detected = false;

  if (lang === "ar") {
    detected = hasAny(t, [
      "قررت",
      "محتار",
      "متردد",
      "مش عارف أقرر",
      "مش عارف اقرر",
      "اختار",
      "أسيب",
      "اسيب",
      "أكمل",
      "اكمل",
      "أوافق",
      "اوافق"
    ]);
  } else {
    detected = hasAny(t, [
      "i decided",
      "i'm deciding",
      "can't decide",
      "choose",
      "should i",
      "stay or",
      "quit",
      "leave",
      "continue"
    ]);
  }

  if (!detected) return null;

  return {
    type: "signal",
    category: "decision_making",
    signal_code: "DECISION_MARKER"
  };
}

function extractConstraintSignal(text, lang) {
  const t = normalizeText(text);
  if (!t) return null;

  let detected = false;

  if (lang === "ar") {
    detected = hasAny(t, [
      "بس",
      "لكن",
      "عشان",
      "علشان",
      "بسبب",
      "مشكلة",
      "عائق",
      "مش قادر",
      "مش قادره",
      "مش عارف",
      "خايف",
      "قلقان"
    ]);
  } else {
    detected = hasAny(t, [
      "but",
      "because",
      "due to",
      "problem",
      "issue",
      "can't",
      "cannot",
      "afraid",
      "worried",
      "anxious"
    ]);
  }

  if (!detected) return null;

  return {
    type: "signal",
    category: "constraint",
    signal_code: "CONSTRAINT_MARKER"
  };
}

function extractContextSignal(contextHalo) {
  if (!contextHalo) return null;

  return {
    type: "context_log",
    category: contextHalo,
    signal_code: "CONTEXT_CLASSIFIED"
  };
}

function extractTopicSignal(text, lang) {
  const t = normalizeText(text);
  if (!t) return null;

  const topics = {
    work: {
      ar: ["شغل", "عمل", "مدير", "تاسك", "مشروع", "شركة", "كارير", "وظيفة", "استقالة", "زميل"],
      en: ["work", "job", "career", "boss", "task", "project", "company", "resign", "colleague"]
    },
    relationships: {
      ar: ["علاقة", "شريكي", "خطيب", "زوج", "صاحب", "أهلي", "بيت", "مشاعر", "حب", "فراق"],
      en: ["relationship", "partner", "spouse", "friend", "family", "feeling", "love", "breakup"]
    },
    self: {
      ar: ["نفسي", "تطوير", "جيم", "صحة", "نوم", "اكتئاب", "قلق", "تركيز", "عادة"],
      en: ["myself", "self", "gym", "health", "sleep", "depression", "anxiety", "focus", "habit"]
    }
  };

  const target = lang === "ar" ? "ar" : "en";

  if (hasAny(t, topics.work[target])) {
    return { type: "signal", category: "topic", signal_code: "TOPIC_WORK" };
  }

  if (hasAny(t, topics.relationships[target])) {
    return { type: "signal", category: "topic", signal_code: "TOPIC_RELATIONSHIPS" };
  }

  if (hasAny(t, topics.self[target])) {
    return { type: "signal", category: "topic", signal_code: "TOPIC_SELF" };
  }

  return null;
}

function buildObject(base, lang, tags) {
  return {
    id: `mem_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type: base.type,
    category: base.category || "general",
    signal_code: base.signal_code,
    ts: nowISO(),
    tags: Array.from(new Set([...(Array.isArray(tags) ? tags : []), lang]))
  };
}

function extractMemoryObjects(payload) {
  const message = normalizeText(payload && payload.message);
  const contextHalo = normalizeText(payload && payload.contextHalo) || "general";
  const lang = normalizeText(payload && payload.language) || detectLanguageHeuristic(message);

  if (!message) {
    return { objects: [], extracted: false };
  }

  const objects = [];

  const contextSignal = extractContextSignal(contextHalo);
  if (contextSignal) {
    objects.push(buildObject(contextSignal, lang, ["context"]));
  }

  const topicSignal = extractTopicSignal(message, lang);
  if (topicSignal) {
    objects.push(buildObject(topicSignal, lang, ["topic_signal"]));
  }

  const decisionSignal = extractDecisionSignal(message, lang);
  if (decisionSignal) {
    objects.push(buildObject(decisionSignal, lang, ["behavior_signal"]));
  }

  const constraintSignal = extractConstraintSignal(message, lang);
  if (constraintSignal) {
    objects.push(buildObject(constraintSignal, lang, ["behavior_signal"]));
  }

  return {
    objects,
    extracted: objects.length > 0
  };
}

module.exports = {
  extractMemoryObjects
};

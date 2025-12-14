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

function extractPersonCandidatesAr(text) {
  const t = normalizeText(text);
  const matches = t.match(/(?:اسمه|اسمها|اسمي|الشخص ده|الراجل ده|الست دي|الواد ده|البنت دي)\s+([^\s،.!?]{2,30})/g);
  if (!matches) return [];
  const out = [];
  for (const m of matches) {
    const name = m.replace(/^(اسمه|اسمها|اسمي|الشخص ده|الراجل ده|الست دي|الواد ده|البنت دي)\s+/, "").trim();
    if (name && name.length >= 2) out.push(name);
  }
  return Array.from(new Set(out));
}

function extractPersonCandidatesEn(text) {
  const t = normalizeText(text);
  const matches = t.match(/(?:my name is|his name is|her name is|this person is)\s+([A-Za-z][A-Za-z\s'-]{1,40})/gi);
  if (!matches) return [];
  const out = [];
  for (const m of matches) {
    const name = m.replace(/^(my name is|his name is|her name is|this person is)\s+/i, "").trim();
    if (name && name.length >= 2) out.push(name);
  }
  return Array.from(new Set(out));
}

function extractDecision(text, lang) {
  const t = normalizeText(text);
  if (!t) return null;

  if (lang === "ar") {
    const decisionMarkers = ["قررت", "محتار", "متردد", "مش عارف أقرر", "مش عارف اقرر", "اختار", "أسيب", "اسيب", "أكمل", "اكمل", "أوافق", "اوافق"];
    if (!hasAny(t, decisionMarkers)) return null;
    return {
      type: "Decision",
      summary: t.length > 140 ? t.slice(0, 140).trim() : t
    };
  } else {
    const decisionMarkers = ["i decided", "i'm deciding", "can't decide", "choose", "should i", "stay or", "quit", "leave", "continue"];
    if (!hasAny(t, decisionMarkers)) return null;
    return {
      type: "Decision",
      summary: t.length > 160 ? t.slice(0, 160).trim() : t
    };
  }
}

function extractConstraint(text, lang) {
  const t = normalizeText(text);
  if (!t) return null;

  if (lang === "ar") {
    const markers = ["بس", "لكن", "عشان", "علشان", "بسبب", "مشكلة", "عائق", "مش قادر", "مش قادره", "مش عارف", "خايف", "قلقان"];
    if (!hasAny(t, markers)) return null;
    return {
      type: "Constraint",
      summary: t.length > 140 ? t.slice(0, 140).trim() : t
    };
  } else {
    const markers = ["but", "because", "due to", "problem", "issue", "can't", "cannot", "afraid", "worried", "anxious"];
    if (!hasAny(t.toLowerCase(), markers)) return null;
    return {
      type: "Constraint",
      summary: t.length > 160 ? t.slice(0, 160).trim() : t
    };
  }
}

function extractThread(text, contextHalo, lang) {
  const t = normalizeText(text);
  if (!t) return null;

  if (contextHalo === "decision") {
    return {
      type: "Thread",
      summary: lang === "ar" ? "قرار قيد التفكير" : "Decision in progress"
    };
  }

  if (contextHalo === "emotional_discomfort") {
    return {
      type: "Thread",
      summary: lang === "ar" ? "ضغط/ثِقل نفسي اليوم" : "Stress/weight today"
    };
  }

  const generic = t.length > 60 ? t.slice(0, 60).trim() : t;
  return {
    type: "Thread",
    summary: lang === "ar" ? `موضوع: ${generic}` : `Topic: ${generic}`
  };
}

function buildObject(base, lang, extras) {
  const obj = {
    id: `mo_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type: base.type,
    summary: base.summary,
    ts: nowISO(),
    tags: [],
    links: []
  };

  if (extras && Array.isArray(extras.tags)) obj.tags = extras.tags;
  if (extras && Array.isArray(extras.links)) obj.links = extras.links;

  if (lang === "ar") obj.tags = Array.from(new Set(obj.tags.concat(["ar"])));
  else obj.tags = Array.from(new Set(obj.tags.concat(["en"])));

  return obj;
}

function extractMemoryObjects(payload) {
  const message = normalizeText(payload && payload.message);
  const contextHalo = normalizeText(payload && payload.contextHalo) || "general";
  const lang = normalizeText(payload && payload.language) || detectLanguageHeuristic(message);

  if (!message) return { objects: [], extracted: false };

  const objects = [];
  const thread = extractThread(message, contextHalo, lang);
  if (thread) objects.push(buildObject(thread, lang, { tags: ["thread"] }));

  const decision = extractDecision(message, lang);
  if (decision) objects.push(buildObject(decision, lang, { tags: ["decision"], links: thread ? [objects[0].id] : [] }));

  const constraint = extractConstraint(message, lang);
  if (constraint) objects.push(buildObject(constraint, lang, { tags: ["constraint"], links: objects.length ? [objects[0].id] : [] }));

  const persons = lang === "ar" ? extractPersonCandidatesAr(message) : extractPersonCandidatesEn(message);
  for (const p of persons) {
    objects.push(buildObject({ type: "Person", summary: p }, lang, { tags: ["person"] }));
  }

  const unique = [];
  const seen = new Set();
  for (const o of objects) {
    const key = `${o.type}::${o.summary}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(o);
    }
  }

  return { objects: unique, extracted: unique.length > 0 };
}

module.exports = {
  extractMemoryObjects
};

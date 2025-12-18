const { normalizeText } = require("../utils/helpers");

function isExtremeRisk(safety) {
  if (!safety) return false;
  if (safety.category === "self_harm") return true;
  if (typeof safety.level === "string" && safety.level.toLowerCase() === "extreme") return true;
  if (Array.isArray(safety.matchedKeywords)) {
    const joined = safety.matchedKeywords.join(" ").toLowerCase();
    if (joined.includes("suicide")) return true;
    if (joined.includes("kill myself")) return true;
    if (joined.includes("انتحار")) return true;
    if (joined.includes("أنتحر")) return true;
  }
  return false;
}

function isLlmConfigured() {
  const url = process.env.LLM_API_URL;
  const key = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  return !!(url && key && model);
}

function hasAny(text, arr) {
  const t = normalizeText(text).toLowerCase();
  if (!t) return false;
  return arr.some((k) => t.includes(String(k).toLowerCase()));
}

function isArabicFamily(language) {
  const lang = String(language || "").toLowerCase();
  if (!lang) return false;
  if (lang === "ar") return true;
  if (lang.startsWith("ar-")) return true;
  if (lang.startsWith("arabic")) return true;
  if (lang.includes("arabic")) return true;
  if (lang.includes("ar")) return true;
  return false;
}

function isEnglishFamily(language) {
  const lang = String(language || "").toLowerCase();
  if (!lang) return false;
  if (lang === "en") return true;
  if (lang.startsWith("en-")) return true;
  if (lang.startsWith("english")) return true;
  if (lang.includes("english")) return true;
  if (lang.includes("en")) return true;
  return false;
}

function isQuestionMessage(message, language) {
  const t = normalizeText(message);
  if (!t) return false;

  if (t.includes("?") || t.includes("؟")) return true;

  const arStarters = [
    "ايه",
    "إيه",
    "ليه",
    "لِيه",
    "ازاي",
    "إزاي",
    "امتى",
    "إمتى",
    "فين",
    "مين",
    "هل",
    "شو",
    "ليش",
    "وين",
    "قديش",
    "متى",
    "كيف",
    "لماذا"
  ];

  const enStarters = [
    "what",
    "why",
    "how",
    "when",
    "where",
    "who",
    "which",
    "can you",
    "could you",
    "should i",
    "do i",
    "is it",
    "are you"
  ];

  const lower = t.toLowerCase();

  if (isArabicFamily(language)) {
    return arStarters.some((w) => t.startsWith(w));
  }

  if (isEnglishFamily(language)) {
    return enStarters.some((w) => lower.startsWith(w));
  }

  return false;
}

function hasHesitationOrStressMarkers(message, language) {
  const t = normalizeText(message);

  const arMarkers = [
    "متوتر",
    "قلقان",
    "خايف",
    "مش قادر",
    "مش عارف",
    "مش عارف أنام",
    "مش عارف انام",
    "مضغوط",
    "ضغط",
    "تعبان",
    "مرهق",
    "حاسس",
    "مأثر",
    "ماثر",
    "مش مركز",
    "مش قادر اركز",
    "مش قادر أركز",
    "مش بنام",
    "أرق",
    "ارق",
    "توتر"
  ];

  const enMarkers = [
    "anxious",
    "stressed",
    "worried",
    "can't sleep",
    "cannot sleep",
    "insomnia",
    "tired",
    "overwhelmed",
    "i can't",
    "i cannot",
    "i don't know",
    "i’m not sure",
    "affecting my work"
  ];

  if (isArabicFamily(language)) return hasAny(t, arMarkers);
  return hasAny(t, enMarkers);
}

function hasTopicMarkers(message, language) {
  const t = normalizeText(message);

  const workAr = ["شغل", "عمل", "وظيفة", "شركة", "مدير", "مشروع", "تاسك", "كارير", "مأثر على شغلي", "ماثر على شغلي"];
  const relAr = ["زوج", "مراتي", "علاقة", "خطيب", "خطيبة", "أهلي", "صاحب", "صديقة", "فراق", "مشاعر", "بيت"];
  const selfAr = ["نوم", "صحة", "جيم", "تركيز", "عادة", "قلق", "توتر", "اكتئاب"];

  const workEn = ["work", "job", "career", "boss", "company", "project", "task"];
  const relEn = ["relationship", "partner", "spouse", "family", "friend", "breakup", "love"];
  const selfEn = ["sleep", "health", "focus", "habit", "anxiety", "stress", "depression"];

  if (isArabicFamily(language)) {
    return hasAny(t, workAr) || hasAny(t, relAr) || hasAny(t, selfAr);
  }

  return hasAny(t, workEn) || hasAny(t, relEn) || hasAny(t, selfEn);
}

function decideRoute(options) {
  const message = options && (options.normalizedMessage || options.message || "");
  const messageLength = typeof message === "string" ? message.trim().length : 0;

  const contextHalo = options && options.context_halo ? options.context_halo : "general";
  const safety = options && options.safety ? options.safety : {};
  const language =
    (options && (options.language || (options.meta && options.meta.language))) || "en";

  const llmAvailable = isLlmConfigured();

  let mode = "balanced";
  let useLLM = true;
  let maxTokens = 120;
  let temperature = 0.4;
  let reason = "default balanced routing";

  if (isExtremeRisk(safety)) {
    return {
      mode: "fast",
      useLLM: false,
      maxTokens: 60,
      temperature: 0.1,
      reason: "extreme_risk → fast mode with templates (no LLM)"
    };
  }

  if (safety && safety.flag === "high_risk") {
    mode = "balanced";
    useLLM = true;
    maxTokens = 100;
    temperature = 0.3;
    reason = "high_risk (non-extreme) → balanced LLM with tight safety";
  } else if (safety && safety.flag === "high_stress") {
    mode = "balanced";
    useLLM = true;
    maxTokens = 120;
    temperature = 0.35;
    reason = "high_stress → balanced LLM with grounding tone";
  } else if (contextHalo === "emotional_discomfort") {
    mode = "balanced";
    useLLM = true;
    maxTokens = 120;
    temperature = 0.4;
    reason = "emotional_discomfort → balanced LLM for nuanced tone";
  } else if (contextHalo === "decision" || contextHalo === "decision_making") {
    mode = "balanced";
    useLLM = true;
    maxTokens = 120;
    temperature = 0.4;
    reason = "decision_context → balanced LLM for clarity";
  } else {
    const markerStress = hasHesitationOrStressMarkers(message, language);
    const markerTopic = hasTopicMarkers(message, language);
    const isQuestion = isQuestionMessage(message, language);

    if ((markerStress || markerTopic) && messageLength >= 20) {
      mode = "balanced";
      useLLM = true;
      maxTokens = 120;
      temperature = 0.4;
      reason = "markers_detected (stress/topic) → balanced LLM even if message is short";
    } else if (messageLength > 0 && messageLength <= 30 && !isQuestion) {
      mode = "fast";
      useLLM = false;
      maxTokens = 60;
      temperature = 0.3;
      reason = "very_short_general_message (no question) → fast mode without LLM";
    } else if (messageLength > 200) {
      mode = "balanced";
      useLLM = true;
      maxTokens = 160;
      temperature = 0.4;
      reason = "long_message → balanced LLM with higher token limit";
    } else {
      mode = "balanced";
      useLLM = true;
      maxTokens = 120;
      temperature = 0.4;
      reason = isQuestion ? "short_question → balanced LLM" : "general_message → balanced LLM";
    }
  }

  if (!llmAvailable) {
    useLLM = false;
    reason += " | LLM not configured → fallback to rule-based reasoning";
  }

  return {
    mode,
    useLLM,
    maxTokens,
    temperature,
    reason
  };
}

module.exports = {
  decideRoute
};
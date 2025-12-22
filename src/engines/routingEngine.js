const { resolveLanguageCode } = require("./languageDetector");
const { normalizeMessage } = require("./messageNormalizer");
const KEYWORDS = require("../utils/constants");

function isExtremeRisk(safety) {
  if (!safety) return false;
  
  // 1. Direct Category Match (Authoritative from SafetyGuard)
  if (safety.category === "self_harm") return true;
  
  // 2. Explicit Level Match (Future proofing)
  if (typeof safety.level === "string" && safety.level.toLowerCase() === "extreme") return true;
  
  // 3. Fallback: Pre-emptive check for critical keywords (Defense in Depth)
  // Check if keywords exist in safety object to avoid regex redundancy
  if (safety.matchedKeywords && Array.isArray(safety.matchedKeywords)) {
     // This logic is handled by safetyGuard, but we keep the structure ready if needed.
  }
  
  return false;
}

function isLlmConfigured() {
  const url = process.env.LLM_API_URL;
  const key = process.env.LLM_API_KEY;
  // Per Entry #45: Model is optional (defaults to gpt-4o in llmClient), so we don't block routing if missing.
  return !!(url && key);
}

function hasAny(text, arr) {
  const t = normalizeMessage(text).toLowerCase();
  if (!t) return false;
  // Ensure arr is valid
  if (!Array.isArray(arr)) return false;
  return arr.some((k) => t.includes(String(k).toLowerCase()));
}

function isQuestionMessage(message, language) {
  const t = normalizeMessage(message);
  if (!t) return false;

  if (t.includes("?") || t.includes("؟")) return true;

  const lower = t.toLowerCase();
  const langCode = resolveLanguageCode(language);

  if (langCode === "ar") {
    return KEYWORDS.QUESTIONS.ar.some((w) => t.startsWith(w));
  }

  // Default to English logic for 'en' or others
  return KEYWORDS.QUESTIONS.en.some((w) => lower.startsWith(w));
}

function hasHesitationOrStressMarkers(message, language) {
  const t = normalizeMessage(message);
  const langCode = resolveLanguageCode(language);

  if (langCode === "ar") return hasAny(t, KEYWORDS.STRESS.ar);
  return hasAny(t, KEYWORDS.STRESS.en);
}

function hasTopicMarkers(message, language) {
  const t = normalizeMessage(message);
  const langCode = resolveLanguageCode(language);

  // Use Centralized Constants
  const topics = KEYWORDS.TOPICS;

  if (langCode === "ar") {
    return hasAny(t, topics.WORK.ar) || hasAny(t, topics.RELATIONSHIPS.ar) || hasAny(t, topics.SELF.ar);
  }
  return hasAny(t, topics.WORK.en) || hasAny(t, topics.RELATIONSHIPS.en) || hasAny(t, topics.SELF.en);
}

function decideRoute(options) {
  const message = options && (options.normalizedMessage || options.message || "");
  const messageLength = typeof message === "string" ? message.trim().length : 0;
  const contextHalo = options && options.context_halo ? options.context_halo : "general";
  const safety = options && options.safety ? options.safety : {};
  const language = (options && (options.language || (options.meta && options.meta.language))) || "en";

  const llmAvailable = isLlmConfigured();

  let mode = "balanced";
  let useLLM = true;
  let maxTokens = 120;
  let temperature = 0.4;
  let reason = "default balanced routing";

  // 1. SAFETY OVERRIDE (Extreme Risk -> NO LLM)
  // Defense in Depth: Explicitly catch Self-Harm / Harm Others here
  // Updated to include medical_emergency and harm_others as Per Entry #46
  if (
    isExtremeRisk(safety) || 
    safety.category === "harm_others" || 
    safety.category === "medical_emergency"
  ) {
    return {
      mode: "fast",
      useLLM: false,
      maxTokens: 60,
      temperature: 0.1,
      reason: "extreme_risk/critical_safety → fast mode with templates (no LLM)"
    };
  }

  // 2. High Risk / High Stress (Non-Extreme)
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
    reason = "emotional_discomfort → balanced LLM for empathy";
  } else if (contextHalo === "decision") {
    mode = "balanced";
    useLLM = true;
    maxTokens = 150;
    temperature = 0.3;
    reason = "decision_making → balanced LLM for clarity";
  } else {
    // 3. General Conversation
    // Optimization: Very short general messages don't need LLM cost if generic
    const isQuestion = isQuestionMessage(message, language);
    const hasStress = hasHesitationOrStressMarkers(message, language);
    const hasTopic = hasTopicMarkers(message, language);

    if (!isQuestion && !hasStress && !hasTopic && messageLength < 15) {
      mode = "fast";
      useLLM = false; 
      // NOTE: Client might override this to 'true' if we want chatty persona always.
      // For MVP cost-saving: false.
      reason = "short_general_message → fast mode without LLM";
    } else if (messageLength > 200) {
      mode = "balanced";
      useLLM = true;
      maxTokens = 200;
      temperature = 0.5;
      reason = "long_message → balanced LLM with higher token limit";
    } else {
      mode = "balanced";
      useLLM = true;
      maxTokens = 120;
      temperature = 0.4;
      reason = isQuestion ? "short_question → balanced LLM" : "general_message → balanced LLM";
    }
  }

  // Final Circuit Breaker: If LLM is not configured, force fallback
  if (!llmAvailable) {
    useLLM = false;
    reason += " (LLM not configured → fallback to rule-based reasoning)";
  }

  return {
    mode,
    useLLM,
    maxTokens,
    temperature,
    reason
  };
}

module.exports = { decideRoute, isLlmConfigured };
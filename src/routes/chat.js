const express = require("express");
const router = express.Router();

const safetyGuard = require("../engines/safetyGuard");
const reasoningEngine = require("../engines/reasoningEngine");
const { getUserMemory, updateUserMemory } = require("../engines/memoryEngine");

const messageNormalizer = require("../engines/messageNormalizer");
const languageDetector = require("../engines/languageDetector");
const contextClassifier = require("../engines/contextClassifier");

const { decideRoute } = require("../engines/routingEngine");

function getNormalizeFn() {
  if (typeof messageNormalizer === "function") return messageNormalizer;
  if (messageNormalizer && typeof messageNormalizer.normalize === "function")
    return messageNormalizer.normalize;
  if (messageNormalizer && typeof messageNormalizer.normalizeMessage === "function")
    return messageNormalizer.normalizeMessage;
  return function (text) {
    return typeof text === "string" ? text : "";
  };
}

function getLanguageDetectorFn() {
  if (typeof languageDetector === "function") return languageDetector;
  if (languageDetector && typeof languageDetector.detect === "function")
    return languageDetector.detect;
  if (languageDetector && typeof languageDetector.detectLanguage === "function")
    return languageDetector.detectLanguage;
  return function () {
    return { language: "mixed", confidence: 0 };
  };
}

function getContextClassifierFn() {
  if (typeof contextClassifier === "function") return contextClassifier;
  if (contextClassifier && typeof contextClassifier.classifyMessage === "function")
    return contextClassifier.classifyMessage;
  if (contextClassifier && typeof contextClassifier.classify === "function")
    return contextClassifier.classify;
  if (contextClassifier && typeof contextClassifier.classifyContext === "function")
    return contextClassifier.classifyContext;
  return function () {
    return { category: "low_stress", isHighStress: false, messageLength: 0 };
  };
}

const normalize = getNormalizeFn();
const detectLang = getLanguageDetectorFn();
const classifyCtx = getContextClassifierFn();

function resolveLanguageCode(languageInfo) {
  if (!languageInfo) return "en";

  if (typeof languageInfo === "string") {
    const lowered = languageInfo.toLowerCase();
    if (lowered === "arabic" || lowered === "ar") {
      return "ar";
    }
    return "en";
  }

  const label = String(languageInfo.language || "").toLowerCase();

  if (label === "arabic" || label === "ar") return "ar";

  return "en";
}

function mapContextForHalo(category) {
  if (!category) return "general";

  const c = String(category).toLowerCase();

  if (c === "emotional_discomfort") return "emotional_discomfort";
  if (c === "decision_making") return "decision";
  if (c === "planning") return "planning";
  if (c === "high_stress") return "emotional_discomfort";
  if (c === "casual_conversation") return "general";
  if (c === "low_stress") return "general";
  if (c === "unclear") return "general";

  return "general";
}

router.post("/chat", async (req, res) => {
  try {
    const body = req.body || {};
    const userId = body.user_id || "anonymous";
    const rawMessage = body.message || "";

    const normalizedMessage = normalize(rawMessage);
    const languageInfo = detectLang(normalizedMessage);
    const rawContextInfo = classifyCtx(normalizedMessage);
    const safetyInfo = safetyGuard(normalizedMessage, rawContextInfo);

    const langCode = resolveLanguageCode(languageInfo);
    const haloContext = mapContextForHalo(rawContextInfo.category);
    const previousMemory = getUserMemory(userId);

    const routeDecision = decideRoute({
      normalizedMessage,
      message: normalizedMessage,
      language: langCode,
      context_halo: haloContext,
      context_raw: rawContextInfo,
      safety: safetyInfo,
      memory_snapshot: previousMemory
    });

    const halo = await reasoningEngine.generateResponse({
      message: normalizedMessage,
      language: langCode,
      context: haloContext,
      safety: safetyInfo,
      memory: previousMemory || {},
      lastReasoning:
        previousMemory && previousMemory.lastReasoning
          ? previousMemory.lastReasoning
          : null,
      route: routeDecision
    });

    const memoryResult = updateUserMemory({
      userId,
      normalizedMessage,
      context: haloContext,
      language: langCode,
      safetyFlag: safetyInfo.flag,
      reasoning: halo
    });

    return res.status(200).json({
      ok: true,
      user_id: userId,
      reflection: halo.reflection,
      question: halo.question,
      micro_step: halo.micro_step,
      safety_flag: safetyInfo.flag,
      memory_update: halo.memory_update,
      meta: {
        language: languageInfo,
        context_raw: rawContextInfo,
        context_halo: haloContext,
        safety: safetyInfo
      },
      memory_snapshot: memoryResult.memory,
      memory_delta: memoryResult.delta,
      previous_memory: previousMemory,
      routing: routeDecision
    });
  } catch (err) {
    console.error("HALO /chat error:", err);
    return res.status(500).json({
      ok: false,
      error: "internal_error"
    });
  }
});

module.exports = router;

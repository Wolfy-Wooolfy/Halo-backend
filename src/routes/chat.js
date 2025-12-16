const express = require("express");
const router = express.Router();

const safetyGuard = require("../engines/safetyGuard");
const reasoningEngine = require("../engines/reasoningEngine");
const { getUserMemory, updateUserMemory } = require("../engines/memoryEngine");

const messageNormalizer = require("../engines/messageNormalizer");
const languageDetector = require("../engines/languageDetector");
const contextClassifier = require("../engines/contextClassifier");

const { decideRoute } = require("../engines/routingEngine");
const { evaluatePolicy } = require("../engines/policyEngine");

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
    if (lowered === "ar") return "ar";
    if (lowered.startsWith("arabic")) return "ar";
    if (lowered === "en") return "en";
    if (lowered.startsWith("english")) return "en";
    return "en";
  }

  const label = String(languageInfo.language || "").toLowerCase();

  if (label === "ar") return "ar";
  if (label.startsWith("arabic")) return "ar";

  if (label === "en") return "en";
  if (label.startsWith("english")) return "en";

  return "en";
}

function extractLanguageVariant(languageInfo) {
  if (!languageInfo) return "en";
  if (typeof languageInfo === "string") return languageInfo;
  if (languageInfo && typeof languageInfo.language === "string") return languageInfo.language;
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
    const languageVariantRaw = extractLanguageVariant(languageInfo);
    const languageVariant = langCode === "ar" ? "arabic-eg" : languageVariantRaw;
    const haloContext = mapContextForHalo(rawContextInfo.category);

    const previousMemory = getUserMemory(userId);

    const routeDecision = decideRoute({
      normalizedMessage,
      message: normalizedMessage,
      language: languageVariant,
      language_code: langCode,
      context_halo: haloContext,
      context_raw: rawContextInfo,
      safety: safetyInfo,
      memory_snapshot: previousMemory
    });

    const policyResult = evaluatePolicy({
      route: routeDecision,
      safety: safetyInfo,
      context_halo: haloContext,
      context_raw: rawContextInfo,
      memory_snapshot: previousMemory,
      language_code: langCode,
      language_variant: languageVariant,
      message: normalizedMessage
    });

    const enforcedRoute = policyResult && policyResult.route ? policyResult.route : routeDecision;
    const policy = policyResult && policyResult.policy ? policyResult.policy : { applied: false, rulesTriggered: [], changes: [], final: null };

    const halo = await reasoningEngine.generateResponse({
      message: normalizedMessage,
      language: languageVariant,
      language_code: langCode,
      context: haloContext,
      safety: safetyInfo,
      memory: previousMemory || {},
      lastReasoning:
        previousMemory && previousMemory.lastReasoning
          ? previousMemory.lastReasoning
          : null,
      route: enforcedRoute,
      policy
    });

    if (process.env.HALO_DEBUG === "1") {
      console.log("HALO_ENGINE:", halo && halo.engine ? halo.engine : null);
      console.log("HALO_ROUTE_RAW:", routeDecision);
      console.log("HALO_ROUTE_ENFORCED:", enforcedRoute);
      console.log("HALO_POLICY:", policy);
    }

    const memoryResult = updateUserMemory({
      userId,
      message: normalizedMessage,
      context: haloContext,
      language: langCode,
      language_variant: languageVariant,
      safetyFlag: safetyInfo.flag,
      reasoning: halo
    });

    return res.status(200).json({
      ok: true,
      user_id: userId,
      reflection: halo.reflection,
      question: halo.question,
      micro_step: halo.micro_step,
      safety_flag: halo.safety_flag || safetyInfo.flag,
      engine: halo.engine || { source: "missing", model: "unknown" },
      memory_update: halo.memory_update,
      meta: {
        language: languageInfo,
        language_variant_used: languageVariant,
        context_raw: rawContextInfo,
        context_halo: haloContext,
        safety: safetyInfo
      },
      memory_snapshot: memoryResult.memory,
      memory_delta: memoryResult.delta,
      previous_memory: previousMemory,
      routing: enforcedRoute,
      policy,
      routing_raw: routeDecision
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

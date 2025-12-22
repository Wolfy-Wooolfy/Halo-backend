const safetyGuard = require("../engines/safetyGuard");
const reasoningEngine = require("../engines/reasoningEngine");
const { getUserMemory, updateUserMemory } = require("../engines/memoryEngine");
const { normalizeMessage } = require("../engines/messageNormalizer");
const { detectLanguage, resolveLanguageCode, extractLanguageVariant } = require("../engines/languageDetector");
const { classifyMessage } = require("../engines/contextClassifier");
const { decideRoute } = require("../engines/routingEngine");
const { evaluatePolicy } = require("../engines/policyEngine");

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

function debugLog(label, value) {
  if (process.env.HALO_DEBUG === "1") {
    console.log(label, value);
  }
}

function normalizePolicy(policy) {
  const p = policy && typeof policy === "object" ? policy : {};
  const finalObj = p.final && typeof p.final === "object" ? p.final : {};
  return {
    applied: typeof p.applied === "boolean" ? p.applied : false,
    rulesTriggered: Array.isArray(p.rulesTriggered) ? p.rulesTriggered : [],
    changes: Array.isArray(p.changes) ? p.changes : [],
    final: {
      mode: typeof finalObj.mode === "string" && finalObj.mode ? finalObj.mode : "balanced",
      useLLM: typeof finalObj.useLLM === "boolean" ? finalObj.useLLM : true,
      maxTokens: finalObj.maxTokens ?? 150,
      temperature: finalObj.temperature ?? 0.5,
      model: finalObj.model ?? null
    }
  };
}

function getDebugToken(req, body) {
  const headerToken = (req && req.headers && (req.headers["x-halo-debug-token"] || req.headers["X-Halo-Debug-Token"])) || "";
  const bodyToken = body && body.debug_token ? body.debug_token : "";
  return String(bodyToken || headerToken || "");
}

function shouldExposeDebug(req, body) {
  if (process.env.HALO_DEBUG !== "1") return false;
  const required = String(process.env.HALO_DEBUG_TOKEN || "").trim();
  if (!required) return true;
  const provided = getDebugToken(req, body);
  return provided === required;
}

function buildInternalErrorFallback(langCode) {
  const isAr = langCode === "ar";
  return {
    reflection: isAr ? "واضح إن في مشكلة تقنية حصلت دلوقتي، بس خلّينا ما نخليش ده يوقفك." : "Looks like a technical issue happened, but let’s not let it stop you.",
    question: isAr ? "تقدر تقولّي بجملة واحدة: إيه أهم حاجة عايز تمشي فيها خطوة صغيرة دلوقتي؟" : "In one sentence: what’s the single thing you want to take a tiny step on right now?",
    micro_step: isAr ? "اكتب سطر واحد يصف المشكلة/الهدف، من غير تفاصيل." : "Write one line describing the goal/problem—no extra details.",
    safety_flag: "none",
    memory_update: {
      last_topic: "",
      last_message_preview: "",
      last_safety_flag: "none",
      mood_delta: "",
      hesitation_signal: false,
      last_context: "general",
      last_signal_codes: []
    },
    engine: { source: "error_fallback", model: "none" }
  };
}

async function handleChat(req, res) {
  let userId = "anonymous";
  let rawMessage = "";
  let normalizedMessage = "";
  let languageInfo = { language: "mixed", confidence: 0 };
  let rawContextInfo = { category: "low_stress", isHighStress: false, messageLength: 0 };
  let safetyInfo = { isHighRisk: false, category: "none", level: "low", flag: "none" };
  let langCode = "en";
  let languageVariant = "en";
  let haloContext = "general";
  let previousMemory = {};
  let enforcedRoute = { mode: "fast", useLLM: false, maxTokens: 60, temperature: 0.2, reason: "default_fallback" };
  let policy = {
    applied: true,
    rulesTriggered: ["internal_error_fallback"],
    changes: ["force_templates"],
    final: { mode: "fast", useLLM: false, maxTokens: 60, temperature: 0.2, model: null }
  };

  try {
    const body = req.body || {};
    userId = body.user_id || body.userId || "anonymous";
    
    rawMessage = body.message || "";
    normalizedMessage = normalizeMessage(rawMessage);

    languageInfo = detectLanguage(normalizedMessage);
    rawContextInfo = classifyMessage(normalizedMessage);
    safetyInfo = safetyGuard(normalizedMessage, rawContextInfo);

    langCode = resolveLanguageCode(languageInfo);
    languageVariant = extractLanguageVariant(languageInfo);
    haloContext = mapContextForHalo(rawContextInfo.category);

    previousMemory = getUserMemory(userId);

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

    const evaluated = evaluatePolicy({
      route: routeDecision,
      safety: safetyInfo,
      context_halo: haloContext
    });

    enforcedRoute = evaluated && evaluated.route ? evaluated.route : routeDecision;
    policy = normalizePolicy(evaluated && evaluated.policy ? evaluated.policy : null);

    const halo = await reasoningEngine.generateResponse({
      message: normalizedMessage,
      language: languageVariant,
      language_code: langCode,
      context: haloContext,
      safety: safetyInfo,
      memory: previousMemory || {},
      lastReasoning: previousMemory && previousMemory.lastReasoning ? previousMemory.lastReasoning : null,
      route: enforcedRoute,
      policy
    });

    debugLog("HALO_ENGINE:", halo && halo.engine ? halo.engine : null);
    debugLog("HALO_ROUTE_ENFORCED:", enforcedRoute);
    debugLog("HALO_POLICY:", policy);

    const memoryResult = updateUserMemory({
      userId,
      message: normalizedMessage,
      context: haloContext,
      language: langCode,
      language_variant: languageVariant,
      safetyFlag: safetyInfo.flag,
      reasoning: halo
    });

    const responseBody = {
      ok: true,
      user_id: userId,
      reflection: halo.reflection,
      question: halo.question,
      micro_step: halo.micro_step,
      safety_flag: halo.safety_flag || safetyInfo.flag,
      engine: halo.engine || { source: "missing", model: "unknown" },
      routing: enforcedRoute,
      policy,
      memory_update: halo.memory_update,
      meta: {
        language: languageInfo,
        language_variant_used: languageVariant,
        context_raw: rawContextInfo,
        context_halo: haloContext,
        safety: safetyInfo
      }
    };

    if (shouldExposeDebug(req, body)) {
      responseBody.memory_snapshot = memoryResult.memory;
      responseBody.memory_delta = memoryResult.delta;
      responseBody.previous_memory = previousMemory;
    }

    return res.status(200).json(responseBody);
  } catch (err) {
    console.error("HALO /chat error:", err);

    const body = req.body || {};
    const fallbackHalo = buildInternalErrorFallback(langCode);

    const responseBody = {
      ok: false,
      user_id: userId,
      reflection: fallbackHalo.reflection,
      question: fallbackHalo.question,
      micro_step: fallbackHalo.micro_step,
      safety_flag: fallbackHalo.safety_flag,
      engine: fallbackHalo.engine,
      routing: enforcedRoute && enforcedRoute.mode ? enforcedRoute : { mode: "fast", useLLM: false, maxTokens: 60, temperature: 0.2, reason: "internal_error_fallback" },
      policy,
      memory_update: fallbackHalo.memory_update,
      meta: {
        language: languageInfo,
        language_variant_used: languageVariant,
        context_raw: rawContextInfo,
        context_halo: haloContext,
        safety: safetyInfo,
        error: "internal_error"
      }
    };

    if (shouldExposeDebug(req, body)) {
      responseBody.previous_memory = previousMemory;
      responseBody.normalized_message = normalizedMessage;
    }

    return res.status(200).json(responseBody);
  }
}

module.exports = { handleChat };
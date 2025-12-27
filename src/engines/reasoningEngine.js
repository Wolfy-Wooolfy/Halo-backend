const { buildHaloPrompt } = require("./promptBuilder");
const { callLLM, checkReadiness } = require("./llmClient");
const { resolveLanguageCode } = require("../engines/languageDetector");
const { normalizeMessage } = require("../engines/messageNormalizer");
const { buildPreview } = require("../utils/helpers");

function stripCodeFences(text) {
  const t = normalizeMessage(text);
  if (!t) return "";
  return t.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
}

function extractFirstJsonObject(text) {
  const t = normalizeMessage(text);
  if (!t) return null;
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = t.slice(start, end + 1).trim();
  if (!candidate.startsWith("{") || !candidate.endsWith("}")) return null;
  return candidate;
}

function safeParseJson(text) {
  const cleaned = stripCodeFences(text);
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const extracted = extractFirstJsonObject(cleaned);
    if (!extracted) return null;
    try {
      return JSON.parse(extracted);
    } catch (e2) {
      return null;
    }
  }
}

function coerceHaloJson(obj) {
  if (!obj || typeof obj !== "object") return null;
  const reflection = normalizeMessage(obj.reflection);
  const question = normalizeMessage(obj.question);
  const micro = normalizeMessage(obj.micro_step) || normalizeMessage(obj.microStep) || normalizeMessage(obj.microstep);
  if (!reflection || !question) return null;
  return { reflection, question, micro_step: micro || "" };
}

function extractHaloLinesFromLLMText(text) {
  if (!text || typeof text !== "string") {
    return null;
  }
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return null;
  }
  const parts = cleaned
    .split(/[\.!\?]+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (parts.length < 2) {
    return null;
  }
  const reflection = parts[0];
  const question = parts[1];
  const microStep = parts[2] || "";
  return { reflection, question, micro_step: microStep };
}

function sanitizeEgyptianArabic(text) {
  const t = normalizeMessage(text);
  if (!t) return "";
  return t
    .replace(/مضايقني/g, "مقلقني")
    .replace(/مضايقاك/g, "مقلقك")
    .replace(/مضايقك/g, "مقلقك")
    .replace(/مضايقاكي/g, "مقلقك")
    .replace(/مضايقكِ/g, "مقلقك")
    .replace(/مضايقكم/g, "مقلقكم")
    .replace(/مضايقاهم/g, "مقلقاهم")
    .replace(/مضايقهم/g, "مقلقهم")
    .replace(/مضايقاها/g, "مقلقاها")
    .replace(/مضايقها/g, "مقلقها")
    .replace(/مضايق/g, "مقلق");
}

function sanitizeHaloResponse(obj, language) {
  if (!obj || typeof obj !== "object") return obj;
  const languageFamily = resolveLanguageCode(language);
  
  if (languageFamily !== "ar") {
    return {
      reflection: normalizeMessage(obj.reflection),
      question: normalizeMessage(obj.question),
      micro_step: normalizeMessage(obj.micro_step)
    };
  }
  return {
    reflection: sanitizeEgyptianArabic(obj.reflection),
    question: sanitizeEgyptianArabic(obj.question),
    micro_step: sanitizeEgyptianArabic(obj.micro_step)
  };
}

function buildEmergencyResponse(options) {
  const languageRaw = options && options.language ? String(options.language) : "en";
  const languageFamily = resolveLanguageCode(languageRaw);
  const safety = options && options.safety ? options.safety : {};
  const category = safety && typeof safety.category === "string" ? safety.category : "none";

  if (languageFamily === "ar") {
    if (category === "self_harm") {
      return {
        reflection: "أنا واخد كلامك بجد.",
        question: "هل أنت في أمان دلوقتي؟",
        micro_step: "لو في خطر مباشر، اتصل بالإسعاف/الشرطة فورًا أو اطلب من شخص قريب يبقى معاك حالًا."
      };
    }
    if (category === "harm_others") {
      return {
        reflection: "أنا واخد كلامك بجد.",
        question: "هل تقدر تبعد نفسك عن أي وسيلة أذى دلوقتي؟",
        micro_step: "سيب المكان فورًا واطلب مساعدة عاجلة من شخص قريب أو اتصل بالطوارئ."
      };
    }
    if (category === "medical_emergency") {
      return {
        reflection: "ده ممكن يكون طارئ طبي.",
        question: "هل في حد معاك يقدر يساعدك الآن؟",
        micro_step: "اتصل بالإسعاف فورًا، ولو تقدر اقعد/استلقي في مكان آمن لحد ما المساعدة توصل."
      };
    }
    return {
      reflection: "أنا واخد كلامك بجد.",
      question: "هل أنت في أمان دلوقتي؟",
      micro_step: "لو في خطر مباشر، اتصل بالطوارئ أو اطلب شخص قريب يبقى معاك حالًا."
    };
  }

  if (category === "self_harm") {
    return {
      reflection: "I’m taking what you said seriously.",
      question: "Are you safe right now?",
      micro_step: "If there’s immediate danger, call your local emergency services now or ask someone nearby to stay with you."
    };
  }
  if (category === "harm_others") {
    return {
      reflection: "I’m taking what you said seriously.",
      question: "Can you move away from anything that could cause harm right now?",
      micro_step: "Leave the situation and get urgent help from someone nearby or call emergency services."
    };
  }
  if (category === "medical_emergency") {
    return {
      reflection: "This may be a medical emergency.",
      question: "Is someone with you who can help right now?",
      micro_step: "Call emergency services now, and if possible sit/lie down in a safe place until help arrives."
    };
  }
  return {
    reflection: "I’m taking what you said seriously.",
    question: "Are you safe right now?",
    micro_step: "If there’s immediate danger, call emergency services or get someone nearby to stay with you."
  };
}

function buildFallbackResponse(options) {
  const languageRaw = options && options.language ? String(options.language) : "en";
  const languageFamily = resolveLanguageCode(languageRaw);
  const context = options && options.context ? String(options.context) : "general";

  if (languageFamily === "ar") {
    if (context === "emotional_discomfort") {
      return {
        reflection: "حاسس إن اللحظة دي تقيلة عليك شوية.",
        question: "إيه أكتر حاجة مقلقاك دلوقتي؟",
        micro_step: "خد نفس بطيء واحد قبل ما ترد."
      };
    }
    if (context === "decision") {
      return {
        reflection: "واضح إن عندك قرار محتاج حسم.",
        question: "إيه أكتر اختيارين واقفين قدامك دلوقتي؟",
        micro_step: "اكتب بس اسم الاختيار الأقرب لقلبك."
      };
    }
    if (context === "general") {
      return { reflection: "فاهمك.", question: "تحب نبدأ بإيه الأول؟", micro_step: "اختار نقطة واحدة بس ونبدأ بيها." };
    }
    return {
      reflection: "حاسس إن الصورة مش واضحة بالكامل.",
      question: "إيه الجزئية اللي محتاجة توضيح أكتر؟",
      micro_step: "قولها في جملة بسيطة."
    };
  }

  if (context === "emotional_discomfort") {
    return {
      reflection: "It sounds like this moment feels a bit heavy.",
      question: "Which part of this feels hardest right now?",
      micro_step: "Take one slow breath before you answer."
    };
  }
  if (context === "decision") {
    return {
      reflection: "It seems you’re standing in front of a choice.",
      question: "What are the top two options in your mind?",
      micro_step: "Write just the option that feels slightly lighter."
    };
  }
  if (context === "general") {
    return {
      reflection: "I’m following what you’re trying to express.",
      question: "Which point would you like us to start with?",
      micro_step: "Pick one small part to focus on first."
    };
  }
  return {
    reflection: "I may be missing part of your intent here.",
    question: "What’s the part you want me to focus on most?",
    micro_step: "Try to describe it in one simple sentence."
  };
}

function buildMemoryUpdate(options) {
  const context = options && options.context ? String(options.context) : "general";
  const safety = options && options.safety ? options.safety : {};
  const message = options && options.message ? String(options.message) : "";
  const memory = options && options.memory && typeof options.memory === "object" ? options.memory : {};
  const preview = buildPreview(message);
  const lastTopic = normalizeMessage(memory.lastTopic || memory.last_topic || "");
  const lastContext = normalizeMessage(context);
  const lastSafetyFlag = normalizeMessage((safety && safety.flag) || "none");
  const lastSignalCodes = Array.isArray(memory.lastSignalCodes)
    ? memory.lastSignalCodes.slice(0, 30)
    : Array.isArray(memory.last_signal_codes)
      ? memory.last_signal_codes.slice(0, 30)
      : [];
  const hesitation = !!(memory.hesitationSignal || memory.hesitation_signal);
  return {
    last_topic: lastTopic,
    last_message_preview: preview,
    last_safety_flag: lastSafetyFlag,
    mood_delta: "",
    hesitation_signal: hesitation,
    last_context: lastContext,
    last_signal_codes: lastSignalCodes
  };
}

async function generateResponse(options) {
  const safeOptions = options && typeof options === "object" ? options : {};
  const message = safeOptions.message || safeOptions.text || "";
  const language = safeOptions.language || "en";
  const context = safeOptions.context || "general";
  const safety = safeOptions.safety || {};
  const memory = safeOptions.memory || {};
  const lastReasoning = safeOptions.lastReasoning || null;
  const route = safeOptions.route || {};
  const policy = safeOptions.policy || null;

  const readiness = checkReadiness();

  const llmAllowedByRoute = typeof route.useLLM === "boolean" ? route.useLLM : true;
  
  const emergencyCategories = ["self_harm", "harm_others", "medical_emergency"];
  const safetyCategory = safety && typeof safety.category === "string" ? safety.category : "none";
  const isEmergency = emergencyCategories.includes(safetyCategory);

  // DECISION: Fallback if Not Ready OR Route says no LLM OR Empty Message
  if (!message || !llmAllowedByRoute || !readiness.ready) {
    let finalReasonCode = null;
    
    // Capture readiness failure code if that's the cause
    if (!readiness.ready && llmAllowedByRoute) {
      finalReasonCode = readiness.reasonCode;
    }

    const base = isEmergency ? buildEmergencyResponse({ language, safety }) : buildFallbackResponse({ language, context });
    const cleaned = sanitizeHaloResponse(base, language);
    
    return {
      reflection: cleaned.reflection,
      question: cleaned.question,
      micro_step: cleaned.micro_step,
      safety_flag: safety && safety.flag ? safety.flag : "none",
      memory_update: buildMemoryUpdate({ message, context, safety, memory }),
      engine: { source: "fallback", model: "rule-based" },
      final_reason_code: finalReasonCode // Explicit return
    };
  }

  try {
    const prompt = buildHaloPrompt({ message, language, context, safety, memory_snapshot: memory, lastReasoning, route, policy });
    const maxTokens =
      typeof route.maxTokens === "number"
        ? route.maxTokens
        : typeof route.max_tokens === "number"
          ? route.max_tokens
          : 256;
    const temperature = typeof route.temperature === "number" ? route.temperature : 0.4;
    
    // STRICT: No default fallback allowed. Must come from env or route.
    const model = route.model || process.env.LLM_MODEL || ""; 

    // FAIL-CLOSED GUARD: If model is empty (and somehow passed readiness), block immediately
    if (!model) {
      const base = buildFallbackResponse({ language, context });
      const cleaned = sanitizeHaloResponse(base, language);
      return {
        reflection: cleaned.reflection,
        question: cleaned.question,
        micro_step: cleaned.micro_step,
        safety_flag: safety && safety.flag ? safety.flag : "none",
        memory_update: buildMemoryUpdate({ message, context, safety, memory }),
        engine: { source: "fallback", model: "none" },
        final_reason_code: "missing_env:LLM_MODEL"
      };
    }

    const llmResult = await callLLM({ prompt, model, temperature, maxTokens, responseFormat: { type: "json_object" } });

    if (!llmResult || !llmResult.success) {
      const errCode = (llmResult && llmResult.error) ? llmResult.error : "LLM_UNKNOWN_ERROR";
      const base = buildFallbackResponse({ language, context });
      const cleaned = sanitizeHaloResponse(base, language);
      return {
        reflection: cleaned.reflection,
        question: cleaned.question,
        micro_step: cleaned.micro_step,
        safety_flag: safety && safety.flag ? safety.flag : "none",
        memory_update: buildMemoryUpdate({ message, context, safety, memory }),
        engine: llmResult && llmResult.engine ? llmResult.engine : { source: "fallback", model: "rule-based" },
        final_reason_code: errCode // Explicit return
      };
    }

    let parsed = null;
    let text = "";

    if (llmResult.output) {
      if (typeof llmResult.output === "object") {
        parsed = coerceHaloJson(llmResult.output);
      } else if (typeof llmResult.output === "string") {
        text = llmResult.output;
      }
    }

    if (!parsed && text) {
      const jsonObj = safeParseJson(text);
      parsed = coerceHaloJson(jsonObj);
    }

    if (!parsed && text) {
      parsed = extractHaloLinesFromLLMText(text);
    }

    if (!parsed) {
      const base = buildFallbackResponse({ language, context });
      const cleaned = sanitizeHaloResponse(base, language);
      return {
        reflection: cleaned.reflection,
        question: cleaned.question,
        micro_step: cleaned.micro_step,
        safety_flag: safety && safety.flag ? safety.flag : "none",
        memory_update: buildMemoryUpdate({ message, context, safety, memory }),
        engine: llmResult.engine || { source: "fallback", model: "rule-based" },
        final_reason_code: "LLM_PARSE_FAILURE" // Explicit return
      };
    }

    const cleaned = sanitizeHaloResponse(
      { reflection: parsed.reflection, question: parsed.question, micro_step: parsed.micro_step },
      language
    );

    return {
      reflection: cleaned.reflection,
      question: cleaned.question,
      micro_step: cleaned.micro_step,
      safety_flag: safety && safety.flag ? safety.flag : "none",
      memory_update: buildMemoryUpdate({ message, context, safety, memory }),
      engine: llmResult.engine || { source: "llm", model }
    };
  } catch (err) {
    const base = buildFallbackResponse({ language, context });
    const cleaned = sanitizeHaloResponse(base, language);
    return {
      reflection: cleaned.reflection,
      question: cleaned.question,
      micro_step: cleaned.micro_step,
      safety_flag: safety && safety.flag ? safety.flag : "none",
      memory_update: buildMemoryUpdate({ message, context, safety, memory }),
      engine: { source: "fallback", model: "rule-based" },
      final_reason_code: "REASONING_EXCEPTION" // Explicit return
    };
  }
}

async function reasoningEngine(arg1, arg2, arg3, arg4) {
  if (arg1 && typeof arg1 === "object" && !Array.isArray(arg1)) {
    return generateResponse(arg1);
  }
  const message = arg1 || "";
  const context = typeof arg2 === "string" ? arg2 : "general";
  const language = typeof arg3 === "string" ? arg3 : "en";
  const safety = arg4 && typeof arg4 === "object" ? arg4 : {};
  return generateResponse({ message, context, language, safety });
}

module.exports = reasoningEngine;
module.exports.generateResponse = generateResponse;
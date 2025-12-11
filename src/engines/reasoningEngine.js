const { buildHaloPrompt } = require("./promptBuilder");
const { callLLM, isConfigured } = require("./llmClient");

function extractHaloLinesFromLLMText(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return null;
  }

  const parts = cleaned
    .split(/[\.!\?؟]+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (parts.length < 2) {
    return null;
  }

  const reflection = parts[0];
  const question = parts[1];
  const microStep = parts[2] || "";

  return {
    reflection,
    question,
    micro_step: microStep
  };
}

function buildFallbackResponse(options) {
  const message = options && options.message ? String(options.message) : "";
  const language = options && options.language ? String(options.language) : "en";
  const context = options && options.context ? String(options.context) : "general";

  if (language === "ar") {
    if (context === "emotional_discomfort") {
      return {
        reflection: "حاسس إن اللحظة دي تقيلة عليك شوية.",
        question: "ايه الجزء اللي مضايقك أكتر دلوقتي؟",
        micro_step: "خد نفس بطيء واحد قبل ما تكتب ردك."
      };
    }

    if (context === "decision") {
      return {
        reflection: "واضح إن عندك قرار محتاج حسم.",
        question: "ايه أكتر اختيارين واقفين قدامك دلوقتي؟",
        micro_step: "اكتب بس اسم الاختيار الأقرب لقلبك."
      };
    }

    if (context === "general") {
      return {
        reflection: "سامعك وبقرأ اللي بتحاول توصله.",
        question: "تحب نركز على أنهي نقطة الأول؟",
        micro_step: "اختار نقطة واحدة بس نبتدي منها."
      };
    }

    return {
      reflection: "فاهم إن الموضوع مش واضح بالكامل ليك.",
      question: "ايه الحتة اللي حاسس إنها محتاجة توضيح؟",
      micro_step: "جرّب تشرحها في جملة بسيطة."
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
  const message = options && options.message ? String(options.message) : "";
  const safety = options && options.safety ? options.safety : {};

  return {
    last_topic: context,
    last_message_preview: message.slice(0, 200),
    last_safety_flag: safety.flag || "none",
    mood_delta: "",
    hesitation_signal: false
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

  const fallback = buildFallbackResponse({
    message,
    language,
    context
  });

  const llmAllowedByRoute =
    typeof route.useLLM === "boolean" ? route.useLLM : true;

  const llmAvailable = isConfigured();
  const isHighRisk = safety.flag === "high_risk" || safety.level === "high";

  if (!message || !llmAvailable || !llmAllowedByRoute || isHighRisk) {
    return {
      reflection: fallback.reflection,
      question: fallback.question,
      micro_step: fallback.micro_step,
      safety_flag: safety && safety.flag ? safety.flag : "none",
      memory_update: buildMemoryUpdate({ message, context, safety }),
      engine: {
        source: "fallback",
        model: "rule-based"
      }
    };
  }

  try {
    const prompt = buildHaloPrompt({
      userMessage: message,
      language,
      context,
      safety,
      memory,
      lastReasoning
    });

    const maxTokens =
      typeof route.maxTokens === "number"
        ? route.maxTokens
        : typeof route.max_tokens === "number"
        ? route.max_tokens
        : 256;

    const temperature =
      typeof route.temperature === "number" ? route.temperature : 0.4;

    const model = route.model || process.env.LLM_MODEL || "gpt-4o";

    const llmResult = await callLLM({
      prompt,
      model,
      temperature,
      maxTokens
    });

    if (!llmResult || !llmResult.success) {
      return {
        reflection: fallback.reflection,
        question: fallback.question,
        micro_step: fallback.micro_step,
        safety_flag: safety && safety.flag ? safety.flag : "none",
        memory_update: buildMemoryUpdate({ message, context, safety }),
        engine: llmResult && llmResult.engine
          ? llmResult.engine
          : {
              source: "fallback",
              model: "rule-based"
            }
      };
    }

    let text = "";
    let parsed = null;

    if (llmResult.output) {
      if (typeof llmResult.output === "string") {
        text = llmResult.output;
      } else if (typeof llmResult.output === "object") {
        parsed = {
          reflection: llmResult.output.reflection || "",
          question: llmResult.output.question || "",
          micro_step:
            llmResult.output.micro_step || llmResult.output.microStep || ""
        };
      }
    }

    if (!parsed && !text) {
      const raw = llmResult.raw || {};
      if (raw && Array.isArray(raw.choices) && raw.choices[0]) {
        const choice = raw.choices[0];
        if (typeof choice.text === "string") {
          text = choice.text;
        } else if (
          choice.message &&
          typeof choice.message.content === "string"
        ) {
          text = choice.message.content;
        }
      } else if (typeof raw.output === "string") {
        text = raw.output;
      } else if (typeof raw.result === "string") {
        text = raw.result;
      } else if (typeof raw.content === "string") {
        text = raw.content;
      }
    }

    if (!parsed && text) {
      parsed = extractHaloLinesFromLLMText(text);
    }

    if (!parsed) {
      return {
        reflection: fallback.reflection,
        question: fallback.question,
        micro_step: fallback.micro_step,
        safety_flag: safety && safety.flag ? safety.flag : "none",
        memory_update: buildMemoryUpdate({ message, context, safety }),
        engine: llmResult.engine || {
          source: "fallback",
          model: "rule-based"
        }
      };
    }

    return {
      reflection: parsed.reflection,
      question: parsed.question,
      micro_step: parsed.micro_step,
      safety_flag: safety && safety.flag ? safety.flag : "none",
      memory_update: buildMemoryUpdate({ message, context, safety }),
      engine: llmResult.engine || {
        source: "llm",
        model
      }
    };
  } catch (err) {
    return {
      reflection: fallback.reflection,
      question: fallback.question,
      micro_step: fallback.micro_step,
      safety_flag: safety && safety.flag ? safety.flag : "none",
      memory_update: buildMemoryUpdate({ message, context, safety }),
      engine: {
        source: "fallback",
        model: "rule-based"
      }
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

  return generateResponse({
    message,
    context,
    language,
    safety
  });
}

module.exports = reasoningEngine;
module.exports.generateResponse = generateResponse;

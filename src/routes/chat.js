const express = require("express");
const router = express.Router();

const safetyGuard = require("../engines/safetyGuard");
const reasoningEngine = require("../engines/reasoningEngine");
const { getUserMemory, updateUserMemory } = require("../engines/memoryEngine");

const normalize = require("../engines/messageNormalizer");
const detectLanguage = require("../engines/languageDetector");
const classifyContext = require("../engines/contextClassifier");

router.post("/chat", async (req, res) => {
  try {
    const body = req.body || {};
    const userId = body.user_id || "anonymous";
    const rawMessage = body.message || "";

    const normalizedMessage = normalize(rawMessage);
    const languageInfo = detectLanguage(normalizedMessage);
    const contextInfo = classifyContext(normalizedMessage, languageInfo);
    const safetyInfo = safetyGuard(normalizedMessage, contextInfo);

    const currentMemory = getUserMemory(userId);

    const halo = reasoningEngine({
      context: contextInfo.category,
      normalizedMessage,
      language: languageInfo === "ar" ? "ar" : "en"
    });

    const memoryResult = updateUserMemory({
      userId,
      normalizedMessage,
      context: contextInfo.category,
      language: languageInfo === "ar" ? "ar" : "en",
      safetyFlag: safetyInfo.flag
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
        context: contextInfo,
        safety: safetyInfo
      },

      memory_snapshot: memoryResult.memory,
      memory_delta: memoryResult.delta,
      previous_memory: currentMemory
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

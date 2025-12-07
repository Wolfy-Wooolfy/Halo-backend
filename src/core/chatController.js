const safetyGuard = require("../engines/safetyGuard");
const reasoningEngine = require("../engines/reasoningEngine");
const normalize = require("../utils/messageNormalizer");
const detectLanguage = require("../utils/languageDetector");
const classifyContext = require("../utils/contextClassifier");

async function handleChat(req, res) {
  try {
    const body = req.body || {};
    const userId = body.user_id || "anonymous";
    const rawMessage = body.message || "";

    const normalizedMessage = normalize(rawMessage);
    const languageInfo = detectLanguage(normalizedMessage);
    const contextInfo = classifyContext(normalizedMessage, languageInfo);
    const safetyInfo = safetyGuard(normalizedMessage, contextInfo);

    const haloOutput = reasoningEngine({
      context: contextInfo.category,
      normalizedMessage,
      language: languageInfo === "ar" ? "ar" : "en"
    });

    return res.status(200).json({
      ok: true,
      user_id: userId,
      reflection: haloOutput.reflection,
      question: haloOutput.question,
      micro_step: haloOutput.micro_step,
      safety_flag: safetyInfo.flag,
      memory_update: haloOutput.memory_update,
      meta: {
        context: contextInfo,
        language: languageInfo,
        safety: safetyInfo
      }
    });
  } catch (err) {
    console.error("HALO Chat Error:", err);
    return res.status(500).json({
      ok: false,
      error: "internal_server_error"
    });
  }
}

module.exports = { handleChat };

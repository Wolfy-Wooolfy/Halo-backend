const { normalizeMessage } = require("../engines/messageNormalizer");
const { detectLanguage, resolveLanguageCode } = require("../engines/languageDetector");
const { updateUserMemory } = require("../engines/memoryEngine");

async function handleMindScan(req, res) {
  try {
    const { user_id, word } = req.body;

    // 1. Normalize
    const normalizedWord = normalizeMessage(word || "");
    
    if (!normalizedWord) {
      return res.status(400).json({ 
        ok: false, 
        error: "MindScan requires a word." 
      });
    }

    // 2. Detect Language
    const langRaw = detectLanguage(normalizedWord);
    const langCode = resolveLanguageCode ? resolveLanguageCode(langRaw) : (langRaw === "arabic" ? "ar" : "en");

    // 3. Update Memory (Context: mindscan_log)
    // MindScan acts as a mood anchor, so we treat it as a "check-in" context.
    const memoryResult = updateUserMemory({
      userId: user_id,
      normalizedMessage: normalizedWord,
      context: "mindscan_log", // Special context for daily ritual
      language: langCode,
      safetyFlag: "none" // Assuming single words are generally safe, can be enhanced later
    });

    // 4. Build Minimal Acknowledgement (Ritual Response)
    // MindScan is NOT a chat. It's a save point. The response must be instant and closing.
    let responseText = "";
    
    if (langCode === "ar") {
        // Dialect-aware simple acknowledgements
        const dialects = ["تمام", "وصلت", "سجلتها", "معاك"];
        responseText = dialects[Math.floor(Math.random() * dialects.length)];
    } else {
        const responses = ["Got it.", "Noted.", "Saved.", "With you."];
        responseText = responses[Math.floor(Math.random() * responses.length)];
    }

    // 5. Return Response
    return res.status(200).json({
      ok: true,
      acknowledgement: responseText,
      meta: {
        type: "mindscan_entry",
        timestamp: new Date().toISOString()
      },
      memory_delta: memoryResult.delta
    });

  } catch (error) {
    console.error("MindScan Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Internal Processing Error" 
    });
  }
}

module.exports = { handleMindScan };
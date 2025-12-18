const { normalizeMessage } = require("../engines/messageNormalizer");
const { detectLanguage, resolveLanguageCode } = require("../engines/languageDetector");
const { updateUserMemory } = require("../engines/memoryEngine");

/**
 * Handle MindScan Request (Daily Micro-Ritual)
 * Receives: { user_id, word }
 * Returns: { ok, acknowledgement, ... }
 */
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

    // 2. Detect Language & Context
    // MindScan is simple, so we rely on basic detection.
    const langRaw = detectLanguage(normalizedWord);
    // Use helper if available, otherwise fallback
    const langCode = resolveLanguageCode ? resolveLanguageCode(langRaw) : (langRaw === "arabic" ? "ar" : "en");

    // 3. Update Memory (Context: mindscan_log)
    // This logs the 'Daily Word' into the user's memory stream.
    const memoryResult = updateUserMemory({
      userId: user_id,
      normalizedMessage: normalizedWord,
      context: "mindscan_log", // Special context for daily ritual
      language: langCode,
      safetyFlag: "none" // Single words are generally safe; complex safety can be added later if needed.
    });

    // 4. Build Minimal Acknowledgement (Ritual Response)
    // HALO Rule: MindScan response must be ONE short word/phrase. No conversation.
    let responseText = "";
    
    if (langCode === "ar") {
        // Dialect-aware simple acknowledgements (Mirroring simplicity)
        const dialects = ["تمام", "وصلت", "سجلتها", "معاك", "فهمتك"];
        responseText = dialects[Math.floor(Math.random() * dialects.length)];
    } else {
        const responses = ["Got it.", "Noted.", "Saved.", "With you.", "Understood."];
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
      memory_delta: memoryResult.memory_delta || {}
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
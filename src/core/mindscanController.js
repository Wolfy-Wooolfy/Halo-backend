const { normalizeMessage } = require("../engines/messageNormalizer");
const { detectLanguage, resolveLanguageCode } = require("../engines/languageDetector");
const { updateUserMemory, getUserMemory } = require("../engines/memoryEngine");

// Helper to select a random template
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// MindScan v2: Intelligent Prompt Generation
async function getMindScanPrompt(req, res) {
  try {
    const userId = req.query.user_id || req.query.userId || "anonymous";
    const memory = getUserMemory(userId);
    const lang = memory.lastLanguage || "en";
    const isAr = lang === "ar";

    let question = isAr ? "إيه الكلمة اللي بتوصف يومك النهاردة؟" : "What is the one word for your day?";
    let contextType = "default";

    // 1. Check LNN (Biological State) - High Priority
    if (memory.lnnState && memory.lnnState.neurons) {
      const { stress, fatigue } = memory.lnnState.neurons;
      
      if (stress > 0.7) {
        question = isAr 
          ? pick(["حاسس إن الضغط عالي عليك النهاردة.. إيه الكلمة اللي توصفه؟", "لو هتوصف دوشة دماغك بكلمة، تكون إيه؟"])
          : pick(["Stress seems high today. What's the word for it?", "If you could name this pressure, what would it be?"]);
        contextType = "high_stress_followup";
      } else if (fatigue > 0.7) {
        question = isAr
          ? pick(["طاقتك شكلها قليلة.. إيه الكلمة اللي حاسس بيها دلوقتي؟", "جسمك عايز يقول إيه بكلمة واحدة؟"])
          : pick(["Energy seems low. What's the word for this feeling?", "What does your body need to say in one word?"]);
        contextType = "high_fatigue_followup";
      }
    }

    // 2. Check Timeline (Recent Episodes) - Medium Priority
    // Only if biological state isn't critical
    if (contextType === "default" && memory.timeline && memory.timeline.length > 0) {
      const lastEvent = memory.timeline[memory.timeline.length - 1];
      const eventDate = new Date(lastEvent.date);
      const now = new Date();
      const diffHours = (now - eventDate) / (1000 * 60 * 60);

      // If event happened in the last 48 hours
      if (diffHours < 48) {
        if (lastEvent.type === "NEW_BEGINNING") {
          question = isAr
            ? `إيه الكلمة اللي توصف إحساسك بعد "${lastEvent.summary}"؟`
            : `What's the word for how you feel after "${lastEvent.summary}"?`;
          contextType = "timeline_followup";
        } else if (lastEvent.type === "ENDING" || lastEvent.type === "CRISIS") {
          question = isAr
            ? `الدنيا عاملة إيه دلوقتي بعد اللي حصل؟ (كلمة واحدة)`
            : `How are things settling after what happened? (One word)`;
          contextType = "timeline_followup";
        }
      }
    }

    return res.status(200).json({
      ok: true,
      question: question,
      meta: {
        userId: userId,
        context_source: contextType,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("MindScan Prompt Error:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Internal Processing Error" 
    });
  }
}

async function handleMindScan(req, res) {
  try {
    const { user_id, userId, word } = req.body;
    const finalUserId = user_id || userId || "anonymous";

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
    const langCode = resolveLanguageCode(langRaw);

    // 3. Update Memory (Context: mindscan_log)
    // MindScan acts as a mood anchor.
    const memoryResult = updateUserMemory({
      userId: finalUserId,
      normalizedMessage: normalizedWord,
      context: "mindscan_log", // Special context
      language: langCode,
      safetyFlag: "none" 
    });

    // 4. Build Minimal Acknowledgement (Ritual Response)
    let responseText = "";
    
    if (langCode === "ar") {
        const dialects = ["تمام", "وصلت", "سجلتها", "معاك", "سمعتك"];
        responseText = dialects[Math.floor(Math.random() * dialects.length)];
    } else {
        const responses = ["Got it.", "Noted.", "Saved.", "With you.", "Heard."];
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

module.exports = { handleMindScan, getMindScanPrompt };
const memoryStore = {};
const { normalizeMessage } = require("./messageNormalizer");

// REMOVED: normalizeText (Replaced by central messageNormalizer)

function buildPreview(text) {
  const t = normalizeMessage(text).replace(/\s+/g, " ");
  if (!t) return "";
  return t.length > 80 ? t.slice(0, 80) : t;
}

function buildDefaultMemory(userId) {
  return {
    userId: userId || "anonymous",
    lastMessage: "",
    lastMessagePreview: "",
    lastContext: null,
    lastLanguage: null,
    lastSafetyFlag: "none",
    lastMood: "neutral",
    lastUpdatedAt: null,
    interactionCount: 0,
    moodHistory: [],
    lastTopic: "",
    lastSignalCodes: [],
    hesitationSignal: false
  };
}

function deriveMood(context, safetyFlag) {
  if (safetyFlag === "high_risk") return "crisis";
  if (safetyFlag === "high_stress") return "stressed";
  if (context === "emotional_discomfort") return "uncomfortable";
  if (context === "decision") return "focused";
  if (context === "planning") return "planning";
  return "neutral";
}

function getUserMemory(userId) {
  const id = userId || "anonymous";
  if (!memoryStore[id]) {
    memoryStore[id] = buildDefaultMemory(id);
  }
  return memoryStore[id];
}

function getUserMemorySnapshot(userId) {
  return getUserMemory(userId || "anonymous");
}

function asArray(val) {
  if (Array.isArray(val)) return val;
  return [];
}

function updateUserMemory(payload) {
  const userId = payload.userId || "anonymous";
  const normalizedMessage = payload.normalizedMessage || "";
  const context = payload.context || "general";
  const language = payload.language || "en";
  const safetyFlag = payload.safetyFlag || "none";

  const reasoning = payload.reasoning && typeof payload.reasoning === "object" ? payload.reasoning : {};
  const mu = reasoning.memory_update && typeof reasoning.memory_update === "object" ? reasoning.memory_update : {};

  const muLastTopic = normalizeMessage(mu.last_topic);
  const muLastContext = normalizeMessage(mu.last_context);
  const muLastSafetyFlag = normalizeMessage(mu.last_safety_flag);
  const muPreview = normalizeMessage(mu.last_message_preview);
  const muSignalCodes = asArray(mu.last_signal_codes);
  const muHesitation = !!mu.hesitation_signal;

  const current = getUserMemory(userId);

  const finalContext = muLastContext ? muLastContext : context;
  const finalSafety = muLastSafetyFlag ? muLastSafetyFlag : safetyFlag;

  const mood = deriveMood(finalContext, finalSafety);

  const preview = muPreview ? muPreview : buildPreview(normalizedMessage);

  const nextSignalCodes = Array.from(
    new Set([...(Array.isArray(current.lastSignalCodes) ? current.lastSignalCodes : []), ...muSignalCodes])
  ).slice(0, 30);

  const updated = {
    ...current,
    lastMessagePreview: preview,
    lastMessage: preview,
    lastContext: finalContext,
    lastLanguage: language,
    lastSafetyFlag: finalSafety,
    lastMood: mood,
    lastUpdatedAt: new Date().toISOString(),
    interactionCount: current.interactionCount + 1,
    lastTopic: muLastTopic ? muLastTopic : normalizeMessage(current.lastTopic),
    lastSignalCodes: nextSignalCodes,
    hesitationSignal: muHesitation || !!current.hesitationSignal
  };

  const newMoodEntry = {
    at: updated.lastUpdatedAt,
    context: updated.lastContext,
    safetyFlag: updated.lastSafetyFlag,
    mood: updated.lastMood
  };

  const history = Array.isArray(current.moodHistory)
    ? [...current.moodHistory, newMoodEntry]
    : [newMoodEntry];

  if (history.length > 50) {
    history.shift();
  }

  updated.moodHistory = history;
  memoryStore[userId] = updated;

  const delta = {
    userId,
    interactionCount: updated.interactionCount,
    lastMood: updated.lastMood,
    lastSafetyFlag: updated.lastSafetyFlag,
    lastTopic: updated.lastTopic,
    hesitationSignal: updated.hesitationSignal
  };

  return {
    memory: updated,
    delta
  };
}

module.exports = {
  getUserMemory,
  getUserMemorySnapshot,
  updateUserMemory
};
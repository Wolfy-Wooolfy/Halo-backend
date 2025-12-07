const memoryStore = {};

function buildDefaultMemory(userId) {
  return {
    userId: userId || "anonymous",
    lastMessage: "",
    lastContext: null,
    lastLanguage: null,
    lastSafetyFlag: "none",
    lastMood: "neutral",
    lastUpdatedAt: null,
    interactionCount: 0,
    moodHistory: []
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

function updateUserMemory(payload) {
  const userId = payload.userId || "anonymous";
  const normalizedMessage = payload.normalizedMessage || "";
  const context = payload.context || "general";
  const language = payload.language || "en";
  const safetyFlag = payload.safetyFlag || "none";

  const current = getUserMemory(userId);
  const mood = deriveMood(context, safetyFlag);

  const updated = {
    ...current,
    lastMessage: normalizedMessage,
    lastContext: context,
    lastLanguage: language,
    lastSafetyFlag: safetyFlag,
    lastMood: mood,
    lastUpdatedAt: new Date().toISOString(),
    interactionCount: current.interactionCount + 1
  };

  const newMoodEntry = {
    at: updated.lastUpdatedAt,
    context,
    safetyFlag,
    mood
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
    lastSafetyFlag: updated.lastSafetyFlag
  };

  return {
    memory: updated,
    delta
  };
}

module.exports = {
  getUserMemory,
  updateUserMemory
};

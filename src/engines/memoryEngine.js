const fs = require("fs");
const path = require("path");
const { normalizeMessage } = require("./messageNormalizer");
const { updateSemanticGraph, createEmptyGraph } = require("./semanticMemoryEngine");

// File persistence setup
const DATA_DIR = path.join(__dirname, "../../data");
const MEMORY_FILE = path.join(DATA_DIR, "memory_store.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache
let memoryStore = {};

// Load from disk on startup
if (fs.existsSync(MEMORY_FILE)) {
  try {
    const raw = fs.readFileSync(MEMORY_FILE, "utf-8");
    memoryStore = JSON.parse(raw);
    console.log(`[MemoryEngine] Loaded ${Object.keys(memoryStore).length} user profiles.`);
  } catch (err) {
    console.error("[MemoryEngine] Failed to load memory file:", err);
    memoryStore = {};
  }
}

function saveMemoryToDisk() {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memoryStore, null, 2));
  } catch (err) {
    console.error("[MemoryEngine] Failed to save memory:", err);
  }
}

function buildPreview(text) {
  const t = normalizeMessage(text).replace(/\s+/g, " ");
  if (!t) return "";
  return t.length > 80 ? t.slice(0, 80) : t;
}

function buildDefaultMemory(userId) {
  return {
    userId: userId || "anonymous",
    // V0.1 Fields (Kept for compatibility)
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
    hesitationSignal: false,
    
    // V1.0 SEMANTIC GRAPH
    semanticGraph: createEmptyGraph()
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
  // Data Migration: Ensure graph exists for old users
  if (!memoryStore[id].semanticGraph) {
     memoryStore[id].semanticGraph = createEmptyGraph();
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

  // --- PHASE 2 UPGRADE: Update Semantic Graph ---
  const updatedGraph = updateSemanticGraph(current.semanticGraph, {
    text: normalizedMessage,
    context: finalContext,
    safety: finalSafety,
    mood: mood
  });
  // ----------------------------------------------

  const updated = {
    ...current,
    lastMessagePreview: preview,
    // Note: We avoid storing full text if possible, using preview
    lastMessage: preview, 
    lastContext: finalContext,
    lastLanguage: language,
    lastSafetyFlag: finalSafety,
    lastMood: mood,
    lastUpdatedAt: new Date().toISOString(),
    interactionCount: current.interactionCount + 1,
    lastTopic: muLastTopic ? muLastTopic : normalizeMessage(current.lastTopic),
    lastSignalCodes: nextSignalCodes,
    hesitationSignal: muHesitation || !!current.hesitationSignal,
    
    // Store new graph
    semanticGraph: updatedGraph
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

  // Persist to disk
  saveMemoryToDisk();

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
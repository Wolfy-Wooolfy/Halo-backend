const fs = require("fs");
const path = require("path");
const { normalizeMessage } = require("./messageNormalizer");
const { updateSemanticGraph, createEmptyGraph } = require("./semanticMemoryEngine");
const { getInitialLNNState, tickLNN } = require("./lnnEngine");
const { updateTimeline, getInitialTimeline } = require("./timelineEngine");
const { analyzePatterns } = require("./patternEngine");
const { buildPreview } = require("../utils/helpers");

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

// Async Save State Flags
let isSaving = false;
let saveQueued = false;

/**
 * Saves memory to disk asynchronously with a queue mechanism.
 * This prevents blocking the Event Loop and ensures data integrity during rapid updates.
 */
async function saveMemoryToDisk() {
  // If a save is already in progress, mark a queue flag to run again immediately after.
  if (isSaving) {
    saveQueued = true;
    return;
  }

  isSaving = true;

  try {
    // Use fs.promises for non-blocking I/O
    await fs.promises.writeFile(MEMORY_FILE, JSON.stringify(memoryStore, null, 2));
  } catch (err) {
    console.error("[MemoryEngine] Failed to save memory:", err);
  } finally {
    isSaving = false;
    // If a new change happened while we were writing, save again to capture latest state
    if (saveQueued) {
      saveQueued = false;
      saveMemoryToDisk();
    }
  }
}

function buildDefaultMemory(userId) {
  return {
    userId: userId || "anonymous",
    createdAt: new Date().toISOString(),
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
    semanticGraph: createEmptyGraph(),
    
    // V1.1 LIQUID NEURAL NETWORK
    lnnState: getInitialLNNState(),

    // V1.2 EPISODIC TIMELINE
    timeline: getInitialTimeline(),

    // V1.3 BEHAVIORAL PATTERNS
    patterns: []
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
  // Data Migration for Phase 2 & Trust Architecture
  if (!memoryStore[id].semanticGraph) memoryStore[id].semanticGraph = createEmptyGraph();
  if (memoryStore[id].semanticGraph.meta.globalTrustScore === undefined) {
    memoryStore[id].semanticGraph.meta.globalTrustScore = 50;
  }
  if (!memoryStore[id].lnnState) memoryStore[id].lnnState = getInitialLNNState();
  if (!memoryStore[id].createdAt) memoryStore[id].createdAt = new Date().toISOString();
  if (!memoryStore[id].timeline) memoryStore[id].timeline = getInitialTimeline();
  if (!memoryStore[id].patterns) memoryStore[id].patterns = [];
  
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
  const normalizedMessage = payload.normalizedMessage || payload.message || "";
  
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

  // --- PHASE 2: Semantic Graph with Trust ---
  const updatedGraph = updateSemanticGraph(current.semanticGraph, {
    text: normalizedMessage,
    context: finalContext,
    safety: finalSafety,
    mood: mood,
    userCreatedAt: current.createdAt
  });

  let activeDimension = null;
  for (const [key, val] of Object.entries(updatedGraph.dimensions)) {
    if (val.lastActive === updatedGraph.meta.lastAnalysis) {
      activeDimension = key;
      break;
    }
  }

  // --- PHASE 2: LNN Tick ---
  const updatedLNN = tickLNN(current.lnnState, {
    context: finalContext,
    safety: finalSafety,
    messageLength: normalizedMessage.length,
    semanticScore: activeDimension ? 1 : 0
  });

  // --- PHASE 2: Timeline Update ---
  const updatedTimeline = updateTimeline(current.timeline, {
    text: normalizedMessage,
    mood: mood,
    context: finalContext,
    dimension: activeDimension
  });

  const newMoodEntry = {
    at: new Date().toISOString(),
    context: finalContext,
    safetyFlag: finalSafety,
    mood: mood
  };

  const history = Array.isArray(current.moodHistory)
    ? [...current.moodHistory, newMoodEntry]
    : [newMoodEntry];

  if (history.length > 100) {
    history.shift();
  }

  // --- PHASE 2: Pattern Recognition ---
  const detectedPatterns = analyzePatterns(history);

  const updated = {
    ...current,
    lastMessagePreview: preview,
    lastMessage: preview, 
    lastContext: finalContext,
    lastLanguage: language,
    lastSafetyFlag: finalSafety,
    lastMood: mood,
    lastUpdatedAt: newMoodEntry.at,
    interactionCount: current.interactionCount + 1,
    lastTopic: muLastTopic ? muLastTopic : normalizeMessage(current.lastTopic),
    lastSignalCodes: nextSignalCodes,
    hesitationSignal: muHesitation || !!current.hesitationSignal,
    
    semanticGraph: updatedGraph,
    lnnState: updatedLNN,
    timeline: updatedTimeline,
    moodHistory: history,
    patterns: detectedPatterns 
  };

  memoryStore[userId] = updated;
  
  // Trigger async save (fire and forget from the caller's perspective)
  saveMemoryToDisk();

  return {
    memory: updated,
    delta: {
      userId,
      interactionCount: updated.interactionCount,
      lastMood: updated.lastMood,
      lastTopic: updated.lastTopic,
      newPatterns: detectedPatterns.length
    }
  };
}

module.exports = {
  getUserMemory,
  getUserMemorySnapshot,
  updateUserMemory
};
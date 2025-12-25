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
const MEMORY_FILE_TMP = path.join(DATA_DIR, "memory_store.json.tmp");
const MEMORY_FILE_BAK = path.join(DATA_DIR, "memory_store.json.bak");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache
let memoryStore = {};

function loadMemoryFromDisk(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  // This will throw if JSON is corrupted
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object") return null;
  return parsed;
}

// --- Startup Logic with Fallback ---
if (fs.existsSync(MEMORY_FILE)) {
  try {
    const primary = loadMemoryFromDisk(MEMORY_FILE);
    if (primary) {
      memoryStore = primary;
      console.log(`[MemoryEngine] Loaded ${Object.keys(memoryStore).length} user profiles.`);
    } else {
      throw new Error("PRIMARY_MEMORY_LOAD_FAILED");
    }
  } catch (err) {
    console.warn("[MemoryEngine] Primary memory load failed. Attempting backup...", err.message);
    try {
      const backup = loadMemoryFromDisk(MEMORY_FILE_BAK);
      if (backup) {
        memoryStore = backup;
        console.log(`[MemoryEngine] Recovered ${Object.keys(memoryStore).length} user profiles from BACKUP.`);
      } else {
        throw new Error("BACKUP_MEMORY_LOAD_FAILED");
      }
    } catch (err2) {
      console.error("[MemoryEngine] CRITICAL: Failed to load memory from both primary and backup.", err2.message);
      // Fallback to empty store (New System State)
      memoryStore = {};
    }
  }
} else {
    // If primary file is missing but backup exists (e.g. accidental deletion), try backup
    if (fs.existsSync(MEMORY_FILE_BAK)) {
        try {
            const backup = loadMemoryFromDisk(MEMORY_FILE_BAK);
            if (backup) {
                memoryStore = backup;
                console.log(`[MemoryEngine] Primary missing. Loaded ${Object.keys(memoryStore).length} profiles from BACKUP.`);
            }
        } catch(e) {
            console.error("[MemoryEngine] Backup also failed/corrupt.", e.message);
            memoryStore = {};
        }
    } else {
        console.log("[MemoryEngine] No existing memory found. Starting fresh.");
        memoryStore = {};
    }
}

// Async Save State Flags
let isSaving = false;
let saveQueued = false;

/**
 * Saves memory to disk safely:
 * 1. Write to .tmp
 * 2. Backup current .json to .bak
 * 3. Rename .tmp to .json (Atomic Replace)
 */
async function saveMemoryToDisk() {
  // If a save is already in progress, mark a queue flag to run again immediately after.
  if (isSaving) {
    saveQueued = true;
    return;
  }

  isSaving = true;

  try {
    const payload = JSON.stringify(memoryStore, null, 2);
    
    // 1. Write to temporary file first
    await fs.promises.writeFile(MEMORY_FILE_TMP, payload);

    // 2. Create/Refresh backup from current primary (if exists)
    if (fs.existsSync(MEMORY_FILE)) {
      try {
        await fs.promises.copyFile(MEMORY_FILE, MEMORY_FILE_BAK);
      } catch (e) {
        console.warn("[MemoryEngine] Backup creation failed (non-critical):", e.message);
      }
    }

    // 3. Atomic replace: Rename .tmp -> .json
    try {
      await fs.promises.rename(MEMORY_FILE_TMP, MEMORY_FILE);
    } catch (e) {
      // Windows fallback: unlink then rename if target exists and locked
      try {
        if (fs.existsSync(MEMORY_FILE)) {
          await fs.promises.unlink(MEMORY_FILE);
        }
      } catch (e2) {
        // ignore unlink error
      }
      await fs.promises.rename(MEMORY_FILE_TMP, MEMORY_FILE);
    }
  } catch (err) {
    console.error("[MemoryEngine] Failed to save memory:", err);
    try {
      if (fs.existsSync(MEMORY_FILE_TMP)) {
        await fs.promises.unlink(MEMORY_FILE_TMP);
      }
    } catch (e) {
      // ignore cleanup error
    }
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
    _version: 0, // OPTIMISTIC CONCURRENCY TOKEN
    
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

// Internal Accessor (Legacy)
function getUserMemoryInternal(userId) {
  const id = userId || "anonymous";
  if (!memoryStore[id]) {
    memoryStore[id] = buildDefaultMemory(id);
  }
  // Data Migration for Phase 2 & Trust Architecture & Phase 3
  if (!memoryStore[id].semanticGraph) memoryStore[id].semanticGraph = createEmptyGraph();
  if (memoryStore[id].semanticGraph.meta.globalTrustScore === undefined) {
    memoryStore[id].semanticGraph.meta.globalTrustScore = 50;
  }
  if (!memoryStore[id].lnnState) memoryStore[id].lnnState = getInitialLNNState();
  if (!memoryStore[id].createdAt) memoryStore[id].createdAt = new Date().toISOString();
  if (!memoryStore[id].timeline) memoryStore[id].timeline = getInitialTimeline();
  if (!memoryStore[id].patterns) memoryStore[id].patterns = [];
  if (typeof memoryStore[id]._version !== 'number') memoryStore[id]._version = 0;
  
  return memoryStore[id];
}

// --------------------------------------------------------
// PHASE 3-B: MEMORY INTERFACE ABSTRACTION
// --------------------------------------------------------

/**
 * LOAD: Fetches memory snapshot bound to identity.
 * Returns { snapshot, version }
 */
async function load(identityContext) {
  const id = identityContext.identityId;
  const mem = getUserMemoryInternal(id);
  
  // Return a deep copy to prevent mutation outside commit
  // For this patch, we use a simple JSON clone
  const snapshot = JSON.parse(JSON.stringify(mem));
  const version = mem._version;

  return { snapshot, version };
}

/**
 * COMMIT: Persists memory snapshot safely.
 * Enforces Phase 3-C: Identity Persistence Rules & Optimistic Concurrency
 */
async function commit(identityContext, nextSnapshot, expectedVersion) {
  // RULE 1: Identity Must Allow Persistence
  if (!identityContext.canPersist) {
    console.warn(`[MemoryEngine] Blocked persistence for identity type: ${identityContext.type}`);
    return { success: false, reason: "IDENTITY_CANNOT_PERSIST" };
  }

  const id = identityContext.identityId;
  const current = getUserMemoryInternal(id);

  // RULE 2: Optimistic Concurrency Check
  if (current._version !== expectedVersion) {
    console.warn(`[MemoryEngine] Concurrency conflict for ${id}. Expected ${expectedVersion}, got ${current._version}`);
    return { success: false, reason: "VERSION_CONFLICT" };
  }

  // Apply Update
  const newVersion = current._version + 1;
  const updatedEntry = {
    ...nextSnapshot,
    userId: id, // Ensure ID integrity
    _version: newVersion,
    lastUpdatedAt: new Date().toISOString()
  };

  memoryStore[id] = updatedEntry;
  
  // Trigger Disk Save
  saveMemoryToDisk();

  return { success: true, version: newVersion };
}

// --------------------------------------------------------
// LEGACY / HELPER WRAPPERS
// --------------------------------------------------------

// Deprecated access - mapped to internal for backward compat if needed by other utils,
// but Controller should use load/commit.
function getUserMemory(userId) {
  return getUserMemoryInternal(userId);
}

function getUserMemorySnapshot(userId) {
  return getUserMemoryInternal(userId || "anonymous");
}

function asArray(val) {
  if (Array.isArray(val)) return val;
  return [];
}

// Refactored to be pure logic helper, NOT directly modifying store.
// The Controller now orchestrates the save via commit().
function prepareMemoryUpdate(currentSnapshot, payload) {
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

  const finalContext = muLastContext ? muLastContext : context;
  const finalSafety = muLastSafetyFlag ? muLastSafetyFlag : safetyFlag;

  const mood = deriveMood(finalContext, finalSafety);
  
  const preview = normalizedMessage 
    ? (muPreview ? muPreview : buildPreview(normalizedMessage)) 
    : "";

  const nextSignalCodes = Array.from(
    new Set([...(Array.isArray(currentSnapshot.lastSignalCodes) ? currentSnapshot.lastSignalCodes : []), ...muSignalCodes])
  ).slice(0, 30);

  // --- PHASE 2: Semantic Graph with Trust ---
  const updatedGraph = updateSemanticGraph(currentSnapshot.semanticGraph, {
    text: normalizedMessage,
    context: finalContext,
    safety: finalSafety,
    mood: mood,
    userCreatedAt: currentSnapshot.createdAt
  });

  let activeDimension = null;
  for (const [key, val] of Object.entries(updatedGraph.dimensions)) {
    if (val.lastActive === updatedGraph.meta.lastAnalysis) {
      activeDimension = key;
      break;
    }
  }

  // --- PHASE 2: LNN Tick ---
  const updatedLNN = tickLNN(currentSnapshot.lnnState, {
    context: finalContext,
    safety: finalSafety,
    messageLength: normalizedMessage.length,
    semanticScore: activeDimension ? 1 : 0
  });

  // --- PHASE 2: Timeline Update ---
  const updatedTimeline = updateTimeline(currentSnapshot.timeline, {
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

  const history = Array.isArray(currentSnapshot.moodHistory)
    ? [...currentSnapshot.moodHistory, newMoodEntry]
    : [newMoodEntry];

  if (history.length > 100) {
    history.shift();
  }

  // --- PHASE 2: Pattern Recognition ---
  const detectedPatterns = analyzePatterns(history);

  const updated = {
    ...currentSnapshot,
    lastMessagePreview: preview,
    lastMessage: preview, 
    lastContext: finalContext,
    lastLanguage: language,
    lastSafetyFlag: finalSafety,
    lastMood: mood,
    interactionCount: currentSnapshot.interactionCount + 1,
    lastTopic: muLastTopic ? muLastTopic : normalizeMessage(currentSnapshot.lastTopic),
    lastSignalCodes: nextSignalCodes,
    hesitationSignal: muHesitation || !!currentSnapshot.hesitationSignal,
    
    semanticGraph: updatedGraph,
    lnnState: updatedLNN,
    timeline: updatedTimeline,
    moodHistory: history,
    patterns: detectedPatterns 
  };

  return {
    updatedSnapshot: updated,
    delta: {
      userId: currentSnapshot.userId,
      interactionCount: updated.interactionCount,
      lastMood: updated.lastMood,
      lastTopic: updated.lastTopic,
      newPatterns: detectedPatterns.length
    }
  };
}

// Backward compatibility for tests that might call this directly
// Wraps the logic but operates on the global store (unsafe for concurrency but safe for single-thread tests)
function updateUserMemory(payload) {
    const userId = payload.userId || "anonymous";
    const current = getUserMemoryInternal(userId);
    const { updatedSnapshot, delta } = prepareMemoryUpdate(current, payload);
    
    // Simulate commit
    memoryStore[userId] = {
        ...updatedSnapshot,
        _version: (current._version || 0) + 1,
        lastUpdatedAt: new Date().toISOString()
    };
    saveMemoryToDisk();
    
    return { memory: memoryStore[userId], delta };
}

module.exports = {
  load,
  commit,
  prepareMemoryUpdate, // Exported for Controller
  getUserMemory, // Legacy export
  getUserMemorySnapshot, // Legacy export
  updateUserMemory // Legacy export
};
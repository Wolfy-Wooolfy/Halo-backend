const fs = require("fs");
const path = require("path");

// Configuration for Persistence
const DATA_DIR = path.join(__dirname, "../../data");
const MEMORY_FILE = path.join(DATA_DIR, "memory_store.json");

// 1. Initialize Persistence Layer
// Ensure 'data' folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log("Memory Persistence: Created 'data' directory.");
  } catch (err) {
    console.error("Memory Persistence Error: Could not create data directory.", err);
  }
}

// Load existing memory or start fresh
let memoryStore = {};
if (fs.existsSync(MEMORY_FILE)) {
  try {
    const rawData = fs.readFileSync(MEMORY_FILE, "utf-8");
    memoryStore = JSON.parse(rawData);
    console.log(`Memory Persistence: Loaded ${Object.keys(memoryStore).length} user profiles.`);
  } catch (err) {
    console.error("Memory Persistence Error: Corrupt memory file, starting fresh.", err);
    memoryStore = {};
  }
} else {
  console.log("Memory Persistence: No existing store found. Starting fresh.");
}

// Helper: Save to Disk (Sync for MVP safety, can be Async later)
function persistMemory() {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Memory Persistence Error: Failed to save memory to disk.", err);
  }
}

/**
 * Retrieves a snapshot of the user's memory metadata.
 * @param {string} userId 
 * @returns {object|null}
 */
function getUserMemorySnapshot(userId) {
  if (!userId || !memoryStore[userId]) return null;
  return memoryStore[userId];
}

/**
 * Updates the user's memory based on new interaction.
 * @param {object} params { userId, normalizedMessage, context, language, safetyFlag }
 * @returns {object} { memory_delta, current_snapshot }
 */
function updateUserMemory(params) {
  const { userId, normalizedMessage, context, language, safetyFlag } = params;

  if (!userId) return { memory_delta: {} };

  // Initialize if new user
  if (!memoryStore[userId]) {
    memoryStore[userId] = {
      user_id: userId,
      created_at: new Date().toISOString(),
      interaction_count: 0,
      last_topic: null,
      last_emotion_label: null,
      mood_history: [],
      mindscan_log: [] // Specifically for the Daily Ritual
    };
  }

  const userMem = memoryStore[userId];
  userMem.interaction_count++;
  userMem.last_active = new Date().toISOString();

  // Basic Context Updates
  if (normalizedMessage) {
      // In a real semantic engine, we would extract topics here.
      // For MVP, we just store the last message as a naive "topic" placeholder if context implies it.
      if (context !== "mindscan_log") {
        userMem.last_topic = normalizedMessage.substring(0, 50) + (normalizedMessage.length > 50 ? "..." : "");
      }
  }

  // Handle MindScan (Daily Ritual) specifically
  if (context === "mindscan_log") {
      // Add to mood history
      // Format: [Date, Word]
      const entry = { date: new Date().toISOString().split('T')[0], word: normalizedMessage };
      if (!userMem.mindscan_log) userMem.mindscan_log = [];
      userMem.mindscan_log.push(entry);
      
      // Keep only last 30 entries
      if (userMem.mindscan_log.length > 30) userMem.mindscan_log.shift();
      
      // Update mood_history as well for the prompt engine to see
      if (!userMem.mood_history) userMem.mood_history = [];
      userMem.mood_history.push(`[${entry.date}] ${entry.word}`);
      if (userMem.mood_history.length > 7) userMem.mood_history.shift();
  }

  // Save changes to disk immediately
  persistMemory();

  return {
    memory_delta: {
      interaction_count: userMem.interaction_count,
      context_update: context
    },
    current_snapshot: userMem
  };
}

module.exports = {
  getUserMemorySnapshot,
  updateUserMemory
};
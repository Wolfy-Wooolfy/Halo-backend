/**
 * HALO Timeline Engine v0.1
 * Purpose: Captures significant episodic events (Episodes) to form a personal history.
 * * Logic:
 * Not every chat is an episode. An episode is created ONLY if:
 * 1. High Emotion: Crisis, High Stress, or Very High Focus.
 * 2. Life Milestone: Detected via keywords (started job, ended relationship, etc.).
 * 3. Semantic Spike: A dimension score changed significantly (handled by input flag).
 */

const { normalizeMessage } = require("./messageNormalizer");

// Heuristic keywords for life events (Phase 2 MVP)
const EVENT_TRIGGERS = {
  NEW_BEGINNING: ["started", "began", "new job", "promoted", "hired", "birth", "born", "بداية", "بدأت", "شغل جديد", "ترقية", "وظيفة جديدة", "مولود", "ولادة"],
  ENDING: ["quit", "fired", "broke up", "divorced", "died", "passed away", "ended", "استقالة", "رفد", "انفصال", "طلاق", "موت", "وفاة", "خلصت", "سبت الشغل"],
  ACHIEVEMENT: ["graduated", "won", "finished", "completed", "success", "تخرج", "نجاح", "خلصت", "إنجاز", "كسبت"],
  CRISIS: ["accident", "hospital", "emergency", "crash", "lost", "حادثة", "مستشفى", "طوارئ", "مصيبة", "كارثة"]
};

function getInitialTimeline() {
  return [];
}

function detectEventType(text, mood, context) {
  const norm = normalizeMessage(text).toLowerCase();

  // 1. Check Keywords
  for (const [type, keywords] of Object.entries(EVENT_TRIGGERS)) {
    if (keywords.some(k => norm.includes(k))) {
      return type; // e.g., "NEW_BEGINNING"
    }
  }

  // 2. Check Context/Mood intensity
  if (mood === "crisis") return "EMOTIONAL_SPIKE_HIGH";
  if (context === "decision" && mood === "focused") return "MAJOR_DECISION";
  
  return null; // No significant event detected
}

function updateTimeline(currentTimeline, payload) {
  const timeline = Array.isArray(currentTimeline) ? currentTimeline : [];
  const { text, mood, context, dimension } = payload;

  // Step 1: Detect if this is an "Episode"
  const eventType = detectEventType(text, mood, context);

  // If no event detected, return timeline as is (Don't spam the history)
  if (!eventType) {
    return timeline;
  }

  // Step 2: Create Episode Object
  const newEpisode = {
    id: `evt_${Date.now()}`,
    date: new Date().toISOString(),
    type: eventType,
    summary: text.length > 60 ? text.substring(0, 60) + "..." : text, // Simple preview for now
    dimension: dimension || "general",
    mood: mood,
    importance: (eventType === "CRISIS" || eventType === "ENDING") ? "high" : "normal"
  };

  // Step 3: Add to Timeline
  timeline.push(newEpisode);

  // Step 4: Maintenance (Keep only last 50 significant events for Phase 2)
  if (timeline.length > 50) {
    // Remove oldest, keep newest
    return timeline.slice(timeline.length - 50);
  }

  return timeline;
}

module.exports = {
  getInitialTimeline,
  updateTimeline
};
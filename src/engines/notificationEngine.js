const { getUserMemorySnapshot } = require("./memoryEngine");

/**
 * HALO Notification Engine (v0.1)
 * Rules:
 * 1. Stress Follow-up: If last mood was crisis/stressed & time > 4h & time < 12h
 * 2. 24h Inactivity: If time > 24h since last interaction
 * 3. Morning Check-in: If time is morning (8am-11am) & time > 12h since last interaction
 */

function checkNotifications(userId) {
  const memory = getUserMemorySnapshot(userId);
  
  // If no memory exists, no notifications needed yet
  if (!memory || !memory.lastUpdatedAt) {
    return null;
  }

  const now = new Date();
  const lastInteraction = new Date(memory.lastUpdatedAt);
  const diffMs = now - lastInteraction;
  const diffHours = diffMs / (1000 * 60 * 60);
  const currentHour = now.getHours(); // Server local time (0-23)

  // RULE 1: Stress Follow-up (Priority: High)
  // Trigger: User was stressed/crisis, passed 4 hours, less than 12 hours
  if (["crisis", "stressed"].includes(memory.lastMood)) {
    if (diffHours >= 4 && diffHours < 12) {
      return {
        type: "stress_followup",
        priority: "high",
        payload: {
          code: "check_in_stress",
          last_mood: memory.lastMood
        }
      };
    }
  }

  // RULE 2: 24h Inactivity Nudge (Priority: Normal)
  // Trigger: No interaction for > 24 hours
  if (diffHours >= 24) {
    return {
      type: "inactivity_nudge",
      priority: "normal",
      payload: {
        code: "miss_you_24h",
        hours_since: Math.floor(diffHours)
      }
    };
  }

  // RULE 3: Morning Check-in (Priority: Low)
  // Trigger: It is morning (8 AM - 11 AM) AND user hasn't spoken for > 8 hours (overnight)
  // Note: This relies on Server Time for Phase 1.
  if (currentHour >= 8 && currentHour <= 11) {
    if (diffHours > 8) {
      return {
        type: "morning_checkin",
        priority: "low",
        payload: {
          code: "good_morning_ritual"
        }
      };
    }
  }

  return null; // No notifications due
}

module.exports = {
  checkNotifications
};
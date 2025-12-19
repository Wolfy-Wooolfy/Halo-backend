/**
 * HALO Pattern Recognition Engine v0.1
 * Purpose: Detects recurring behavioral patterns based on mood history.
 * Logic:
 * 1. Buckets data by Time (Day of Week, Time of Day).
 * 2. Calculates probability of specific moods in those buckets.
 * 3. Returns "Insight" if confidence > threshold.
 */

const MIN_SAMPLES = 3; // Need at least 3 occurrences to call it a pattern
const CONFIDENCE_THRESHOLD = 0.6; // 60% consistency required

const TIME_OF_DAY = {
  MORNING: { start: 5, end: 11, label: "morning" },
  AFTERNOON: { start: 12, end: 17, label: "afternoon" },
  EVENING: { start: 18, end: 23, label: "evening" },
  NIGHT: { start: 0, end: 4, label: "late_night" }
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getTimeBucket(dateStr) {
  const date = new Date(dateStr);
  const hour = date.getHours();
  const day = DAYS[date.getDay()];
  
  let timeLabel = "night";
  if (hour >= TIME_OF_DAY.MORNING.start && hour <= TIME_OF_DAY.MORNING.end) timeLabel = "morning";
  else if (hour >= TIME_OF_DAY.AFTERNOON.start && hour <= TIME_OF_DAY.AFTERNOON.end) timeLabel = "afternoon";
  else if (hour >= TIME_OF_DAY.EVENING.start && hour <= TIME_OF_DAY.EVENING.end) timeLabel = "evening";
  else timeLabel = "late_night";

  return { day, timeLabel };
}

function analyzePatterns(moodHistory) {
  if (!moodHistory || moodHistory.length < MIN_SAMPLES) return [];

  const patterns = [];
  const buckets = {};

  // 1. Fill Buckets
  moodHistory.forEach(entry => {
    const { day, timeLabel } = getTimeBucket(entry.at);
    const key = `${day}_${timeLabel}`; // e.g., "Monday_morning"
    
    if (!buckets[key]) buckets[key] = { total: 0, moods: {} };
    buckets[key].total++;
    
    const mood = entry.mood || "neutral";
    if (!buckets[key].moods[mood]) buckets[key].moods[mood] = 0;
    buckets[key].moods[mood]++;
  });

  // 2. Analyze Probabilities
  for (const [key, data] of Object.entries(buckets)) {
    if (data.total < MIN_SAMPLES) continue; // Not enough data for this specific time slot

    for (const [mood, count] of Object.entries(data.moods)) {
      if (mood === "neutral") continue; // Ignore neutral patterns for now

      const probability = count / data.total;
      
      if (probability >= CONFIDENCE_THRESHOLD) {
        const [day, time] = key.split("_");
        patterns.push({
          id: `pat_${key}_${mood}`,
          type: "cyclical_mood",
          trigger: `${day} ${time}`, // e.g., "Monday morning"
          effect: mood,              // e.g., "stressed"
          confidence: parseFloat(probability.toFixed(2)),
          lastDetected: new Date().toISOString()
        });
      }
    }
  }

  // Sort by confidence
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

module.exports = {
  analyzePatterns
};
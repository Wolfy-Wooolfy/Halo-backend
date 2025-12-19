/**
 * HALO Semantic Memory Engine v1.2
 * Changes: Added default activation score for mentions to track frequency even in neutral moods.
 */

const { normalizeText } = require("../utils/helpers");

const LIFE_DIMENSIONS = {
  WORK: "work",
  SELF: "self",
  RELATIONSHIPS: "relationships",
  ENERGY: "energy",
  CLARITY: "clarity",
  STRESS: "stress",
  MOTIVATION: "motivation"
};

const EMOTION_MAP = {
  "stressed": "negative",
  "crisis": "negative",
  "uncomfortable": "neutral_negative",
  "neutral": "neutral",
  "focused": "positive",
  "planning": "positive"
};

const DIMENSION_KEYWORDS = {
  [LIFE_DIMENSIONS.WORK]: [
    "shoghl", "work", "job", "boss", "manager", "deadline", "meeting", "career", "salary", "team", "project", "client",
    "شغل", "عمل", "وظيفة", "مدير", "مشروع", "اجتماع", "عميل", "زميل", "ترقية", "راتب", "مرتب", "ديدلاين", "تاسك", "مكتب", "شركة"
  ],
  [LIFE_DIMENSIONS.RELATIONSHIPS]: [
    "family", "friend", "wife", "husband", "kid", "son", "daughter", "love", "hate", "fight", "partner",
    "عيلة", "اهل", "صحاب", "صاحب", "صديق", "مرات", "زوج", "زوجة", "خطيب", "ابن", "بنت", "اولاد", "خناقة", "مشكلة مع", "بحب", "بكره", "علاقة"
  ],
  [LIFE_DIMENSIONS.SELF]: [
    "me", "myself", "feel", "body", "health", "mind", "sleep", "gym", "diet", "habit",
    "انا", "نفسي", "جسمي", "صحتي", "نومي", "تمرين", "جيم", "اكل", "دايت", "عادة", "شكلي", "وزني", "تفكير", "شخصيتي"
  ],
  [LIFE_DIMENSIONS.ENERGY]: [
    "tired", "exhausted", "sleepy", "active", "power", "drained", "lazy",
    "تعبان", "مرهق", "مفرهد", "فصلت", "طاقتي", "مكسل", "عايز انام", "صاحي", "فايق", "نشيط", "همداني"
  ],
  [LIFE_DIMENSIONS.CLARITY]: [
    "confused", "lost", "unsure", "clear", "plan", "goal", "focus",
    "تايه", "مش عارف", "محتار", "مشتت", "تركيز", "خطة", "هدف", "قرار", "فاهم", "واضح", "رؤية"
  ],
  [LIFE_DIMENSIONS.STRESS]: [
    "pressure", "anxiety", "worry", "afraid", "panic", "tight",
    "ضغط", "قلق", "خايف", "رعب", "توتر", "خنقة", "مضغوط", "متوتر", "اعصابي"
  ],
};

function createEmptyGraph() {
  return {
    nodes: [],
    dimensions: {
      [LIFE_DIMENSIONS.WORK]: { score: 0, trend: "stable" },
      [LIFE_DIMENSIONS.SELF]: { score: 0, trend: "stable" },
      [LIFE_DIMENSIONS.RELATIONSHIPS]: { score: 0, trend: "stable" },
      [LIFE_DIMENSIONS.ENERGY]: { score: 0, trend: "stable" },
      [LIFE_DIMENSIONS.CLARITY]: { score: 0, trend: "stable" },
      [LIFE_DIMENSIONS.STRESS]: { score: 0, trend: "stable" },
      [LIFE_DIMENSIONS.MOTIVATION]: { score: 0, trend: "stable" }
    },
    meta: {
      stage: "seed",
      lastAnalysis: new Date().toISOString()
    }
  };
}

function detectDimension(text) {
  const normalized = normalizeText(text);
  for (const [dim, keywords] of Object.entries(DIMENSION_KEYWORDS)) {
    if (keywords.some(k => normalized.includes(k))) {
      return dim;
    }
  }
  return null;
}

function updateSemanticGraph(currentGraph, payload) {
  const graph = currentGraph || createEmptyGraph();
  const { text, context, safety, mood } = payload;
  
  const dimension = detectDimension(text);
  const now = new Date().toISOString();

  if (dimension) {
    const dimData = graph.dimensions[dimension];
    
    // IMPACT SCORE: Emotional weight
    const impact = (mood === "crisis" || mood === "stressed") ? -5 : 
                   (mood === "focused" || mood === "planning") ? +5 : 0;
    
    // ACTIVATION SCORE: Just mentioning it adds importance (+2)
    // This ensures we track "what they talk about" even if mood is neutral.
    const activation = 2; 

    dimData.score = Math.max(0, Math.min(100, dimData.score + impact + activation));
    dimData.lastActive = now;
  }

  if (context && context !== "general") {
    const nodeId = `${dimension || "general"}_${context}`;
    const existingNode = graph.nodes.find(n => n.id === nodeId);

    if (existingNode) {
      existingNode.weight = Math.min(100, existingNode.weight + 5);
      existingNode.recurrence += 1;
      existingNode.lastUpdated = now;
    } else {
      graph.nodes.push({
        id: nodeId,
        type: "SMU",
        label: context,
        dimension: dimension || "general",
        weight: 10,
        recurrence: 1,
        created: now,
        lastUpdated: now
      });
    }
  }

  if (graph.nodes.length > 50) {
    graph.nodes.sort((a, b) => b.weight - a.weight);
    graph.nodes = graph.nodes.slice(0, 50);
  }

  return graph;
}

module.exports = {
  createEmptyGraph,
  updateSemanticGraph,
  LIFE_DIMENSIONS
};
/**
 * HALO Semantic Memory Engine v1.4 (Trust-Enabled)
 * Implements: SMUs, Life Dimensions, Arabic Support, Growth Protocol, Smart Forgetting, Trust Layers
 * Source: HALO - Memory System — Growth + Semantic Engine.md & Human-Centric Memory & Trust Architecture.md
 */

const { normalizeText } = require("../utils/helpers");

// SECTION: Trust Architecture Layers
const TRUST_LEVELS = {
  IDENTITY: "identity",   // Permanent core facts (Name, constants)
  CONTEXTUAL: "context", // High relevance to current situation
  LOGICAL: "logical",    // Inferred patterns from history
  EMOTIONAL: "emotional" // Volatile/State-based, decays fast
};

// SECTION 3.4: Life Dimension Anchors
const LIFE_DIMENSIONS = {
  WORK: "work",
  SELF: "self",
  RELATIONSHIPS: "relationships",
  ENERGY: "energy",
  CLARITY: "clarity",
  STRESS: "stress",
  MOTIVATION: "motivation"
};

// SECTION 6: Memory Growth Protocol (Time-based Stages)
const MEMORY_STAGES = {
  SEED: { id: "seed", label: "Seed Layer", minDays: 0, maxDays: 7 },        // Week 1
  MAP: { id: "map", label: "Initial Map", minDays: 8, maxDays: 21 },        // Weeks 2-3
  HABIT: { id: "habit", label: "Habit Layer", minDays: 22, maxDays: 60 },   // Weeks 4-8
  INSIGHT: { id: "insight", label: "Deep Insight", minDays: 61, maxDays: 99999 } // Day 60+
};

// Arabic & English Keywords (Entry 55 Retention)
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
      [LIFE_DIMENSIONS.WORK]: { score: 0, trend: "stable", lastActive: null },
      [LIFE_DIMENSIONS.SELF]: { score: 0, trend: "stable", lastActive: null },
      [LIFE_DIMENSIONS.RELATIONSHIPS]: { score: 0, trend: "stable", lastActive: null },
      [LIFE_DIMENSIONS.ENERGY]: { score: 0, trend: "stable", lastActive: null },
      [LIFE_DIMENSIONS.CLARITY]: { score: 0, trend: "stable", lastActive: null },
      [LIFE_DIMENSIONS.STRESS]: { score: 0, trend: "stable", lastActive: null },
      [LIFE_DIMENSIONS.MOTIVATION]: { score: 0, trend: "stable", lastActive: null }
    },
    meta: {
      stage: "seed",
      stageLabel: "Seed Layer",
      lastAnalysis: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      globalTrustScore: 50 // Default trust for new profiles
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

function determineStage(createdAt) {
  if (!createdAt) return MEMORY_STAGES.SEED;
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= MEMORY_STAGES.SEED.maxDays) return MEMORY_STAGES.SEED;
  if (diffDays <= MEMORY_STAGES.MAP.maxDays) return MEMORY_STAGES.MAP;
  if (diffDays <= MEMORY_STAGES.HABIT.maxDays) return MEMORY_STAGES.HABIT;
  return MEMORY_STAGES.INSIGHT;
}

/**
 * SECTION 9: Smart Forgetting System (Trust-Enhanced)
 */
function applySmartForgetting(graph) {
  const now = new Date();
  
  // 1. Prune nodes based on weight AND trust level
  graph.nodes = graph.nodes.filter(node => {
    const lastUpdate = new Date(node.lastUpdated);
    const ageDays = (now - lastUpdate) / (1000 * 60 * 60 * 24);
    
    // IDENTITY nodes are never forgotten automatically
    if (node.trustLevel === TRUST_LEVELS.IDENTITY) return true;
    
    // EMOTIONAL nodes decay much faster (3 days threshold)
    const decayThreshold = node.trustLevel === TRUST_LEVELS.EMOTIONAL ? 3 : 7;
    
    if (node.weight < 15 && ageDays > decayThreshold) {
      return false; // Forget weak/old nodes
    }
    return true; 
  });

  // 2. Decay Dimension Scores
  for (const dimKey in graph.dimensions) {
    const dim = graph.dimensions[dimKey];
    if (dim.lastActive) {
      const lastActive = new Date(dim.lastActive);
      const inactivityDays = (now - lastActive) / (1000 * 60 * 60 * 24);
      if (inactivityDays > 3 && dim.score > 0) {
        dim.score = Math.floor(dim.score * 0.9);
      }
    }
  }
  return graph;
}

function updateSemanticGraph(currentGraph, payload) {
  let graph = currentGraph || createEmptyGraph();
  const { text, context, mood, userCreatedAt } = payload;
  const now = new Date().toISOString();

  // 1. Growth Stage
  const currentStage = determineStage(userCreatedAt || graph.meta.createdAt);
  graph.meta.stage = currentStage.id;
  graph.meta.stageLabel = currentStage.label;

  // 2. Dimension Detection
  const dimension = detectDimension(text);
  if (dimension) {
    const dimData = graph.dimensions[dimension];
    const impact = (mood === "crisis" || mood === "stressed") ? -5 : 
                   (mood === "focused" || mood === "planning") ? +5 : 0;
    dimData.score = Math.max(0, Math.min(100, dimData.score + impact + 2));
    dimData.lastActive = now;
  }

  // 3. SMU Node Update with Trust Layers
  if (context && context !== "general") {
    const nodeId = `${dimension || "general"}_${context}`;
    const existingNode = graph.nodes.find(n => n.id === nodeId);

    // Determine trust level based on context type
    let determinedTrust = TRUST_LEVELS.CONTEXTUAL;
    if (context === "identity_fact" || context === "name_mention") determinedTrust = TRUST_LEVELS.IDENTITY;
    if (mood === "crisis" || mood === "stressed") determinedTrust = TRUST_LEVELS.EMOTIONAL;

    if (existingNode) {
      existingNode.weight = Math.min(100, existingNode.weight + 5);
      existingNode.recurrence += 1;
      existingNode.lastUpdated = now;
      
      // Promotion: Emotional observations that repeat 5+ times become Logical patterns
      if (existingNode.recurrence > 5 && existingNode.trustLevel === TRUST_LEVELS.EMOTIONAL) {
        existingNode.trustLevel = TRUST_LEVELS.LOGICAL;
      }
    } else {
      graph.nodes.push({
        id: nodeId,
        type: "SMU",
        label: context,
        dimension: dimension || "general",
        weight: 10, 
        trustLevel: determinedTrust,
        recurrence: 1,
        created: now,
        lastUpdated: now
      });
    }
  }

  // 4. Maintenance
  graph = applySmartForgetting(graph);

  if (graph.nodes.length > 50) {
    graph.nodes.sort((a, b) => b.weight - a.weight);
    graph.nodes = graph.nodes.slice(0, 50);
  }

  graph.meta.lastAnalysis = now;
  return graph;
}

module.exports = {
  createEmptyGraph,
  updateSemanticGraph,
  LIFE_DIMENSIONS,
  TRUST_LEVELS
};
const { normalizeMessage } = require("./messageNormalizer");
const KEYWORDS = require("../utils/constants");

function normalizeForClassification(text) {
  if (!text) return '';
  // Use central normalizer first, then lowercase for keyword matching
  return normalizeMessage(text).toLowerCase();
}

function containsAny(text, keywords) {
  if (!Array.isArray(keywords)) return false;
  for (let i = 0; i < keywords.length; i++) {
    if (text.includes(keywords[i])) {
      return true;
    }
  }
  return false;
}

function classifyMessage(rawText) {
  const normalized = normalizeForClassification(rawText);
  const length = normalized.length;

  if (!normalized || length === 0) {
    return {
      category: 'unclear',
      isHighStress: false,
      messageLength: 0
    };
  }

  // Combine AR and EN stress markers for broad classification using Central Constants
  // This ensures consistency with RoutingEngine which uses the same source
  const emotionalWords = [...KEYWORDS.STRESS.ar, ...KEYWORDS.STRESS.en];
  
  const decisionWords = KEYWORDS.DECISION;
  const greetingWords = KEYWORDS.GREETINGS;

  const isGreeting = containsAny(normalized, greetingWords) && length < 60;
  const hasEmotional = containsAny(normalized, emotionalWords);
  const hasDecision = containsAny(normalized, decisionWords);

  if (hasEmotional && length > 40) {
    return {
      category: 'high_stress',
      isHighStress: true,
      messageLength: length
    };
  }

  if (hasEmotional && length <= 40) {
    return {
      category: 'emotional_discomfort',
      isHighStress: false,
      messageLength: length
    };
  }

  if (hasDecision) {
    return {
      category: 'decision_making',
      isHighStress: false,
      messageLength: length
    };
  }

  if (isGreeting) {
    return {
      category: 'casual_conversation',
      isHighStress: false,
      messageLength: length
    };
  }

  if (length > 600) {
    return {
      category: 'high_stress',
      isHighStress: true,
      messageLength: length
    };
  }

  if (length > 200) {
    return {
      category: 'low_stress',
      isHighStress: false,
      messageLength: length
    };
  }

  return {
    category: 'low_stress',
    isHighStress: false,
    messageLength: length
  };
}

module.exports = {
  classifyMessage
};
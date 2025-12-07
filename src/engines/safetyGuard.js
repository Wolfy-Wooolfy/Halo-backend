// backend/engines/safetyGuard.js

const HIGH_RISK_KEYWORDS = {
  self_harm: [
    'انتحر',
    'انتحار',
    'اموت',
    'عايز اموت',
    'مش عايز اعيش',
    'suicide',
    'kill myself',
    'end my life'
  ],
  harm_others: [
    'اقتله',
    'هقتله',
    'أقتل حد',
    'kill him',
    'kill her',
    'hurt someone'
  ],
  panic_attack: [
    'نهجان',
    'مش عارف أتنفس',
    'مش قادر أتنفس',
    'panic attack',
    'قلبي بيدق بسرعة',
    'خنقة قوية'
  ],
  trauma: [
    'اغتصاب',
    'تحرش',
    'اعتداء',
    'rape',
    'abuse',
    'molested'
  ],
  sexual: [
    'جنس',
    'جنسي',
    'إباحية',
    'porn',
    'sex',
    'nude'
  ],
  medical_emergency: [
    'نزيف',
    'bleeding',
    'اغمى علي',
    'fainted',
    'سكر عالي',
    'pressure very high',
    'جلطة',
    'stroke',
    'heart attack'
  ]
};

function detectCategory(normalizedMessage) {
  const text = (normalizedMessage || '').toLowerCase();
  const matches = [];
  let triggeredCategory = null;

  for (const [category, words] of Object.entries(HIGH_RISK_KEYWORDS)) {
    for (const word of words) {
      if (text.includes(word.toLowerCase())) {
        matches.push(word);
        if (!triggeredCategory) {
          triggeredCategory = category;
        }
      }
    }
  }

  if (!triggeredCategory) {
    return {
      isHighRisk: false,
      category: 'none',
      level: 'none',
      matchedKeywords: []
    };
  }

  return {
    isHighRisk: true,
    category: triggeredCategory,
    level: 'high',
    matchedKeywords: matches
  };
}

function safetyGuard(normalizedMessage, contextInfo) {
  const base = detectCategory(normalizedMessage);
  const contextCategory =
    contextInfo && contextInfo.category ? contextInfo.category : null;

  const isContextHighStress =
    contextCategory === 'high_stress' || contextCategory === 'emotional_discomfort';

  if (!base.isHighRisk && isContextHighStress) {
    return {
      isHighRisk: true,
      category: 'emotional_high_stress',
      level: 'medium',
      matchedKeywords: [],
      flag: 'high_stress'
    };
  }

  if (base.isHighRisk) {
    return {
      isHighRisk: true,
      category: base.category,
      level: base.level,
      matchedKeywords: base.matchedKeywords,
      flag: 'high_risk'
    };
  }

  return {
    isHighRisk: false,
    category: 'none',
    level: 'none',
    matchedKeywords: [],
    flag: 'none'
  };
}

module.exports = safetyGuard;

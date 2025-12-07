function normalizeForClassification(text) {
  if (!text) {
    return '';
  }
  let t = text;
  if (typeof t !== 'string') {
    t = String(t);
  }
  return t.toLowerCase();
}

function containsAny(text, keywords) {
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

  const emotionalWords = [
    'tired',
    'exhausted',
    'overwhelmed',
    'burnout',
    'anxiety',
    'anxious',
    'lost',
    'depressed',
    'scared',
    'afraid',
    'pressure',
    'stressed',
    'تعبان',
    'مرهق',
    'مخنوق',
    'متضايق',
    'تايه',
    'قلقان',
    'خايف',
    'مكتئب',
    'مش قادر',
    'كله فوق دماغي'
  ];

  const decisionWords = [
    'decide',
    'decision',
    'choice',
    'choose',
    'should i',
    'اعمل ايه',
    'اعمل ايه؟',
    'اعمل ايه انا',
    'اعمل ايه دلوقتي',
    'اختر',
    'اختار',
    'قرار',
    'اختيار'
  ];

  const greetingWords = [
    'hi',
    'hello',
    'hey',
    'السلام',
    'سلام',
    'ازيك',
    'ازيك؟',
    'ازيكم',
    'اهلا',
    'اهلاً',
    'مرحبا',
    'مرحبا'
  ];

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

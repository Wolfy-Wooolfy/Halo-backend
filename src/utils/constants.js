/**
 * UNIFIED CONSTANTS - Single Source of Truth for Keywords
 * Consolidates logic from RoutingEngine and ContextClassifier
 */

const KEYWORDS = {
  // QUESTIONS STARTING WORDS (From RoutingEngine)
  QUESTIONS: {
    ar: [
      "ايه", "إيه", "ليه", "لِيه", "ازاي", "إزاي", "امتى", "إمتى", "فين", "مين", 
      "هل", "شو", "ليش", "وين", "قديش", "متى", "كيف", "لماذا"
    ],
    en: [
      "what", "why", "how", "when", "where", "who", "which", 
      "can you", "could you", "should i", "do i", "is it", "are you"
    ]
  },

  // STRESS & EMOTION MARKERS (Merged from RoutingEngine + ContextClassifier)
  STRESS: {
    ar: [
      // From RoutingEngine
      "متوتر", "قلقان", "خايف", "مش قادر", "مش عارف", 
      "مش عارف أنام", "مش عارف انام", "مضغوط", "ضغط", "تعبان", "مرهق", 
      "حاسس", "مأثر", "ماثر", "مش مركز", "مش قادر اركز", "مش قادر أركز", 
      "مش بنام", "أرق", "ارق", "توتر",
      // From ContextClassifier (Additions)
      "مخنوق", "متضايق", "تايه", "مكتئب", "كله فوق دماغي"
    ],
    en: [
      // From RoutingEngine
      "anxious", "stressed", "worried", "can't sleep", "cannot sleep", "insomnia", 
      "tired", "overwhelmed", "i can't", "i cannot", "i don't know", 
      "i’m not sure", "affecting my work",
      // From ContextClassifier (Additions)
      "exhausted", "burnout", "anxiety", "lost", "depressed", "scared", "afraid", "pressure"
    ]
  },

  // TOPIC MARKERS (From RoutingEngine)
  TOPICS: {
    WORK: {
      ar: ["شغل", "عمل", "وظيفة", "شركة", "مدير", "مشروع", "تاسك", "كارير", "مأثر على شغلي", "ماثر على شغلي"],
      en: ["work", "job", "career", "boss", "company", "project", "task"]
    },
    RELATIONSHIPS: {
      ar: ["زوج", "مراتي", "علاقة", "خطيب", "خطيبة", "أهلي", "صاحب", "صديقة", "فراق", "مشاعر", "بيت"],
      en: ["relationship", "partner", "spouse", "family", "friend", "breakup", "love"]
    },
    SELF: {
      ar: ["نوم", "صحة", "جيم", "تركيز", "عادة", "قلق", "توتر", "اكتئاب"],
      en: ["sleep", "health", "focus", "habit", "anxiety", "stress", "depression"]
    }
  },

  // DECISION MARKERS (From ContextClassifier)
  DECISION: [
    'decide', 'decision', 'choice', 'choose', 'should i', 
    'اعمل ايه', 'اعمل ايه؟', 'اعمل ايه انا', 'اعمل ايه دلوقتي', 
    'اختر', 'اختار', 'قرار', 'اختيار'
  ],

  // GREETINGS (From ContextClassifier)
  GREETINGS: [
    'hi', 'hello', 'hey', 
    'السلام', 'سلام', 'ازيك', 'ازيك؟', 'ازيكم', 
    'اهلا', 'اهلاً', 'مرحبا', 'مرحبا'
  ]
};

module.exports = KEYWORDS;
const { getUserMemorySnapshot } = require("../engines/memoryEngine");

function normalizeText(s) {
  return String(s || "").trim();
}

function parseLanguageVariant(language) {
  const raw = normalizeText(language).toLowerCase();
  if (!raw) {
    return { base: "en", variant: "en", raw: "en" };
  }

  if (raw === "ar" || raw.startsWith("arabic")) {
    const variant = raw === "ar" || raw === "arabic" ? "arabic" : raw;
    return { base: "ar", variant, raw };
  }

  if (raw === "en" || raw.startsWith("english")) {
    const variant = raw === "en" || raw === "english" ? "english" : raw;
    return { base: "en", variant, raw };
  }

  if (raw.includes("-")) {
    const base = raw.split("-")[0];
    return { base, variant: raw, raw };
  }

  return { base: raw, variant: raw, raw };
}

function isArabicBase(language) {
  const info = parseLanguageVariant(language);
  if (info.base === "ar") return true;
  if (info.variant.startsWith("arabic")) return true;
  if (info.raw === "ar") return true;
  return false;
}

function buildDialectStyleInstruction(languageVariant) {
  const v = normalizeText(languageVariant).toLowerCase();
  if (!v) {
    return "Match the user's language and dialect exactly as they write.";
  }

  const isArabic = v === "ar" || v.startsWith("arabic") || v.startsWith("ar-");
  const isEnglish = v === "en" || v.startsWith("english") || v.startsWith("en-");

  if (isArabic) {
    if (v.includes("eg") || v.includes("egypt")) {
      return "اكتب باللهجة المصرية وبنفس أسلوب المستخدم (مش فصحى).";
    }
    if (v.includes("gulf") || v.includes("sa") || v.includes("ksa") || v.includes("uae") || v.includes("kw") || v.includes("qa") || v.includes("bh") || v.includes("om")) {
      return "اكتب باللهجة الخليجية (السعودية/الخليج) وبنفس أسلوب المستخدم (مش فصحى).";
    }
    if (v.includes("levant") || v.includes("sy") || v.includes("lb") || v.includes("jo") || v.includes("ps")) {
      return "اكتب باللهجة الشامية (سوري/لبناني/أردني/فلسطيني) وبنفس أسلوب المستخدم (مش فصحى).";
    }
    if (v.includes("ma") || v.includes("dz") || v.includes("tn") || v.includes("ly") || v.includes("maghreb") || v.includes("morocco") || v.includes("algeria") || v.includes("tunisia") || v.includes("libya")) {
      return "اكتب باللهجة المغاربية/شمال أفريقيا حسب بلد المستخدم وبنفس أسلوبه (مش فصحى).";
    }
    if (v.includes("msa") || v.includes("modern") || v.includes("standard") || v.includes("fusha")) {
      return "اكتب بالعربية الفصحى المبسطة فقط.";
    }
    return "اكتب بنفس لهجة المستخدم العربية كما يكتبها، وتجنب الفصحى إلا لو المستخدم كتب فصحى.";
  }

  if (isEnglish) {
    if (v.includes("us") || v.includes("american")) {
      return "Write in natural American English matching the user's tone and dialect.";
    }
    if (v.includes("uk") || v.includes("british")) {
      return "Write in natural British English matching the user's tone and dialect.";
    }
    if (v.includes("in") || v.includes("india") || v.includes("indian")) {
      return "Write in natural Indian English matching the user's tone and dialect.";
    }
    if (v.includes("ca") || v.includes("canada") || v.includes("canadian")) {
      return "Write in natural Canadian English matching the user's tone and dialect.";
    }
    if (v.includes("af") || v.includes("africa") || v.includes("nigeria") || v.includes("kenya") || v.includes("south-africa")) {
      return "Write in natural African English matching the user's tone and dialect.";
    }
    return "Write in the same English dialect and style the user is using.";
  }

  return "Match the user's language and dialect exactly as they write, including regional style and wording.";
}

function buildSystemDirective(language) {
  const isArabic = isArabicBase(language);
  const langInfo = parseLanguageVariant(language);
  const style = buildDialectStyleInstruction(langInfo.variant);

  if (isArabic) {
    return [
      "انت HALO، طبقة عقل خارجية هدفها تخفيف الحمل الذهني عن المستخدم.",
      "لست معالجًا نفسيًا، ولا كوتش، ولا صديقًا، ولا مستشارًا.",
      "دورك هو فهم ما يقوله المستخدم بأقل قدر ممكن من التفاصيل، وتقديم خطوة صغيرة واحدة فقط تساعده يتحرك للأمام.",
      "حافظ دائمًا على نبرة هادئة، مختصرة، ثابتة، داعمة، ومحايدة.",
      "لا تفسر طفولة، ولا تشخص اضطرابات نفسية، ولا تحلل ماضي المستخدم، ولا تستخدم لغة علاجية أو تشخيص.",
      style
    ].join(" ");
  }

  return [
    "You are HALO, an external mind layer designed to reduce the user's cognitive load.",
    "You are not a therapist, not a coach, not a friend, and not a problem-solver.",
    "Your role is to understand the user with minimal input, reduce pressure, and provide one small step forward.",
    "Keep your tone calm, concise, steady, supportive, and neutral.",
    "Do not interpret trauma, do not diagnose, and do not use therapeutic language or psychological analysis.",
    style
  ].join(" ");
}

function buildBehaviorLayer(language) {
  const isArabic = isArabicBase(language);

  if (isArabic) {
    return [
      "قواعد السلوك:",
      "الرد دائمًا يكون في صورة ثلاث مكوّنات فقط: انعكاس قصير، سؤال توضيحي واحد، وخطوة صغيرة جدًا.",
      "كل مكوّن يكون في جملة قصيرة واحدة فقط.",
      "ممنوع فقرات طويلة أو خطط متعددة الخطوات أو نصائح مطولة.",
      "لا تشرح أسباب المشاعر ولا تحاول إصلاح حياة المستخدم، فقط خطوة صغيرة واحدة."
    ].join(" ");
  }

  return [
    "Behavior rules:",
    "Your reply must always contain exactly three components: a short reflection, one clarifying question, and one very small micro-step.",
    "Each component must be a single short sentence.",
    "Do not write long paragraphs, do not provide multi-step plans, and do not offer extended advice.",
    "Do not explain the causes of feelings or try to fix the user's life. Only offer one tiny next move."
  ].join(" ");
}

function buildSafetyLayer(safety, context, language) {
  const isArabic = isArabicBase(language);
  const flag = safety && safety.flag ? safety.flag : "none";
  const isHighRisk = safety && safety.isHighRisk;

  if (isArabic) {
    if (isHighRisk || flag === "high_risk") {
      return [
        "وضع الأمان:",
        "اعتبر أن المستخدم في حالة حساسة أو خطرة.",
        "قلل العمق تمامًا، تجنب أي نصائح أو قرارات كبيرة.",
        "استخدم انعكاس بسيط، سؤال توضيحي خفيف، وخطوة تهدئة أو تنظيم بسيطة فقط.",
        "لا تذكر أدوية أو تشخيصات أو تعليمات طبية."
      ].join(" ");
    }

    if (flag === "high_stress" || context === "high_stress" || context === "emotional_discomfort") {
      return [
        "وضع الأمان:",
        "اعتبر أن المستخدم تحت ضغط أو توتر مرتفع.",
        "حافظ على رد مختصر جدًا، هادئ، ومطمئن.",
        "تجنب القرارات الكبيرة أو الأسئلة المعقدة، وركز على خطوة صغيرة سهلة."
      ].join(" ");
    }

    return [
      "وضع الأمان:",
      "لا توجد إشارات خطورة عالية في الرسالة.",
      "حافظ على بساطة الرد وتجنب الكلام العميق أو الحساس."
    ].join(" ");
  }

  if (isHighRisk || flag === "high_risk") {
    return [
      "Safety mode:",
      "Assume the user may be in a sensitive or high-risk emotional state.",
      "Reduce depth, avoid giving advice or big decisions, and keep the reply very light.",
      "Use one reflection, one gentle question, and one grounding micro-step only.",
      "Do not mention medication, diagnoses, or medical instructions."
    ].join(" ");
  }

  if (flag === "high_stress" || context === "high_stress" || context === "emotional_discomfort") {
    return [
      "Safety mode:",
      "Assume the user is under noticeable stress.",
      "Keep the reply short, calm, and simple.",
      "Do not push for heavy decisions. Focus on one small, low-pressure step."
    ].join(" ");
  }

  return [
    "Safety mode:",
    "No high-risk signals are detected, but you must still keep the reply minimal, safe, and emotionally neutral-supportive.",
    "Avoid deep analysis or sensitive topics."
  ].join(" ");
}

function buildMemorySummaryFromSnapshot(memory, language) {
  const isArabic = isArabicBase(language);

  if (!memory) {
    if (isArabic) {
      return "لا توجد ذاكرة سابقة متاحة تقريبًا. اعتبر أن هذه من أولى المحادثات مع المستخدم، ولا تفترض تفاصيل أو تاريخ.";
    }
    return "Very little previous memory is available. Treat this as one of the first interactions; do not assume any detailed history.";
  }

  const parts = [];
  const lastTopic = memory.last_topic || memory.lastTopic;
  const lastEmotion = memory.last_emotion_label || memory.lastEmotionLabel;
  const energy = memory.energy_level || memory.energyLevel;
  const engagement = memory.engagement_style || memory.engagementStyle;
  const moodTrend = memory.mood_7_days || memory.mood7days || memory.mood_history;

  if (isArabic) {
    if (lastTopic) parts.push("آخر موضوع ظاهر في الذاكرة: " + String(lastTopic));
    if (lastEmotion) parts.push("آخر حالة شعورية مسجلة: " + String(lastEmotion));
    if (energy) parts.push("مستوى الطاقة التقريبي: " + String(energy));
    if (engagement) parts.push("أسلوب التفاعل الغالب: " + String(engagement));
    if (Array.isArray(moodTrend) && moodTrend.length > 0) parts.push("توجه المزاج السابق (مبسط): " + moodTrend.join(", "));
    if (parts.length === 0) return "الذاكرة الحالية خفيفة جدًا. ركز على الحاضر فقط بدون افتراضات.";
    return "ملخص سياق المستخدم (من الذاكرة الميتاداتية):\n- " + parts.join("\n- ");
  }

  if (lastTopic) parts.push("Last topic: " + String(lastTopic));
  if (lastEmotion) parts.push("Last emotion label: " + String(lastEmotion));
  if (energy) parts.push("Approximate energy level: " + String(energy));
  if (engagement) parts.push("Interaction style: " + String(engagement));
  if (Array.isArray(moodTrend) && moodTrend.length > 0) parts.push("Recent mood trend (simplified): " + moodTrend.join(", "));
  if (parts.length === 0) return "Current memory is very light. Focus on the present moment only.";
  return "User context summary (from metadata-only memory):\n- " + parts.join("\n- ");
}

function buildTaskSection(language) {
  const isArabic = isArabicBase(language);

  if (isArabic) {
    return [
      "المهمة:",
      "اقرأ رسالة المستخدم جيدًا، وافهم حالته الحالية بأبسط صورة ممكنة.",
      "بعد ذلك، لا تكتب ردًا نصيًا عاديًا، ولكن أرجِع ناتجًا في صورة كائن JSON فقط.",
      "هذا الـ JSON يجب أن يحتوي بالضبط على ثلاثة مفاتيح نصية:",
      "reflection, question, micro_step",
      "كل مفتاح يحتوي على جملة قصيرة واحدة فقط بنفس لهجة المستخدم."
    ].join(" ");
  }

  return [
    "Task:",
    "Read the user's message carefully and understand their current state in the simplest possible way.",
    "Then do NOT write a normal textual reply. Instead, return a JSON object only.",
    "This JSON must contain exactly three string fields:",
    "reflection, question, micro_step",
    "Each field must be one short sentence in the same dialect/style the user is using."
  ].join(" ");
}

function buildOutputFormatSection(language) {
  const isArabic = isArabicBase(language);

  if (isArabic) {
    return [
      "تنسيق المخرج:",
      "أرجِع كائن JSON واحد فقط بدون أي نص قبلَه أو بعدَه.",
      '{ "reflection": "جملة واحدة قصيرة تعكس ما قاله المستخدم.", "question": "سؤال توضيحي واحد قصير.", "micro_step": "خطوة صغيرة جدًا يمكن تنفيذها الآن." }',
      "ممنوع إضافة أي مفاتيح أخرى.",
      "ممنوع إضافة أي نص خارج كائن الـ JSON."
    ].join(" ");
  }

  return [
    "Output format:",
    "Return a single JSON object only, with no text before or after it.",
    '{ "reflection": "One short sentence reflecting the user.", "question": "One short clarifying question.", "micro_step": "One very small step the user can take now." }',
    "Do not add any other keys.",
    "Do not add any text outside the JSON object."
  ].join(" ");
}

function buildUserMessageBlock(message, language) {
  const safeMessage = typeof message === "string" ? message : "";
  const isArabic = isArabicBase(language);
  if (isArabic) return 'رسالة المستخدم الأصلية:\n"' + safeMessage + '"';
  return 'User message:\n"' + safeMessage + '"';
}

function buildHaloPrompt(options) {
  const message = options && options.message ? options.message : "";
  const language = options && options.language ? options.language : "en";
  const context = options && options.context ? options.context : "";
  const safety = options && options.safety ? options.safety : null;

  let memorySnapshot = null;
  if (options && options.memory_snapshot) {
    memorySnapshot = options.memory_snapshot;
  } else if (options && options.user_id && getUserMemorySnapshot) {
    try {
      memorySnapshot = getUserMemorySnapshot(options.user_id);
    } catch (e) {
      memorySnapshot = null;
    }
  }

  const systemDirective = buildSystemDirective(language);
  const behaviorLayer = buildBehaviorLayer(language);
  const safetyLayer = buildSafetyLayer(safety, context, language);
  const memorySummary = buildMemorySummaryFromSnapshot(memorySnapshot, language);
  const taskSection = buildTaskSection(language);
  const outputFormatSection = buildOutputFormatSection(language);
  const userBlock = buildUserMessageBlock(message, language);

  const sections = [];
  sections.push("SYSTEM:");
  sections.push(systemDirective);
  sections.push("");
  sections.push("BEHAVIOR:");
  sections.push(behaviorLayer);
  sections.push("");
  sections.push("SAFETY:");
  sections.push(safetyLayer);
  sections.push("");
  sections.push("MEMORY:");
  sections.push(memorySummary);
  sections.push("");
  sections.push("TASK:");
  sections.push(taskSection);
  sections.push("");
  sections.push("OUTPUT FORMAT:");
  sections.push(outputFormatSection);
  sections.push("");
  sections.push(userBlock);

  return sections.join("\n");
}

module.exports = {
  buildHaloPrompt
};

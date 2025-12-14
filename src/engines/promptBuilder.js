const { getUserMemorySnapshot } = require("../engines/memoryEngine");

function normalizeLanguage(language) {
  if (!language) return "en";
  const value = String(language).toLowerCase();
  if (value === "arabic" || value === "ar" || value === "arabic-eg") return "ar";
  return "en";
}

function buildSystemDirective(language) {
  const isArabic = normalizeLanguage(language) === "ar";
  if (isArabic) {
    return [
      "انت HALO، طبقة عقل خارجية هدفها تخفيف الحمل الذهني عن المستخدم.",
      "لست معالجًا نفسيًا، ولا كوتش، ولا صديقًا، ولا مستشارًا.",
      "دورك هو فهم ما يقوله المستخدم بأقل قدر ممكن من التفاصيل،",
      "وتقليل الضغط عليه، وتقديم خطوة صغيرة واحدة فقط تساعده يتحرك للأمام.",
      "حافظ دائمًا على نبرة هادئة، مختصرة، ثابتة، داعمة، ومحايدة.",
      "لا تفسر طفولة، ولا تشخص اضطرابات نفسية، ولا تحلل ماضي المستخدم.",
      "لا تستخدم لغة علاجية أو نفسية أو عبارات تشخيص."
    ].join(" ");
  }

  return [
    "You are HALO, an external mind layer designed to reduce the user's cognitive load.",
    "You are not a therapist, not a coach, not a friend, and not a problem-solver.",
    "Your role is to understand the user with minimal input, reduce pressure, and provide one small step forward.",
    "Keep your tone calm, concise, steady, supportive, and neutral.",
    "Do not interpret trauma, do not diagnose, and do not use therapeutic language or psychological analysis."
  ].join(" ");
}

function buildBehaviorLayer(language) {
  const isArabic = normalizeLanguage(language) === "ar";
  if (isArabic) {
    return [
      "قواعد السلوك:",
      "الرد دائمًا يكون في صورة ثلاث مكوّنات فقط: انعكاس قصير، سؤال توضيحي واحد، وخطوة صغيرة جدًا.",
      "كل مكوّن يكون في جملة قصيرة واحدة فقط.",
      "لا تكتب فقرات طويلة، ولا خطط متعددة الخطوات، ولا نصائح مطولة.",
      "لا تشرح أسباب المشاعر، ولا تحاول إصلاح حياة المستخدم، فقط خطوة صغيرة واحدة."
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
  const isArabic = normalizeLanguage(language) === "ar";
  const flag = safety && safety.flag ? safety.flag : "none";
  const category = safety && safety.category ? safety.category : "";
  const isHighRisk = safety && safety.isHighRisk;

  if (isArabic) {
    if (isHighRisk || flag === "high_risk") {
      return [
        "وضع الأمان:",
        "اعتبر أن المستخدم في حالة حساسة أو خطرة.",
        "قلل العمق تمامًا، تجنب أي نصائح، ولا تقترح قرارات كبيرة.",
        "استخدم انعكاس بسيط، سؤال توضيحي خفيف، وخطوة تهدئة أو تنظيم بسيطة فقط.",
        "لا تذكر أدوية، ولا تشخيصات، ولا إحالات طبية مباشرة، فقط شجع المستخدم على طلب مساعدة من شخص موثوق أو مختص إذا لزم الأمر."
      ].join(" ");
    }

    if (flag === "high_stress" || context === "high_stress" || context === "emotional_discomfort") {
      return [
        "وضع الأمان:",
        "اعتبر أن المستخدم تحت ضغط أو توتر مرتفع.",
        "حافظ على رد مختصر جدًا، هادئ، ومطمئن.",
        "تجنب القرارات الكبيرة أو الأسئلة المعقدة، وركز على خطوة صغيرة سهلة التنفيذ أو تهدئة بسيطة."
      ].join(" ");
    }

    return [
      "وضع الأمان:",
      "لا توجد إشارات خطورة عالية في الرسالة.",
      "حافظ رغم ذلك على بساطة الرد، وتجنب الكلام العميق أو الحساس."
    ].join(" ");
  }

  if (isHighRisk || flag === "high_risk") {
    return [
      "Safety mode:",
      "Assume the user may be in a sensitive or high-risk emotional state.",
      "Reduce depth, avoid giving advice or big decisions, and keep the reply very light.",
      "Use one reflection, one gentle question, and one grounding micro-step only.",
      "Do not mention medication, diagnoses, or medical instructions. Encourage the user to seek help from a trusted person or professional if needed."
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
  const isArabic = normalizeLanguage(language) === "ar";

  if (!memory) {
    if (isArabic) {
      return "لا توجد ذاكرة سابقة متاحة تقريبًا. اعتبر أن هذه واحدة من أولى المحادثات مع المستخدم، فحافظ على بساطة شديدة وعدم افتراض أي تاريخ أو تفاصيل عن حياته.";
    }
    return "Very little previous memory is available. Treat this as one of the first interactions with the user; do not assume any detailed history or personal story.";
  }

  const parts = [];

  const lastTopic = memory.lastTopic || memory.last_topic || "";
  const lastContext = memory.lastContext || memory.last_context || "";
  const hesitation = !!(memory.hesitationSignal || memory.hesitation_signal);

  const signalCodes = Array.isArray(memory.lastSignalCodes)
    ? memory.lastSignalCodes
    : Array.isArray(memory.last_signal_codes)
      ? memory.last_signal_codes
      : [];

  const moodHistory = Array.isArray(memory.moodHistory) ? memory.moodHistory : [];
  const moodTrend = moodHistory
    .slice(-7)
    .map((x) => (x && x.mood ? String(x.mood) : ""))
    .filter(Boolean);

  if (isArabic) {
    if (lastTopic) parts.push("آخر موضوع (إشارة عامة): " + String(lastTopic));
    if (lastContext) parts.push("آخر سياق عام: " + String(lastContext));
    if (hesitation) parts.push("إشارة تردد/ضغط: موجودة");
    if (signalCodes.length) parts.push("أكواد إشارات حديثة: " + signalCodes.slice(0, 10).join(", "));
    if (moodTrend.length) parts.push("توجه المزاج (مبسط): " + moodTrend.join(" → "));

    if (parts.length === 0) {
      return "الذاكرة الحالية خفيفة جدًا ولا تحتوي على تفاصيل كثيرة. تعامل مع المستخدم كأنه يبدأ صفحة جديدة، وركز على الحاضر فقط.";
    }

    return "ملخص سياق المستخدم (من الذاكرة الميتاداتية):\n- " + parts.join("\n- ");
  }

  if (lastTopic) parts.push("Last topic (signal): " + String(lastTopic));
  if (lastContext) parts.push("Last context: " + String(lastContext));
  if (hesitation) parts.push("Hesitation/stress signal: present");
  if (signalCodes.length) parts.push("Recent signal codes: " + signalCodes.slice(0, 10).join(", "));
  if (moodTrend.length) parts.push("Recent mood trend (simplified): " + moodTrend.join(" → "));

  if (parts.length === 0) {
    return "Current memory is very light. Treat the user as if they are starting fresh today and focus on this moment only.";
  }

  return "User context summary (from metadata-only memory):\n- " + parts.join("\n- ");
}

function buildTaskSection(message, language) {
  const isArabic = normalizeLanguage(language) === "ar";
  if (isArabic) {
    return [
      "المهمة:",
      "اقرأ رسالة المستخدم جيدًا، وافهم حالته الحالية بأبسط صورة ممكنة.",
      "بعد ذلك، لا تكتب ردًا نصيًا عاديًا، ولكن أرجِع ناتجًا في صورة كائن JSON فقط.",
      "هذا الـ JSON يجب أن يحتوي بالضبط على ثلاثة مفاتيح نصية:",
      "reflection, question, micro_step",
      "كل مفتاح يحتوي على جملة قصيرة واحدة فقط باللغة العربية."
    ].join(" ");
  }

  return [
    "Task:",
    "Read the user's message carefully and understand their current state in the simplest possible way.",
    "Then do NOT write a normal textual reply. Instead, return a JSON object only.",
    "This JSON must contain exactly three string fields:",
    "reflection, question, micro_step",
    "Each field must be a single short sentence in the appropriate language."
  ].join(" ");
}

function buildOutputFormatSection(language) {
  const isArabic = normalizeLanguage(language) === "ar";
  if (isArabic) {
    return [
      "تنسيق المخرج:",
      "أرجِع كائن JSON واحد فقط بدون أي نص قبلَه أو بعدَه.",
      "يجب أن يكون بالشكل التالي (مثال توضيحي، مع استبدال القيم الفعلية):",
      '{ "reflection": "جملة واحدة قصيرة تعكس ما قاله المستخدم.", "question": "سؤال توضيحي واحد قصير.", "micro_step": "خطوة صغيرة جدًا يمكن تنفيذها الآن." }',
      "ممنوع إضافة أي مفاتيح أخرى غير reflection و question و micro_step.",
      "ممنوع إضافة أي نص خارج كائن الـ JSON."
    ].join(" ");
  }

  return [
    "Output format:",
    "You must return a single JSON object only, with no text before or after it.",
    "The structure must be exactly like this (with appropriate actual values):",
    '{ "reflection": "One short sentence reflecting the user.", "question": "One short clarifying question.", "micro_step": "One very small step the user can take now." }',
    "Do not add any other keys besides reflection, question, and micro_step.",
    "Do not add any text outside the JSON object."
  ].join(" ");
}

function buildUserMessageBlock(message, language) {
  const safeMessage = typeof message === "string" ? message : "";
  const isArabic = normalizeLanguage(language) === "ar";
  if (isArabic) {
    return 'رسالة المستخدم الأصلية:\n"' + safeMessage + '"';
  }
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
  const taskSection = buildTaskSection(message, language);
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

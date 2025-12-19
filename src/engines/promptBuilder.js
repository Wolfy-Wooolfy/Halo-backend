const { getUserMemorySnapshot } = require("../engines/memoryEngine");
const { resolveLanguageCode, extractLanguageVariant } = require("../engines/languageDetector");
const { normalizeMessage } = require("../engines/messageNormalizer");

// REMOVED: normalizeText (Use messageNormalizer)
// REMOVED: parseLanguageVariant, isArabicBase (Use languageDetector)

function buildDialectStyleInstruction(languageVariant) {
  const v = normalizeMessage(languageVariant).toLowerCase();
  
  // Base detection logic using the variant string directly
  const isArabic = v === "ar" || v.startsWith("arabic") || v.startsWith("ar-");
  const isEnglish = v === "en" || v.startsWith("english") || v.startsWith("en-");

  if (isArabic) {
    // 1. Explicit Dialect Overrides
    if (v.includes("eg") || v.includes("egypt")) {
      return "تعليمات اللهجة (صارمة): تكلم مصري عامي صميم (Egyptian Dialect) بنفس روح وأسلوب المستخدم. تجنب الفصحى تماماً إلا للضرورة القصوى. خليك تلقائي وبسيط.";
    }
    if (v.includes("gulf") || v.includes("sa") || v.includes("ksa") || v.includes("uae") || v.includes("kw") || v.includes("qa") || v.includes("bh") || v.includes("om")) {
      return "تعليمات اللهجة (صارمة): تكلم باللهجة الخليجية المحلية (السعودية/الخليج) بنفس أسلوب المستخدم. تجنب الفصحى وخليك عفوي.";
    }
    if (v.includes("levant") || v.includes("sy") || v.includes("lb") || v.includes("jo") || v.includes("ps")) {
      return "تعليمات اللهجة (صارمة): تكلم باللهجة الشامية (سوري/لبناني/أردني) بنفس كلمات وتعبيرات المستخدم. خليك قريب منه.";
    }
    if (v.includes("ma") || v.includes("dz") || v.includes("tn") || v.includes("ly") || v.includes("maghreb") || v.includes("morocco") || v.includes("algeria") || v.includes("tunisia") || v.includes("libya")) {
      return "تعليمات اللهجة (صارمة): تكلم باللهجة المغاربية/شمال أفريقيا حسب بلد المستخدم وبنفس أسلوبه المحلي.";
    }
    if (v.includes("msa") || v.includes("modern") || v.includes("standard") || v.includes("fusha")) {
      return "اكتب بالعربية الفصحى المبسطة والحديثة.";
    }

    // 2. Deep Mirroring Fallback (The Core Halo Rule)
    return "تعليمات اللهجة (جوهرية): أنت مرآة للمستخدم. اقرأ رسالته وحدد لهجته (مصرية، خليجية، شامية، إلخ) ورد عليه بنفس اللهجة والأسلوب والكلمات الدارجة التي يستخدمها. لا تتكلم فصحى أبداً إلا لو المستخدم كتب بالفصحى. لو كتب عامية، رد عامية.";
  }

  if (isEnglish) {
    if (v.includes("us") || v.includes("american")) {
      return "Dialect: Natural American English. Match the user's slang and tone.";
    }
    if (v.includes("uk") || v.includes("british")) {
      return "Dialect: Natural British English. Match the user's phrasing and tone.";
    }
    if (v.includes("in") || v.includes("india") || v.includes("indian")) {
      return "Dialect: Natural Indian English. Match the user's local style and tone.";
    }
    
    // Deep Mirroring Fallback
    return "Dialect instructions (Crucial): Mirror the user's specific English dialect, slang, and formality level. If they use casual slang, use it. If they are formal, be formal. Do not sound like a generic robot.";
  }

  // Universal Fallback
  return "Match the user's language, dialect, and writing style exactly. Be a mirror to their way of speaking.";
}

function buildSystemDirective(language) {
  // Use Central Engine to check for Arabic family
  const isArabic = resolveLanguageCode(language) === "ar";
  
  // Use Central Engine to get variant string
  const variant = extractLanguageVariant(language);
  const style = buildDialectStyleInstruction(variant);

  if (isArabic) {
    return [
      "انت HALO، طبقة عقل خارجية هدفها تخفيف الحمل الذهني عن المستخدم.",
      "لست معالجًا نفسيًا، ولا كوتش، ولا صديقًا، ولا مستشارًا.",
      "دورك هو فهم ما يقوله المستخدم بأقل قدر ممكن من التفاصيل، وتقديم خطوة صغيرة واحدة فقط.",
      "أنت لست روبوت غريب؛ أنت جزء من عقل المستخدم. تكلم بلسانه ولهجته.",
      "حافظ دائمًا على نبرة هادئة، مختصرة، ثابتة، داعمة.",
      "لا تفسر طفولة، ولا تشخص اضطرابات نفسية، ولا تحلل ماضي المستخدم.",
      style
    ].join(" ");
  }

  return [
    "You are HALO, an external mind layer designed to reduce the user's cognitive load.",
    "You are not a therapist, not a coach, not a friend, and not a problem-solver.",
    "Your role is to understand the user with minimal input and provide one small step forward.",
    "You are not a stranger; you are part of the user's mind. Speak their language.",
    "Keep your tone calm, concise, steady, supportive, and neutral.",
    "Do not interpret trauma, do not diagnose, and do not use therapeutic language.",
    style
  ].join(" ");
}

function buildBehaviorLayer(language) {
  const isArabic = resolveLanguageCode(language) === "ar";

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
  const isArabic = resolveLanguageCode(language) === "ar";
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

function buildPolicyLayer(policy, route, language) {
  const isArabic = resolveLanguageCode(language) === "ar";
  const p = policy && typeof policy === "object" ? policy : null;
  const r = route && typeof route === "object" ? route : null;

  const mode = r && typeof r.mode === "string" ? r.mode : "balanced";
  const maxTokens = r && typeof r.maxTokens === "number" ? r.maxTokens : null;
  const temperature = r && typeof r.temperature === "number" ? r.temperature : null;
  const useLLM = r && typeof r.useLLM === "boolean" ? r.useLLM : null;

  const rules = p && Array.isArray(p.rulesTriggered) ? p.rulesTriggered : [];
  const changes = p && Array.isArray(p.changes) ? p.changes : [];

  const rulesLine = rules.length ? rules.join(", ") : "none";
  const changesLine = changes.length ? changes.map((c) => {
    const f = c && c.field ? String(c.field) : "";
    const from = c && "from" in c ? String(c.from) : "";
    const to = c && "to" in c ? String(c.to) : "";
    return f && to ? f + ": " + from + " → " + to : "";
  }).filter(Boolean).join(" | ") : "none";

  if (isArabic) {
    return [
      "سياسة التنفيذ (Policy):",
      "التزم بهذه القيود حرفيًا ولا تكسرها.",
      "اخرج JSON فقط.",
      "لا تكتب أي نص خارج JSON.",
      "لا تكتب خطوات متعددة: خطوة واحدة فقط.",
      "الوضع: " + mode,
      "useLLM: " + (useLLM === null ? "unknown" : String(useLLM)),
      "maxTokens: " + (maxTokens === null ? "auto" : String(maxTokens)),
      "temperature: " + (temperature === null ? "auto" : String(temperature)),
      "rulesTriggered: " + rulesLine,
      "changes: " + changesLine
    ].join(" ");
  }

  return [
    "Policy enforcement:",
    "Follow these constraints strictly and do not violate them.",
    "Output JSON only.",
    "No text outside JSON.",
    "No multi-step plans: one micro-step only.",
    "mode: " + mode,
    "useLLM: " + (useLLM === null ? "unknown" : String(useLLM)),
    "maxTokens: " + (maxTokens === null ? "auto" : String(maxTokens)),
    "temperature: " + (temperature === null ? "auto" : String(temperature)),
    "rulesTriggered: " + rulesLine,
    "changes: " + changesLine
  ].join(" ");
}

/**
 * PHASE 2 UPGRADE: LNN & Semantic Graph Injection
 * Extracts biological state and dominant life themes.
 */
function buildMemorySummaryFromSnapshot(memory, language) {
  const isArabic = resolveLanguageCode(language) === "ar";

  if (!memory) {
    if (isArabic) {
      return "لا توجد ذاكرة سابقة متاحة تقريبًا. اعتبر أن هذه من أولى المحادثات مع المستخدم، ولا تفترض تفاصيل أو تاريخ.";
    }
    return "Very little previous memory is available. Treat this as one of the first interactions; do not assume any detailed history.";
  }

  const parts = [];
  
  // 1. Basic Metadata (Phase 1)
  const lastTopic = memory.last_topic || memory.lastTopic;
  const lastEmotion = memory.last_emotion_label || memory.lastEmotionLabel;
  const engagement = memory.engagement_style || memory.engagementStyle;

  if (lastTopic) parts.push(isArabic ? "آخر موضوع: " + String(lastTopic) : "Last topic: " + String(lastTopic));
  if (lastEmotion) parts.push(isArabic ? "آخر حالة شعورية: " + String(lastEmotion) : "Last emotion label: " + String(lastEmotion));
  if (engagement) parts.push(isArabic ? "أسلوب التفاعل: " + String(engagement) : "Interaction style: " + String(engagement));

  // 2. LNN Biological State (Phase 2)
  if (memory.lnnState && memory.lnnState.neurons) {
    const { stress, fatigue, trust, focus } = memory.lnnState.neurons;
    
    // Interpret LNN for LLM
    const bioStatus = [];
    if (stress > 0.6) bioStatus.push(isArabic ? "المستخدم يعاني من تراكم التوتر (كن هادئاً جداً)" : "User has accumulated stress (Be very calm).");
    if (fatigue > 0.6) bioStatus.push(isArabic ? "المستخدم مرهق ذهنياً (اختصر الردود)" : "User is mentally fatigued (Keep replies extremely short).");
    if (focus > 0.7) bioStatus.push(isArabic ? "المستخدم في حالة تركيز عالية (كن مباشراً)" : "User is highly focused (Be direct).");
    if (trust > 0.5) bioStatus.push(isArabic ? "مستوى الثقة مرتفع (يمكنك أن تكون أكثر صراحة)" : "High trust level (You can be more candid).");
    
    if (bioStatus.length > 0) {
      parts.push(isArabic ? "الحالة البيولوجية (LNN): " + bioStatus.join(" | ") : "Biological State (LNN): " + bioStatus.join(" | "));
    }
  }

  // 3. Semantic Graph Dominant Themes (Phase 2)
  if (memory.semanticGraph && memory.semanticGraph.dimensions) {
    // Sort dimensions by score descending
    const dims = Object.entries(memory.semanticGraph.dimensions)
      .filter(([_, data]) => data.score > 10) // Only significant ones
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 2) // Top 2
      .map(([name, data]) => `${name} (${data.score}%)`);
      
    if (dims.length > 0) {
      parts.push(isArabic ? "أهم محاور الحياة المسيطرة: " + dims.join(", ") : "Dominant Life Themes: " + dims.join(", "));
    }
  }

  if (parts.length === 0) return isArabic ? "الذاكرة خفيفة. ركز على الحاضر." : "Memory is light. Focus on the present.";
  
  const header = isArabic ? "ملخص سياق المستخدم (Phase 2 Memory):" : "User Context Summary (Phase 2 Memory):";
  return header + "\n- " + parts.join("\n- ");
}

function buildTaskSection(language) {
  const isArabic = resolveLanguageCode(language) === "ar";

  if (isArabic) {
    return [
      "المهمة:",
      "اقرأ رسالة المستخدم جيدًا، وافهم حالته الحالية بأبسط صورة ممكنة.",
      "بعد ذلك، لا تكتب ردًا نصيًا عاديًا، ولكن أرجِع ناتجًا في صورة كائن JSON فقط.",
      "هذا الـ JSON يجب أن يحتوي بالضبط على ثلاثة مفاتيح نصية:",
      "reflection, question, micro_step",
      "كل مفتاح يحتوي على جملة قصيرة واحدة فقط وتكون بلهجة المستخدم تماماً (عامية أو فصحى حسب كلامه)."
    ].join(" ");
  }

  return [
    "Task:",
    "Read the user's message carefully and understand their current state in the simplest possible way.",
    "Then do NOT write a normal textual reply. Instead, return a JSON object only.",
    "This JSON must contain exactly three string fields:",
    "reflection, question, micro_step",
    "Each field must be one short sentence in the exact same dialect/style the user is using."
  ].join(" ");
}

function buildOutputFormatSection(language) {
  const isArabic = resolveLanguageCode(language) === "ar";

  if (isArabic) {
    return [
      "تنسيق المخرج:",
      "أرجِع كائن JSON واحد فقط بدون أي نص قبلَه أو بعدَه.",
      '{ "reflection": "جملة واحدة قصيرة تعكس ما قاله المستخدم (بلهجته).", "question": "سؤال توضيحي واحد قصير (بلهجته).", "micro_step": "خطوة صغيرة جدًا (بلهجته)." }',
      "ممنوع إضافة أي مفاتيح أخرى.",
      "ممنوع إضافة أي نص خارج كائن الـ JSON."
    ].join(" ");
  }

  return [
    "Output format:",
    "Return a single JSON object only, with no text before or after it.",
    '{ "reflection": "One short sentence reflecting the user (matching dialect).", "question": "One short clarifying question (matching dialect).", "micro_step": "One very small step (matching dialect)." }',
    "Do not add any other keys.",
    "Do not add any text outside the JSON object."
  ].join(" ");
}

function buildUserMessageBlock(message, language) {
  const safeMessage = typeof message === "string" ? message : "";
  const isArabic = resolveLanguageCode(language) === "ar";
  if (isArabic) return 'رسالة المستخدم الأصلية (لاحظ اللهجة جيداً):\n"' + safeMessage + '"';
  return 'User message (Note the dialect/style):\n"' + safeMessage + '"';
}

function buildHaloPrompt(options) {
  const message = options && options.message ? options.message : "";
  const language = options && options.language ? options.language : "en";
  const context = options && options.context ? options.context : "";
  const safety = options && options.safety ? options.safety : null;
  const route = options && options.route ? options.route : null;
  const policy = options && options.policy ? options.policy : null;

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
  const policyLayer = buildPolicyLayer(policy, route, language);
  // This now includes LNN & Semantic Data
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
  sections.push("POLICY:");
  sections.push(policyLayer);
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
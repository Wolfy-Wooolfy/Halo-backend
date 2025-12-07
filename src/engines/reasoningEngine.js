function generateReflection(context, message, language) {
  if (language === "ar") {
    if (context === "emotional_discomfort") return "واضح إن الموضوع مؤثر عليك بشكل ما.";
    if (context === "decision") return "واضح إنك بتحاول تاخد خطوة واضحة في الموضوع.";
    if (context === "planning") return "يبدو إن عندك اتجاه عام وعايز ترتبه.";
    return "أنا سامعك وفاهم النقطة اللي بتتكلم عنها.";
  } else {
    if (context === "emotional_discomfort") return "It sounds like something here is affecting you.";
    if (context === "decision") return "It seems you're trying to make a clear move.";
    if (context === "planning") return "It looks like you have a direction you want to shape.";
    return "I'm here and following what you're saying.";
  }
}

function generateQuestion(context, language) {
  if (language === "ar") {
    if (context === "emotional_discomfort") return "ما الجزء اللي حاسس إنه ضاغط عليك أكتر؟";
    if (context === "decision") return "ما العامل اللي شايف إنه هيحدد اختيارك؟";
    if (context === "planning") return "إيه العنصر اللي حابب نرتبه الأول؟";
    return "إيه الجزء اللي تحب نركز عليه الأول؟";
  } else {
    if (context === "emotional_discomfort") return "What part of this feels most pressing for you?";
    if (context === "decision") return "What factor do you feel will guide your choice?";
    if (context === "planning") return "Which piece would you like us to shape first?";
    return "Which part would you like us to focus on first?";
  }
}

function generateMicroStep(context, language) {
  if (language === "ar") {
    if (context === "emotional_discomfort") return "جرب تحدد نقطة صغيرة نبدأ منها.";
    if (context === "decision") return "خلينا نحدد خطوة صغيرة تساعدك تتضح الصورة.";
    if (context === "planning") return "خلينا ناخد عنصر واحد ونبنيه خطوة بخطوة.";
    return "خلينا نختار نقطة واحدة ونبدأ منها بهدوء.";
  } else {
    if (context === "emotional_discomfort") return "Try naming one small point we can start from.";
    if (context === "decision") return "Let's pick one small step that clarifies things.";
    if (context === "planning") return "Let's take one element and build it step by step.";
    return "Let's choose one small angle to begin with.";
  }
}

function reasoningEngine(input) {
  const context = input.context || "general";
  const message = input.normalizedMessage || "";
  const language = input.language === "ar" ? "ar" : "en";

  return {
    reflection: generateReflection(context, message, language),
    question: generateQuestion(context, language),
    micro_step: generateMicroStep(context, language),
    safety_flag: "",
    memory_update: {
      last_topic: context,
      mood_delta: "",
      hesitation_signal: false
    }
  };
}

module.exports = reasoningEngine;

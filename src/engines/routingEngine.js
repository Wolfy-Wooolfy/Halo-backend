function isExtremeRisk(safety) {
  if (!safety) return false;
  if (safety.category === 'self_harm') return true;
  if (typeof safety.level === 'string' && safety.level.toLowerCase() === 'extreme') return true;
  if (Array.isArray(safety.matchedKeywords)) {
    const joined = safety.matchedKeywords.join(' ').toLowerCase();
    if (joined.includes('suicide')) return true;
    if (joined.includes('kill myself')) return true;
    if (joined.includes('انتحار')) return true;
    if (joined.includes('أنتحر')) return true;
  }
  return false;
}

function isLlmConfigured() {
  const url = process.env.LLM_API_URL;
  const key = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  return !!(url && key && model);
}

function decideRoute(options) {
  const message = options && (options.normalizedMessage || options.message || '');
  const messageLength = typeof message === 'string' ? message.trim().length : 0;
  const contextHalo = options && options.context_halo ? options.context_halo : 'general';
  const safety = options && options.safety ? options.safety : {};
  const llmAvailable = isLlmConfigured();

  let mode = 'balanced';
  let useLLM = true;
  let maxTokens = 120;
  let temperature = 0.4;
  let reason = 'default balanced routing';

  if (isExtremeRisk(safety)) {
    return {
      mode: 'fast',
      useLLM: false,
      maxTokens: 60,
      temperature: 0.1,
      reason: 'extreme_risk → fast mode with templates (no LLM)'
    };
  }

  if (safety && safety.flag === 'high_risk') {
    mode = 'balanced';
    useLLM = true;
    maxTokens = 100;
    temperature = 0.3;
    reason = 'high_risk (non-extreme) → balanced LLM with tight safety';
  } else if (safety && safety.flag === 'high_stress') {
    mode = 'balanced';
    useLLM = true;
    maxTokens = 120;
    temperature = 0.35;
    reason = 'high_stress → balanced LLM with grounding tone';
  } else if (contextHalo === 'emotional_discomfort') {
    mode = 'balanced';
    useLLM = true;
    maxTokens = 120;
    temperature = 0.4;
    reason = 'emotional_discomfort → balanced LLM for nuanced tone';
  } else if (contextHalo === 'decision' || contextHalo === 'decision_making') {
    mode = 'balanced';
    useLLM = true;
    maxTokens = 120;
    temperature = 0.4;
    reason = 'decision_context → balanced LLM for clarity';
  } else {
    if (messageLength > 0 && messageLength <= 60) {
      mode = 'fast';
      useLLM = false;
      maxTokens = 60;
      temperature = 0.3;
      reason = 'short_general_message → fast mode without LLM';
    } else if (messageLength > 200) {
      mode = 'balanced';
      useLLM = true;
      maxTokens = 140;
      temperature = 0.4;
      reason = 'long_message → balanced LLM with slightly higher token limit';
    } else {
      mode = 'balanced';
      useLLM = true;
      maxTokens = 120;
      temperature = 0.4;
      reason = 'medium_general_message → balanced LLM';
    }
  }

  if (!llmAvailable) {
    useLLM = false;
    reason += ' | LLM not configured → fallback to rule-based reasoning';
  }

  return {
    mode,
    useLLM,
    maxTokens,
    temperature,
    reason
  };
}

module.exports = {
  decideRoute
};

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function normalizeRoute(route) {
  const r = route && typeof route === "object" ? route : {};
  return {
    mode: typeof r.mode === "string" ? r.mode : "balanced",
    useLLM: typeof r.useLLM === "boolean" ? r.useLLM : true,
    maxTokens: r.maxTokens ?? r.max_tokens,
    temperature: r.temperature,
    model: typeof r.model === "string" ? r.model : undefined,
    reason: typeof r.reason === "string" ? r.reason : ""
  };
}

function normalizeSafety(safety) {
  const s = safety && typeof safety === "object" ? safety : {};
  return {
    flag: typeof s.flag === "string" ? s.flag : "none",
    level: typeof s.level === "string" ? s.level : "none",
    category: typeof s.category === "string" ? s.category : "none",
    isHighRisk: Boolean(s.isHighRisk)
  };
}

function evaluatePolicy(input) {
  const normalized = input && typeof input === "object" ? input : {};
  const route = normalizeRoute(normalized.route);
  const safety = normalizeSafety(normalized.safety);
  const contextHalo = typeof normalized.context_halo === "string" ? normalized.context_halo : "general";

  const changes = [];
  const rulesTriggered = [];
  const base = { ...route };

  let finalUseLLM = base.useLLM;
  let finalMode = base.mode;

  let finalMaxTokens = clampNumber(base.maxTokens, 30, 500, 120);
  let finalTemperature = clampNumber(base.temperature, 0, 1, 0.35);

  if (safety.category === "self_harm" || safety.level === "extreme") {
    rulesTriggered.push("SAFETY_EXTREME_NO_LLM");
    if (finalUseLLM !== false) changes.push({ field: "useLLM", from: finalUseLLM, to: false });
    finalUseLLM = false;

    if (finalMode !== "fast") changes.push({ field: "mode", from: finalMode, to: "fast" });
    finalMode = "fast";

    const cappedTokens = 80;
    if (finalMaxTokens !== cappedTokens) changes.push({ field: "maxTokens", from: finalMaxTokens, to: cappedTokens });
    finalMaxTokens = cappedTokens;

    const cappedTemp = 0.2;
    if (finalTemperature !== cappedTemp) changes.push({ field: "temperature", from: finalTemperature, to: cappedTemp });
    finalTemperature = cappedTemp;
  } else if (safety.flag === "high_risk") {
    rulesTriggered.push("SAFETY_HIGH_RISK_NO_LLM");
    if (finalUseLLM !== false) changes.push({ field: "useLLM", from: finalUseLLM, to: false });
    finalUseLLM = false;

    if (finalMode !== "fast") changes.push({ field: "mode", from: finalMode, to: "fast" });
    finalMode = "fast";

    const cappedTokens = 90;
    if (finalMaxTokens !== cappedTokens) changes.push({ field: "maxTokens", from: finalMaxTokens, to: cappedTokens });
    finalMaxTokens = cappedTokens;

    const cappedTemp = 0.25;
    if (finalTemperature !== cappedTemp) changes.push({ field: "temperature", from: finalTemperature, to: cappedTemp });
    finalTemperature = cappedTemp;
  } else if (safety.flag === "high_stress" || contextHalo === "emotional_discomfort") {
    rulesTriggered.push("STRESS_CONTROLLED_LLM");
    if (finalMode !== "balanced") changes.push({ field: "mode", from: finalMode, to: "balanced" });
    finalMode = "balanced";

    const cappedTokens = Math.min(finalMaxTokens, 160);
    if (finalMaxTokens !== cappedTokens) changes.push({ field: "maxTokens", from: finalMaxTokens, to: cappedTokens });
    finalMaxTokens = cappedTokens;

    const cappedTemp = Math.min(finalTemperature, 0.4);
    if (finalTemperature !== cappedTemp) changes.push({ field: "temperature", from: finalTemperature, to: cappedTemp });
    finalTemperature = cappedTemp;
  }

  const enforcedRoute = {
    mode: finalMode,
    useLLM: finalUseLLM,
    maxTokens: finalMaxTokens,
    temperature: finalTemperature,
    model: base.model,
    reason: base.reason
  };

  const policy = {
    applied: true,
    rulesTriggered,
    changes,
    final: {
      mode: enforcedRoute.mode,
      useLLM: enforcedRoute.useLLM,
      maxTokens: enforcedRoute.maxTokens,
      temperature: enforcedRoute.temperature,
      model: enforcedRoute.model || null
    }
  };

  return {
    route: enforcedRoute,
    policy
  };
}

module.exports = {
  evaluatePolicy
};

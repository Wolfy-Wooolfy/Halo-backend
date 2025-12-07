const LLM_API_URL = process.env.LLM_API_URL || "";
const LLM_API_KEY = process.env.LLM_API_KEY || "";
const DEFAULT_LLM_MODEL = process.env.LLM_MODEL || "default";

function isConfigured() {
  return LLM_API_URL !== "" && LLM_API_KEY !== "";
}

async function callLLM(payload) {
  if (!isConfigured()) {
    return {
      success: false,
      error: "LLM_NOT_CONFIGURED",
      raw: null
    };
  }

  const model = payload.model || DEFAULT_LLM_MODEL;
  const body = {
    model,
    prompt: payload.prompt,
    temperature: typeof payload.temperature === "number" ? payload.temperature : 0.4,
    max_tokens: typeof payload.max_tokens === "number" ? payload.max_tokens : 256
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LLM_API_KEY}`
  };

  const response = await fetch(LLM_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      success: false,
      error: "LLM_HTTP_ERROR",
      status: response.status,
      raw: data
    };
  }

  return {
    success: true,
    error: null,
    raw: data
  };
}

module.exports = {
  callLLM,
  isConfigured
};

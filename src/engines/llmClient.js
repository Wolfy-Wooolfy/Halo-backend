function getApiUrl() {
  return process.env.LLM_API_URL || "";
}

function getApiKey() {
  return process.env.LLM_API_KEY || "";
}

function getDefaultModel() {
  // STRICT: No default fallback allowed. Must come from env.
  return process.env.LLM_MODEL || "";
}

function getTimeoutMs() {
  const raw = process.env.LLM_TIMEOUT_MS;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 12000;
  return Math.floor(n);
}

function getMaxConcurrency() {
  const raw = process.env.LLM_MAX_CONCURRENCY;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 6;
  return Math.floor(n);
}

function checkReadiness() {
  const url = getApiUrl();
  const key = getApiKey();
  const model = getDefaultModel();

  if (!url) {
    return { ready: false, reasonCode: "missing_env:LLM_API_URL", missingVar: "LLM_API_URL" };
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return { ready: false, reasonCode: "invalid_env:LLM_API_URL", missingVar: "LLM_API_URL" };
  }
  if (!key) {
    return { ready: false, reasonCode: "missing_env:LLM_API_KEY", missingVar: "LLM_API_KEY" };
  }
  if (!model) {
    return { ready: false, reasonCode: "missing_env:LLM_MODEL", missingVar: "LLM_MODEL" };
  }
  
  return { ready: true, reasonCode: "ready", missingVar: null };
}

function isConfigured() {
  return checkReadiness().ready;
}

let inFlight = 0;

function tryAcquireSlot() {
  const max = getMaxConcurrency();
  if (inFlight >= max) return false;
  inFlight += 1;
  return true;
}

function releaseSlot() {
  inFlight = Math.max(0, inFlight - 1);
}

async function callLLM(payload) {
  const readiness = checkReadiness();
  const defaultModel = getDefaultModel();

  if (!readiness.ready) {
    return {
      success: false,
      error: "LLM_NOT_CONFIGURED",
      raw: { reason: readiness.reasonCode },
      output: null,
      engine: { source: "fallback", model: defaultModel || "none" }
    };
  }

  const model = payload.model || defaultModel;
  const temperature = typeof payload.temperature === "number" ? payload.temperature : 0.4;
  const maxTokens =
    typeof payload.maxTokens === "number"
      ? payload.maxTokens
      : typeof payload.max_tokens === "number"
        ? payload.max_tokens
        : 400;

  if (!tryAcquireSlot()) {
    return {
      success: false,
      error: "LLM_OVERLOADED",
      raw: { in_flight: inFlight, max_concurrency: getMaxConcurrency() },
      output: null,
      engine: { source: "fallback", model }
    };
  }

  let messages = payload.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    messages = [{ role: "user", content: payload.prompt || "" }];
  }

  const responseFormat = payload.responseFormat || payload.response_format || null;

  const body = { model, messages, temperature, max_tokens: maxTokens };
  if (responseFormat) {
    body.response_format = responseFormat;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getApiKey()}`
  };

  const timeoutMs = getTimeoutMs();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(getApiUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: "LLM_HTTP_ERROR",
        status: response.status,
        raw: data,
        output: null,
        engine: { source: "fallback", model }
      };
    }

    let normalized = "";
    if (data?.choices?.[0]?.message?.content) {
      normalized = data.choices[0].message.content;
    } else if (data?.content) {
      normalized = data.content;
    }

    let finalOutput = normalized;

    if (responseFormat && responseFormat.type === "json_object" && normalized) {
      try {
        finalOutput = JSON.parse(normalized);
      } catch (e) {
      }
    }

    return {
      success: true,
      error: null,
      raw: data,
      output: finalOutput,
      engine: { source: "llm", model }
    };
  } catch (err) {
    const isAbort =
      err &&
      (err.name === "AbortError" ||
        String(err).toLowerCase().includes("aborted") ||
        String(err).toLowerCase().includes("abort"));

    return {
      success: false,
      error: isAbort ? "LLM_TIMEOUT" : "LLM_EXCEPTION",
      raw: isAbort ? { timeout_ms: timeoutMs } : String(err),
      output: null,
      engine: { source: "fallback", model }
    };
  } finally {
    clearTimeout(timeoutId);
    releaseSlot();
  }
}

module.exports = { callLLM, isConfigured, checkReadiness };
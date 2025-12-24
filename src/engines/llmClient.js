function getApiUrl() {
  return process.env.LLM_API_URL || "";
}

function getApiKey() {
  return process.env.LLM_API_KEY || "";
}

function getDefaultModel() {
  return process.env.LLM_MODEL || "gpt-4o";
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

function isConfigured() {
  const url = getApiUrl();
  const key = getApiKey();
  return url !== "" && key !== "";
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
  const apiUrl = getApiUrl();
  const apiKey = getApiKey();
  const defaultModel = getDefaultModel();

  if (!isConfigured()) {
    return {
      success: false,
      error: "LLM_NOT_CONFIGURED",
      raw: null,
      output: null,
      engine: { source: "llm", model: defaultModel }
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
      engine: { source: "llm", model }
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
    Authorization: `Bearer ${apiKey}`
  };

  const timeoutMs = getTimeoutMs();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(apiUrl, {
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
        engine: { source: "llm", model }
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
      engine: { source: "llm", model }
    };
  } finally {
    clearTimeout(timeoutId);
    releaseSlot();
  }
}

module.exports = { callLLM, isConfigured };

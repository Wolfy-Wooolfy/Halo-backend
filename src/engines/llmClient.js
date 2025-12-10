const LLM_API_URL = process.env.LLM_API_URL || "";
const LLM_API_KEY = process.env.LLM_API_KEY || "";
const DEFAULT_LLM_MODEL = process.env.LLM_MODEL || "gpt-4o";

function isConfigured() {
  return LLM_API_URL !== "" && LLM_API_KEY !== "";
}

async function callLLM(payload) {
  if (!isConfigured()) {
    return {
      success: false,
      error: "LLM_NOT_CONFIGURED",
      raw: null,
      output: null,
      engine: {
        source: "llm",
        model: DEFAULT_LLM_MODEL
      }
    };
  }

  const model = payload.model || DEFAULT_LLM_MODEL;

  const temperature =
    typeof payload.temperature === "number" ? payload.temperature : 0.4;

  const maxTokens =
    typeof payload.maxTokens === "number"
      ? payload.maxTokens
      : typeof payload.max_tokens === "number"
      ? payload.max_tokens
      : 400;

  let messages = payload.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    messages = [
      {
        role: "user",
        content: payload.prompt || ""
      }
    ];
  }

  const responseFormat =
    payload.responseFormat || payload.response_format || null;

  const body = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens
  };

  if (responseFormat) {
    body.response_format = responseFormat;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LLM_API_KEY}`
  };

  try {
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
        raw: data,
        output: null,
        engine: {
          source: "llm",
          model
        }
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
      engine: {
        source: "llm",
        model
      }
    };
  } catch (err) {
    return {
      success: false,
      error: "LLM_EXCEPTION",
      raw: String(err),
      output: null,
      engine: {
        source: "llm",
        model
      }
    };
  }
}

module.exports = {
  callLLM,
  isConfigured
};

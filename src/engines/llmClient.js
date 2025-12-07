const LLM_API_URL = process.env.LLM_API_URL || "";
const LLM_API_KEY = process.env.LLM_API_KEY || "";
const DEFAULT_LLM_MODEL = process.env.LLM_MODEL || "default";

function isConfigured() {
  return LLM_API_URL !== "" && LLM_API_KEY !== "";
}

/**
 * PATCH NOTE:
 * This patch adds FULL SUPPORT for OpenAI Chat Completions (GPT-4o / GPT-4o-mini)
 * while keeping the original structure intact.
 * 
 * - If payload.prompt exists → converted automatically to OpenAI "messages" format.
 * - If API returns chat.completion format → parsed safely.
 * - If anything fails → safe fallback returns the original structure.
 */

async function callLLM(payload) {
  if (!isConfigured()) {
    return {
      success: false,
      error: "LLM_NOT_CONFIGURED",
      raw: null
    };
  }

  const model = payload.model || DEFAULT_LLM_MODEL;

  // -------- PATCH: OpenAI-Compatible Body --------
  const body = {
    model,
    messages: [
      {
        role: "user",
        content: payload.prompt || ""
      }
    ],
    temperature:
      typeof payload.temperature === "number" ? payload.temperature : 0.4,
    max_tokens:
      typeof payload.max_tokens === "number" ? payload.max_tokens : 256
  };
  // -----------------------------------------------

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

    // -------- PATCH: Normalize OpenAI Response --------
    let normalized = null;

    if (data?.choices?.[0]?.message?.content) {
      normalized = data.choices[0].message.content;
    } else if (data?.content) {
      normalized = data.content;
    }
    // ---------------------------------------------------

    if (!response.ok) {
      return {
        success: false,
        error: "LLM_HTTP_ERROR",
        status: response.status,
        raw: data,
        output: null
      };
    }

    return {
      success: true,
      error: null,
      raw: data,
      output: normalized || ""
    };
  } catch (err) {
    return {
      success: false,
      error: "LLM_EXCEPTION",
      raw: String(err),
      output: ""
    };
  }
}

module.exports = {
  callLLM,
  isConfigured
};

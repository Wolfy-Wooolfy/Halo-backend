const reasoningEngine = require("../engines/reasoningEngine");
const { checkReadiness, callLLM } = require("../engines/llmClient");

describe("LLM Fail-Closed & Telemetry Contract", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("FAIL-CLOSED: Missing LLM_API_KEY blocks LLM in reasoningEngine", async () => {
    // FIX: Plain string, NO Markdown
    process.env.LLM_API_URL = "https://api.openai.com/v1";
    process.env.LLM_MODEL = "gpt-4o";
    delete process.env.LLM_API_KEY;

    // Simulate policy object that chatController would pass (immutable input)
    const policy = { final: { reason_code: "routing_approved_llm" } };
    
    const result = await reasoningEngine.generateResponse({ 
        message: "hello", 
        policy,
        route: { useLLM: true } 
    });

    // 1. Engine source must be fallback
    expect(result.engine.source).toBe("fallback");

    // 2. Engine returns explicit final_reason_code (Controller will assign it)
    expect(result.final_reason_code).toBe("missing_env:LLM_API_KEY");
  });

  test("FAIL-CLOSED: Missing LLM_API_URL (Empty)", async () => {
    process.env.LLM_API_KEY = "sk-test";
    process.env.LLM_MODEL = "gpt-4o";
    delete process.env.LLM_API_URL;

    const policy = { final: { reason_code: "routing_approved_llm" } };
    const result = await reasoningEngine.generateResponse({ 
        message: "hello", 
        policy,
        route: { useLLM: true } 
    });

    expect(result.engine.source).toBe("fallback");
    expect(result.final_reason_code).toBe("missing_env:LLM_API_URL");
  });

  test("FAIL-CLOSED: Invalid LLM_API_URL (Not http/https)", async () => {
    process.env.LLM_API_KEY = "sk-test";
    process.env.LLM_MODEL = "gpt-4o";
    process.env.LLM_API_URL = "ftp://api.openai.com";

    const policy = { final: { reason_code: "routing_approved_llm" } };
    const result = await reasoningEngine.generateResponse({ 
        message: "hello", 
        policy,
        route: { useLLM: true } 
    });

    expect(result.engine.source).toBe("fallback");
    expect(result.final_reason_code).toBe("invalid_env:LLM_API_URL");
  });

  test("FAIL-CLOSED: Missing LLM_MODEL", async () => {
    process.env.LLM_API_KEY = "sk-test";
    // FIX: Plain string, NO Markdown
    process.env.LLM_API_URL = "https://api.openai.com/v1";
    delete process.env.LLM_MODEL;

    const policy = { final: { reason_code: "routing_approved_llm" } };
    const result = await reasoningEngine.generateResponse({ 
        message: "hello", 
        policy,
        route: { useLLM: true } 
    });

    expect(result.engine.source).toBe("fallback");
    expect(result.final_reason_code).toBe("missing_env:LLM_MODEL");
  });

  test("TELEMETRY: callLLM returns engine.source='fallback' when not ready", async () => {
    delete process.env.LLM_API_KEY;
    
    const result = await callLLM({ prompt: "hi" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("LLM_NOT_CONFIGURED");
    expect(result.engine).toBeDefined();
    expect(result.engine.source).toBe("fallback"); 
  });
});
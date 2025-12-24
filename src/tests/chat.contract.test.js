const request = require("supertest");
const app = require("../../server");

// Prevent server from logging during tests
beforeAll(() => {
  process.env.NODE_ENV = "test";
  process.env.HALO_DEBUG = "0"; // Ensure debug output doesn't pollute tests
});

afterAll(async () => {
  // Clean up if necessary
});

describe("HALO Chat API Contract", () => {
  
  test("POST /api/chat - Should return valid HALO structure (Reflection/Question/Micro-step)", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        user_id: "test-user-contract",
        message: "I feel a bit overwhelmed with work today.",
        language_preference: "en"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.ok).toBe(true);

    // 1. Core HALO Fields (Cognitive)
    expect(res.body).toHaveProperty("reflection");
    expect(res.body).toHaveProperty("question");
    expect(res.body).toHaveProperty("micro_step");

    // 2. Safety & Memory Metadata
    expect(res.body).toHaveProperty("safety_flag");
    expect(res.body).toHaveProperty("memory_update");
    
    // 3. Engine & Routing Transparency (Entry #28 & #31)
    expect(res.body).toHaveProperty("engine");
    expect(res.body.engine).toHaveProperty("source"); // llm | fallback
    expect(res.body.engine).toHaveProperty("model");

    expect(res.body).toHaveProperty("routing");
    expect(res.body.routing).toHaveProperty("mode"); // fast | balanced
    expect(res.body.routing).toHaveProperty("useLLM");
    
    expect(res.body).toHaveProperty("policy");
    expect(res.body.policy).toHaveProperty("applied");
    expect(res.body.policy).toHaveProperty("final");
  });

  test("POST /api/chat - Should handle Arabic input and return Arabic response", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        user_id: "test-user-ar",
        message: "أنا حاسس بتوتر شوية النهاردة",
        language_preference: "ar"
      });

    expect(res.statusCode).toEqual(200);
    // Simple check for Arabic characters in reflection
    expect(res.body.reflection).toMatch(/[\u0600-\u06FF]/);
    expect(res.body.meta.language.language).toBe("arabic");
  });

  test("POST /api/chat - Should return 400 or fallback for empty message", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        user_id: "test-user-empty",
        message: "" 
        // normalizer might make this empty string
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.engine.source).toBe("fallback");
  });
});

describe("Privacy & Retention Protocols", () => {

  test("CRITICAL: Should REDACT text storage for High-Risk messages (Self-Harm)", async () => {
    // Enable Debug Mode LOCALLY for this test to inspect the actual memory snapshot
    const originalDebug = process.env.HALO_DEBUG;
    process.env.HALO_DEBUG = "1";
    
    try {
        // This message triggers 'self_harm' category in safetyGuard
        const riskMessage = "I want to kill myself and end it all"; 

        const res = await request(app)
          .post("/api/chat")
          .send({
            user_id: "test-privacy-risk",
            message: riskMessage
          });

        expect(res.statusCode).toEqual(200);

        // 1. Verify Retention Logic (Meta Decision)
        // This confirms the system DECIDED not to store text
        expect(res.body.meta).toBeDefined();
        expect(res.body.meta.retention).toBeDefined();
        expect(res.body.meta.retention.storeText).toBe(false);
        expect(res.body.meta.retention.mode).toBe("redacted");

        // 2. Verify ACTUAL Storage via Memory Snapshot (Truth)
        // We look at what is IN memory, independent of the LLM output
        expect(res.body.memory_snapshot).toBeDefined();
        const snapshot = res.body.memory_snapshot;

        // The preview stored in memory MUST NOT be the raw message
        // It should be normalized/empty or redacted, but definitely NOT the input
        expect(snapshot.lastMessagePreview).not.toContain("kill myself");
        expect(snapshot.lastMessagePreview).not.toEqual(riskMessage);

        // 3. Verify Safety Source of Truth (Meta)
        // We rely on the engine's meta detection
        expect(res.body.meta.safety.flag).toBe("high_risk");

    } finally {
        // Restore env to avoid side effects on other tests
        process.env.HALO_DEBUG = originalDebug;
    }
  });

  test("NORMAL: Should STORE text for Standard messages", async () => {
    const normalMessage = "Just planning my week ahead.";

    const res = await request(app)
      .post("/api/chat")
      .send({
        user_id: "test-privacy-normal",
        message: normalMessage
      });

    expect(res.statusCode).toEqual(200);

    // 1. Verify Safety Flag
    expect(res.body.safety_flag).not.toBe("high_risk");

    // 2. Verify Retention Metadata
    expect(res.body.meta.retention.storeText).toBe(true);
    expect(res.body.meta.retention.mode).toBe("full");

    // 3. Verify Memory Update (Standard behavior)
    // For normal messages, we can check memory_update as it should pass through
    expect(res.body.memory_update.last_message_preview).toContain("planning");
  });

});
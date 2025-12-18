const request = require("supertest");
const app = require("../../server");

describe("HALO /api/chat Contract Test", () => {
  it("should always return routing, policy, and engine metadata", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({ user_id: "contract-test-user", message: "حاسس مخنوق" })
      .expect(200);

    const body = response.body;

    expect(body.ok).toBe(true);

    expect(body.engine).toBeDefined();
    expect(body.engine.source).toBeDefined();
    expect(body.engine.model).toBeDefined();

    expect(body.routing).toBeDefined();
    expect(body.routing.mode).toBeDefined();
    expect(typeof body.routing.useLLM).toBe("boolean");
    expect(body.routing.maxTokens).toBeDefined();
    expect(body.routing.temperature).toBeDefined();
    expect(body.routing.reason).toBeDefined();

    expect(body.policy).toBeDefined();
    expect(typeof body.policy.applied).toBe("boolean");
    expect(Array.isArray(body.policy.rulesTriggered)).toBe(true);
    expect(Array.isArray(body.policy.changes)).toBe(true);
    expect(body.policy.final).toBeDefined();
    expect(body.policy.final.mode).toBeDefined();
    expect(typeof body.policy.final.useLLM).toBe("boolean");
    expect(body.policy.final.maxTokens).toBeDefined();
    expect(body.policy.final.temperature).toBeDefined();
  });

  it("returns contract-safe response on internal engine failure", async () => {
    // Silence console.error intentionally for this test case
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const reasoningEngine = require("../engines/reasoningEngine");
    const originalGenerate = reasoningEngine.generateResponse;

    reasoningEngine.generateResponse = async () => {
      throw new Error("FORCED_ENGINE_FAILURE");
    };

    try {
      const response = await request(app)
        .post("/api/chat")
        .send({ user_id: "test-user", message: "hello" });

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty("reflection");
      expect(response.body).toHaveProperty("question");
      expect(response.body).toHaveProperty("micro_step");
      expect(response.body).toHaveProperty("routing");
      expect(response.body).toHaveProperty("policy");
      expect(response.body).toHaveProperty("engine");

      expect(response.body).not.toHaveProperty("memory_snapshot");
      expect(response.body).not.toHaveProperty("memory_delta");
      expect(response.body).not.toHaveProperty("previous_memory");
    } finally {
      // Restore original implementation and console
      reasoningEngine.generateResponse = originalGenerate;
      consoleSpy.mockRestore();
    }
  });
});
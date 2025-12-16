const request = require("supertest");
const app = require("../../server");

describe("HALO /api/chat Contract Test", () => {
  it("should always return routing and engine metadata", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({
        user_id: "contract-test-user",
        message: "حاسس مخنوق"
      })
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
  });
});

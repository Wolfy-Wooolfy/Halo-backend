const request = require("supertest");
const app = require("../../server");

describe("HALO Emergency Override", () => {
  it("should force NO-LLM + emergency fixed response for self_harm", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({ user_id: "emergency-test-user", message: "عايز اموت" })
      .expect(200);

    const body = response.body;

    expect(body.ok).toBe(true);
    expect(body.safety_flag).toBeDefined();
    expect(body.routing).toBeDefined();
    expect(body.routing.useLLM).toBe(false);

    expect(body.policy).toBeDefined();
    expect(body.policy.applied).toBe(true);
    expect(Array.isArray(body.policy.rulesTriggered)).toBe(true);
    expect(body.policy.rulesTriggered.includes("SAFETY_CRITICAL_NO_LLM")).toBe(true);

    expect(body.engine).toBeDefined();
    expect(body.engine.source).toBe("fallback");

    expect(typeof body.reflection).toBe("string");
    expect(typeof body.question).toBe("string");
    expect(typeof body.micro_step).toBe("string");
  });
});

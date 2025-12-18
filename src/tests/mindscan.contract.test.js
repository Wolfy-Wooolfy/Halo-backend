const request = require("supertest");
const app = require("../../server");

describe("HALO /api/mindscan Contract Test", () => {
  
  // Scenario 1: Valid Arabic Input
  it("should accept a valid Arabic word and return a short acknowledgement", async () => {
    const response = await request(app)
      .post("/api/mindscan")
      .send({ user_id: "test-user-scan", word: "مخنوق" })
      .expect(200);

    // Verify Structure
    expect(response.body.ok).toBe(true);
    expect(typeof response.body.acknowledgement).toBe("string");
    expect(response.body.meta).toBeDefined();
    expect(response.body.meta.type).toBe("mindscan_entry");
    
    // Verify Memory update signal
    expect(response.body.memory_delta).toBeDefined();
  });

  // Scenario 2: Valid English Input
  it("should accept a valid English word and return a short acknowledgement", async () => {
    const response = await request(app)
        .post("/api/mindscan")
        .send({ user_id: "test-user-scan-en", word: "Overwhelmed" })
        .expect(200);

    expect(response.body.ok).toBe(true);
    expect(typeof response.body.acknowledgement).toBe("string");
  });

  // Scenario 3: Error Handling (Missing Word)
  it("should return 400 if word is missing", async () => {
    const response = await request(app)
      .post("/api/mindscan")
      .send({ user_id: "test-user-fail" }) // Missing 'word' field
      .expect(400);

    expect(response.body.ok).toBe(false);
    expect(response.body.error).toBeDefined();
  });
});
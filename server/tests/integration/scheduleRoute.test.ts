import request from "supertest";
import app from "../../src/app";

describe("POST /api/schedule", () => {
  it("returns 200 and a schedule for a valid request", async () => {
    const response = await request(app)
      .post("/api/schedule")
      .send({
        availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        prescriptionType: "stabilisation",
        stabilisationDose: 15
      });

    expect(response.status).toBe(200);
    expect(response.body.schedule).toBeDefined();
    expect(response.body.schedule).toHaveLength(14);
    expect(response.body.requestId).toBeDefined();
  });

  it("returns 400 for an invalid request body", async () => {
    const response = await request(app)
      .post("/api/schedule")
      .send({
        // missing required fields
        availableDays: [],
        prescriptionType: "stabilisation"
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid request");
  });
});

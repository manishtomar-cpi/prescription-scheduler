import request from "supertest";
import app from "../../src/app";

describe("POST /api/schedule", () => {
  /**
   * Happy path: a valid request should return:
   *  - 200 OK
   *  - A schedule array of 14 days
   *  - A requestId for observability / tracing
   */
  it("returns 200 and a 14-day schedule for a valid request", async () => {
    const response = await request(app)
      .post("/api/schedule")
      .send({
        availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        prescriptionType: "stabilisation",
        stabilisationDose: 15,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("schedule");
    expect(Array.isArray(response.body.schedule)).toBe(true);
    expect(response.body.schedule).toHaveLength(14);
    expect(response.body).toHaveProperty("requestId");
    expect(typeof response.body.requestId).toBe("string");

    // Basic shape check for the first schedule entry
    const firstDay = response.body.schedule[0];
    expect(firstDay).toHaveProperty("date");
    expect(firstDay).toHaveProperty("day");
    expect(firstDay).toHaveProperty("dose");
    expect(firstDay).toHaveProperty("isBankHoliday");
  });

  /**
   * Validation path: an invalid request body should return:
   *  - 400 Bad Request
   *  - An error message indicating invalid request
   */
  it("returns 400 for an invalid request body", async () => {
    const response = await request(app)
      .post("/api/schedule")
      .send({
        // Invalid: availableDays is empty and stabilisationDose is missing
        availableDays: [],
        prescriptionType: "stabilisation",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid request");
  });
});

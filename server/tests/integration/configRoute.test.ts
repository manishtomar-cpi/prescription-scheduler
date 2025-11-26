import request from "supertest";
import app from "../../src/app";

describe("GET /api/config", () => {
  it("returns prescription configuration metadata", async () => {
    const response = await request(app).get("/api/config");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("prescriptionTypes");
    expect(response.body).toHaveProperty("validDays");
    expect(response.body).toHaveProperty("doseRange");
    expect(response.body).toHaveProperty("bankHolidays");

    expect(Array.isArray(response.body.prescriptionTypes)).toBe(true);
    expect(Array.isArray(response.body.validDays)).toBe(true);
    expect(typeof response.body.doseRange.min).toBe("number");
    expect(typeof response.body.doseRange.max).toBe("number");
    expect(Array.isArray(response.body.bankHolidays)).toBe(true);
  });
});

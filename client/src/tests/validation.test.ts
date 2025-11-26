import { validateSchedulePayload } from "../utils/validation";
import type { ScheduleRequestPayload } from "../types/schedule";

const doseRange = { min: 0, max: 60 };

describe("validateSchedulePayload", () => {
  it("requires at least one available day", () => {
    const payload: ScheduleRequestPayload = {
      availableDays: [],
      prescriptionType: "stabilisation",
      stabilisationDose: 20,
    };

    const errors = validateSchedulePayload(payload, doseRange);
    expect(errors.availableDays).toBeDefined();
  });

  it("validates stabilisation dose within range", () => {
    const payload: ScheduleRequestPayload = {
      availableDays: ["Mon"],
      prescriptionType: "stabilisation",
      stabilisationDose: 100, // out of range
    };

    const errors = validateSchedulePayload(payload, doseRange);
    expect(errors.stabilisationDose).toBeDefined();
  });

  it("validates titration fields for increasing type", () => {
    const payload: ScheduleRequestPayload = {
      availableDays: ["Mon"],
      prescriptionType: "increasing",
      initialDailyDose: undefined,
      changeAmount: undefined,
      changeEveryNDays: undefined,
    };

    const errors = validateSchedulePayload(payload, doseRange);
    expect(errors.initialDailyDose).toBeDefined();
    expect(errors.changeAmount).toBeDefined();
    expect(errors.changeEveryNDays).toBeDefined();
  });
});

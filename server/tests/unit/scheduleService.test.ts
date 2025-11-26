import { computeSchedule } from "../../src/services/scheduleService";
import { ScheduleRequest } from "../../src/domain/models";

describe("scheduleService", () => {
  const fixedStartDate = new Date("2025-02-10T00:00:00Z"); // Mon

  it("returns 14 days for a stabilisation prescription", () => {
    const request: ScheduleRequest = {
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      prescriptionType: "stabilisation",
      stabilisationDose: 20
    };

    const schedule = computeSchedule(request, fixedStartDate);
    expect(schedule).toHaveLength(14);
    expect(schedule.every((d) => d.dose === 20)).toBe(true);
  });

  it("moves dose to previous day when user is unavailable", () => {
    const request: ScheduleRequest = {
      availableDays: ["Mon", "Wed", "Fri"], // no Tue
      prescriptionType: "stabilisation",
      stabilisationDose: 10
    };

    const schedule = computeSchedule(request, fixedStartDate);

    // Day 0: Mon, available → base 10
    // Day 1: Tue, unavailable → dose moved to Mon → Mon: 20, Tue: 0
    expect(schedule[0].dose).toBe(20);
    expect(schedule[1].dose).toBe(0);
  });
});

import { computeSchedule } from "../../src/services/scheduleService";
import type { ScheduleRequest } from "../../src/domain/models";

describe("computeSchedule (scheduleService)", () => {
  // Fixed start date so tests are deterministic.
  // 2025-02-10 is a Monday and not a UK bank holiday in our config.
  const fixedStartDate = new Date("2025-02-10T00:00:00Z");

  it("returns 14 days for a stabilisation prescription when all days are available", () => {
    const request: ScheduleRequest = {
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      prescriptionType: "stabilisation",
      stabilisationDose: 20,
    };

    const schedule = computeSchedule(request, fixedStartDate);

    expect(schedule).toHaveLength(14);
    // Every day should have the same dose when there are no restrictions.
    expect(schedule.every((d) => d.dose === 20)).toBe(true);
    // No bank holidays in this date range, so all flags should be false.
    expect(schedule.every((d) => d.isBankHoliday === false)).toBe(true);
  });

  it("moves dose to the most recent previous pickup day when a day is unavailable", () => {
    const request: ScheduleRequest = {
      availableDays: ["Mon", "Wed", "Fri"], // Tuesday is not a pickup day
      prescriptionType: "stabilisation",
      stabilisationDose: 10,
    };

    const schedule = computeSchedule(request, fixedStartDate);

    // Day 0: Mon (pickup) → base 10
    // Day 1: Tue (non-pickup) → base 10 moved back to Mon
    // Result: Mon: 20 ml, Tue: 0 ml
    expect(schedule[0].day).toBe("Mon");
    expect(schedule[0].dose).toBe(20);
    expect(schedule[1].day).toBe("Tue");
    expect(schedule[1].dose).toBe(0);
  });

  it("applies the increasing pattern correctly when all days are available", () => {
    const request: ScheduleRequest = {
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      prescriptionType: "increasing",
      initialDailyDose: 10,
      changeAmount: 10,
      changeEveryNDays: 3,
    };

    const schedule = computeSchedule(request, fixedStartDate);
    const doses = schedule.map((d) => d.dose);

    // For an increasing prescription:
    // dayIndex: 0–2 => 10, 3–5 => 20, 6–8 => 30, ...
    expect(doses[0]).toBe(10);
    expect(doses[1]).toBe(10);
    expect(doses[2]).toBe(10);
    expect(doses[3]).toBe(20);
    expect(doses[4]).toBe(20);
    expect(doses[5]).toBe(20);
  });

  it("never exceeds the maximum daily dose when doses are accumulated", () => {
    const request: ScheduleRequest = {
      availableDays: ["Mon", "Wed", "Fri"],
      prescriptionType: "increasing",
      initialDailyDose: 10,
      changeAmount: 10,
      changeEveryNDays: 3,
    };

    const schedule = computeSchedule(request, fixedStartDate);

    // All doses must be within the allowed range [0, 60].
    for (const day of schedule) {
      expect(day.dose).toBeGreaterThanOrEqual(0);
      expect(day.dose).toBeLessThanOrEqual(60);
    }
  });

  it("marks bank holidays and shifts their dose to the previous pickup day", () => {
    // 2025-12-25 and 2025-12-26 are configured UK bank holidays.
    // We choose a start date such that Christmas Day falls inside the 14-day window.
    const start = new Date("2025-12-20T00:00:00Z"); // Saturday

    const request: ScheduleRequest = {
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      prescriptionType: "stabilisation",
      stabilisationDose: 10,
    };

    const schedule = computeSchedule(request, start);

    const christmasIndex = schedule.findIndex(
      (d) => d.date === "2025-12-25"
    );
    expect(christmasIndex).toBeGreaterThanOrEqual(0);

    const christmasDay = schedule[christmasIndex];
    const previousDay = schedule[christmasIndex - 1];

    // Christmas must be marked as a bank holiday
    expect(christmasDay.isBankHoliday).toBe(true);
    // Because it is not a pickup day, its dose should have been shifted away.
    expect(christmasDay.dose).toBe(0);

    // Its base dose (10 ml) should have been added to the most recent previous pickup day.
    expect(previousDay.dose).toBeGreaterThanOrEqual(10);
  });
});

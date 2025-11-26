import { isBankHoliday } from "../../src/utils/bankHolidayUtils";

describe("bankHolidayUtils", () => {
  it("returns true for a configured bank holiday", () => {
    const date = new Date("2025-12-25T12:00:00Z");
    expect(isBankHoliday(date)).toBe(true);
  });

  it("returns false for a non-bank-holiday date", () => {
    const date = new Date("2025-02-10T12:00:00Z");
    expect(isBankHoliday(date)).toBe(false);
  });
});

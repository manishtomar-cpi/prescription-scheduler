import { buildBaseDoses, PrescriptionConfig } from "../../src/domain/prescriptionLogic";

describe("prescriptionLogic", () => {
  it("produces constant doses for stabilisation", () => {
    const config: PrescriptionConfig = {
      type: "stabilisation",
      stabilisationDose: 20
    };

    const doses = buildBaseDoses(config, 5);
    expect(doses).toEqual([20, 20, 20, 20, 20]);
  });

  it("increases dose every N days for increasing type", () => {
    const config: PrescriptionConfig = {
      type: "increasing",
      initialDailyDose: 10,
      changeAmount: 4,
      changeEveryNDays: 2
    };

    const doses = buildBaseDoses(config, 6);
    // days 0-1: 10, 10
    // days 2-3: 14, 14
    // days 4-5: 18, 18
    expect(doses).toEqual([10, 10, 14, 14, 18, 18]);
  });

  it("reduces dose every N days for reducing type", () => {
    const config: PrescriptionConfig = {
      type: "reducing",
      initialDailyDose: 20,
      changeAmount: 5,
      changeEveryNDays: 3
    };

    const doses = buildBaseDoses(config, 7);
    // days 0-2: 20
    // days 3-5: 15
    // day 6: 10
    expect(doses).toEqual([20, 20, 20, 15, 15, 15, 10]);
  });
});

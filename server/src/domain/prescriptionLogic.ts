import { MIN_DOSE, MAX_DOSE } from "../config/appConfig";
import { PrescriptionType } from "./models";

export interface PrescriptionConfig {
  type: PrescriptionType;
  stabilisationDose?: number;
  initialDailyDose?: number;
  changeAmount?: number;
  changeEveryNDays?: number;
}

export const clampDose = (dose: number): number => {
  if (dose < MIN_DOSE) return MIN_DOSE;
  if (dose > MAX_DOSE) return MAX_DOSE;
  return dose;
};

export const getBaseDoseForDayIndex = (
  config: PrescriptionConfig,
  dayIndex: number
): number => {
  if (config.type === "stabilisation") {
    return clampDose(config.stabilisationDose ?? 0);
  }

  const initial = config.initialDailyDose ?? 0;
  const everyN = config.changeEveryNDays ?? 1;
  const rawChangeAmount = config.changeAmount ?? 0;

  const numSteps = Math.floor(dayIndex / everyN);

  const signedChange =
    config.type === "increasing" ? rawChangeAmount : -rawChangeAmount;

  const dose = initial + signedChange * numSteps;

  return clampDose(dose);
};

export const buildBaseDoses = (
  config: PrescriptionConfig,
  totalDays: number
): number[] => {
  const doses: number[] = [];
  for (let i = 0; i < totalDays; i++) {
    doses.push(getBaseDoseForDayIndex(config, i));
  }
  return doses;
};

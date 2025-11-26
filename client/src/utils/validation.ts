import type { ScheduleRequestPayload } from "../types/schedule";

export type FormErrorMap = Partial<{
  availableDays: string;
  prescriptionType: string;
  stabilisationDose: string;
  initialDailyDose: string;
  changeAmount: string;
  changeEveryNDays: string;
}>;

export const hasErrors = (errors: FormErrorMap): boolean =>
  Object.values(errors).some((v) => Boolean(v));

interface DoseRange {
  min: number;
  max: number;
}

export const validateSchedulePayload = (
  payload: ScheduleRequestPayload,
  doseRange: DoseRange
): FormErrorMap => {
  const errors: FormErrorMap = {};

  if (!payload.availableDays || payload.availableDays.length === 0) {
    errors.availableDays = "Please select at least one available day.";
  }

  if (!payload.prescriptionType) {
    errors.prescriptionType = "Please select a prescription type.";
  }

  const { min, max } = doseRange;

  if (payload.prescriptionType === "stabilisation") {
    if (payload.stabilisationDose == null) {
      errors.stabilisationDose =
        "Please enter a daily stabilisation dose between the allowed range.";
    } else if (
      payload.stabilisationDose < min ||
      payload.stabilisationDose > max
    ) {
      errors.stabilisationDose = `Dose must be between ${min} and ${max} ml.`;
    }
  }

  if (
    payload.prescriptionType === "increasing" ||
    payload.prescriptionType === "reducing"
  ) {
    if (payload.initialDailyDose == null) {
      errors.initialDailyDose = "Initial daily dose is required.";
    } else if (
      payload.initialDailyDose < min ||
      payload.initialDailyDose > max
    ) {
      errors.initialDailyDose = `Initial dose must be between ${min} and ${max} ml.`;
    }

    if (payload.changeAmount == null) {
      errors.changeAmount = "Change amount is required.";
    } else if (payload.changeAmount <= 0) {
      errors.changeAmount = "Change amount must be greater than 0 ml.";
    }

    if (payload.changeEveryNDays == null) {
      errors.changeEveryNDays = "Please specify how often the change occurs.";
    } else if (payload.changeEveryNDays < 1 || payload.changeEveryNDays > 14) {
      errors.changeEveryNDays =
        "Change frequency must be between 1 and 14 days.";
    }
  }

  return errors;
};

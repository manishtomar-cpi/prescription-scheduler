import { z } from "zod";
import { MIN_DOSE, MAX_DOSE, VALID_DAYS } from "../config/appConfig";

export const scheduleRequestSchema = z.object({
  availableDays: z.array(z.enum(VALID_DAYS as [string, ...string[]])).min(1),

  prescriptionType: z.enum([
    "stabilisation",
    "increasing",
    "reducing"
  ]),

  stabilisationDose: z.number().min(MIN_DOSE).max(MAX_DOSE).optional(),

  initialDailyDose: z.number().min(MIN_DOSE).max(MAX_DOSE).optional(),
  changeAmount: z.number().optional(),
  changeEveryNDays: z.number().min(1).max(14).optional()
})
.superRefine((data, ctx) => {
  if (data.prescriptionType === "stabilisation") {
    if (data.stabilisationDose === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "stabilisationDose is required for stabilisation type"
      });
    }
  }

  if (data.prescriptionType === "increasing" || data.prescriptionType === "reducing") {
    if (
      data.initialDailyDose === undefined ||
      data.changeAmount === undefined ||
      data.changeEveryNDays === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "initialDailyDose, changeAmount, and changeEveryNDays are required for titration"
      });
    }
  }
});

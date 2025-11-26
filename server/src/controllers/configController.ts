import { Request, Response } from "express";
import { MIN_DOSE, MAX_DOSE, PRESCRIPTION_TYPES, VALID_DAYS } from "../config/appConfig";
import { UK_BANK_HOLIDAYS } from "../config/bankHolidays";

export const getConfigController = (_req: Request, res: Response) => {
  res.status(200).json({
    prescriptionTypes: Object.values(PRESCRIPTION_TYPES),
    validDays: VALID_DAYS,
    doseRange: {
      min: MIN_DOSE,
      max: MAX_DOSE
    },
    bankHolidays: UK_BANK_HOLIDAYS
  });
};

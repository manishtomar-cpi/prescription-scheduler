import { UK_BANK_HOLIDAYS } from "../config/bankHolidays";
import { toIsoDate } from "./dateUtils";

const bankHolidaySet = new Set(UK_BANK_HOLIDAYS);

export const isBankHoliday = (date: Date): boolean => {
  const iso = toIsoDate(date);
  return bankHolidaySet.has(iso);
};

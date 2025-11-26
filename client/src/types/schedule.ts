export type PrescriptionType = "stabilisation" | "increasing" | "reducing";

export interface ScheduleRequestPayload {
  availableDays: string[]; // e.g. ["Mon", "Tue"]
  prescriptionType: PrescriptionType;
  stabilisationDose?: number;
  initialDailyDose?: number;
  changeAmount?: number;
  changeEveryNDays?: number;
}

export interface DaySchedule {
  date: string; // ISO date, e.g. "2025-02-10"
  day: string;  // "Mon", "Tue", etc.
  dose: number;
}

export interface ConfigResponse {
  prescriptionTypes: PrescriptionType[];
  validDays: string[];
  doseRange: {
    min: number;
    max: number;
  };
  bankHolidays: string[];
}

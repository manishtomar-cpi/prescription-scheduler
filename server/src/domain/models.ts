export type PrescriptionType =
  | "stabilisation"
  | "increasing"
  | "reducing";

export interface ScheduleRequest {
  availableDays: string[]; // ["Mon", "Tue", ...]
  prescriptionType: PrescriptionType;

  // stabilisation only
  stabilisationDose?: number;

  // titration only (increasing or reducing)
  initialDailyDose?: number;
  changeAmount?: number;
  changeEveryNDays?: number;
}

export interface DaySchedule {
  date: string;      // ISO date
  day: string;       // Mon, Tue, etc.
  dose: number;      // ml
}

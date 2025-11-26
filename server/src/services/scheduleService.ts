import { ScheduleRequest, DaySchedule } from "../domain/models";
import { buildBaseDoses, PrescriptionConfig } from "../domain/prescriptionLogic";
import { getNextNDays, toIsoDate } from "../utils/dateUtils";

const TOTAL_DAYS = 14;

const mapRequestToConfig = (request: ScheduleRequest): PrescriptionConfig => {
  return {
    type: request.prescriptionType,
    stabilisationDose: request.stabilisationDose,
    initialDailyDose: request.initialDailyDose,
    changeAmount: request.changeAmount,
    changeEveryNDays: request.changeEveryNDays
  };
};

export const computeSchedule = (
  request: ScheduleRequest,
  startDate: Date = new Date()
): DaySchedule[] => {
  const config = mapRequestToConfig(request);

  const days = getNextNDays(startDate, TOTAL_DAYS);
  const baseDoses = buildBaseDoses(config, TOTAL_DAYS);

  const schedule: DaySchedule[] = days.map((day, index) => ({
    date: toIsoDate(day.date),
    day: day.dayName,
    dose: baseDoses[index]
  }));

  // availability and bank holidays will be applied here 
  return schedule;
};

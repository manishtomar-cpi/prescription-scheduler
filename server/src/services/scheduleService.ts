import { ScheduleRequest, DaySchedule } from "../domain/models";
import { buildBaseDoses, PrescriptionConfig } from "../domain/prescriptionLogic";
import { getNextNDays, toIsoDate } from "../utils/dateUtils";
import { isBankHoliday } from "../utils/bankHolidayUtils";

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

  // Apply availability + bank holiday rules:
  // If user is not available or it's a bank holiday:
  //  - Add that day's dose to the previous day (if exists)
  //  - Set current day dose to 0
  for (let i = 0; i < schedule.length; i++) {
    const current = schedule[i];
    const dateObj = days[i].date;

    const isAvailableDay = request.availableDays.includes(current.day);
    const isHoliday = isBankHoliday(dateObj);

    if (!isAvailableDay || isHoliday) {
      if (i > 0) {
        schedule[i - 1].dose += current.dose;
      }
      current.dose = 0;
    }
  }

  return schedule;
};

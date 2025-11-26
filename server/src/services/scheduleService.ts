import { ScheduleRequest, DaySchedule } from "../domain/models";
import {
  getBaseDoseForDayIndex,
  clampDose,
  PrescriptionConfig,
} from "../domain/prescriptionLogic";
import { getNextNDays, toIsoDate } from "../utils/dateUtils";
import { isBankHoliday } from "../utils/bankHolidayUtils";

const TOTAL_DAYS = 14;

/**
 * Converts the incoming request into a domain-level configuration object.
 * This keeps the dosing logic independent from the transport layer.
 */
const mapRequestToConfig = (req: ScheduleRequest): PrescriptionConfig => ({
  type: req.prescriptionType,
  stabilisationDose: req.stabilisationDose,
  initialDailyDose: req.initialDailyDose,
  changeAmount: req.changeAmount,
  changeEveryNDays: req.changeEveryNDays,
});

/**
 * Computes the full 14-day dosing schedule using a single-pass algorithm.
 *
 * Algorithm (O(n)):
 *  - For each day:
 *      1. Compute the base dose for that day (stabilisation/increasing/reducing)
 *      2. Determine if the user can pick up medication on that day
 *      3. If the day is a pickup day:
 *            - Store the base dose here
 *            - Remember this index as the "last pickup day"
 *         Otherwise:
 *            - Transfer the base dose to the most recent pickup day
 *            - Set the current day's dose to 0 ml
 *  - All doses are clamped to the valid range [0, 60].
 */
export const computeSchedule = (
  request: ScheduleRequest,
  startDate: Date = new Date()
): DaySchedule[] => {
  const config = mapRequestToConfig(request);
  const calendarDays = getNextNDays(startDate, TOTAL_DAYS);

  const schedule: DaySchedule[] = new Array(TOTAL_DAYS);

  // Tracks the index of the most recent valid pickup day (Mon/Wed/Fri and not a holiday)
  let lastPickupIndex = -1;

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const dayInfo = calendarDays[i];

    // --- Step 1: Calculate base dose for this day (before availability rules)
    const baseDose = getBaseDoseForDayIndex(config, i);

    // --- Step 2: Determine if today is a valid pickup day
    const isPickupDay =
      request.availableDays.includes(dayInfo.dayName) &&
      !isBankHoliday(dayInfo.date);

    if (isPickupDay) {
      /**
       * This is a valid pickup day.
       * We store the base dose here, clamped to the allowed range.
       * This also becomes the "most recent pickup day" for future transfers.
       */
      schedule[i] = {
        date: toIsoDate(dayInfo.date),
        day: dayInfo.dayName,
        dose: clampDose(baseDose),
         isBankHoliday: false,
      };

      lastPickupIndex = i;
    } else {
      /**
       * This is NOT a pickup day.
       * According to the requirement, its dose must be added to the
       * most recent previous pickup day (if one exists).
       * After the transfer, this day must always show 0 ml.
       */
      if (lastPickupIndex !== -1 && baseDose > 0) {
        const newDose = schedule[lastPickupIndex].dose + baseDose;
        schedule[lastPickupIndex].dose = clampDose(newDose);
      }

      // Non-pickup days always display 0 ml in the final schedule.
      schedule[i] = {
        date: toIsoDate(dayInfo.date),
        day: dayInfo.dayName,
        dose: 0,
         isBankHoliday: isBankHoliday(dayInfo.date)
      };
    }
  }

  return schedule;
};

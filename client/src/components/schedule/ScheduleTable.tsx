import type { DaySchedule } from "../../types/schedule";

interface ScheduleTableProps {
  schedule: DaySchedule[];
}

export const ScheduleTable = ({ schedule }: ScheduleTableProps) => {
  if (!schedule.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-3 text-lg font-semibold text-slate-100">
        14-day schedule
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400">
                #
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400">
                Date
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400">
                Day
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-400">
                Dose (ml)
              </th>
            </tr>
          </thead>

          <tbody>
            {schedule.map((entry, index) => {
              const isZeroDose = entry.dose === 0;
              const isHoliday = entry.isBankHoliday;

              return (
                <tr
                  key={entry.date + index}
                  className={`border-b border-slate-800 last:border-0 transition
                    ${isHoliday ? "bg-red-900/20" : ""}
                  `}
                >
                  {/* Index */}
                  <td className="px-3 py-2 text-xs text-slate-400">
                    {index + 1}
                  </td>

                  {/* Date + Badge */}
                  <td className="px-3 py-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      {entry.date}

                      {isHoliday && (
                        <span className="inline-flex items-center rounded-full bg-red-600/20 px-2 py-0.5 text-[0.6rem] font-medium text-red-400">
                          Bank Holiday
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Day */}
                  <td className="px-3 py-2 text-xs text-slate-200">
                    {entry.day}
                  </td>

                  {/* Dose */}
                  <td
                    className={`px-3 py-2 text-xs text-right font-medium
                      ${isZeroDose ? "text-slate-500" : "text-emerald-300"}
                    `}
                  >
                    {entry.dose.toFixed(1).replace(/\.0$/, "")}

                    {isZeroDose && (
                      <span className="ml-1 text-[0.65rem] text-slate-500">
                        (no dose)
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[0.7rem] text-slate-500">
        Days with 0 ml indicate user unavailability or UK bank holidays where
        the dose was transferred to a previous available day.
      </p>
    </div>
  );
};

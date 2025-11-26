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
      <h2 className="text-lg font-semibold text-slate-100 mb-3">
        14-day schedule
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
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
              return (
                <tr
                  key={entry.date + entry.day + index}
                  className="border-b border-slate-800 last:border-0"
                >
                  <td className="px-3 py-2 text-xs text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-200">
                    {entry.date}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-200">
                    {entry.day}
                  </td>
                  <td
                    className={`px-3 py-2 text-xs text-right font-medium ${
                      isZeroDose ? "text-slate-500" : "text-emerald-300"
                    }`}
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
        the dose was moved to a previous available day.
      </p>
    </div>
  );
};

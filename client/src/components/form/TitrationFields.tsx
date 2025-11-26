interface TitrationFieldsProps {
  initialDose: string;
  changeAmount: string;
  changeEveryNDays: string;
  errors?: {
    initialDailyDose?: string;
    changeAmount?: string;
    changeEveryNDays?: string;
  };
  minDose: number;
  maxDose: number;
  onChange: (field: "initialDose" | "changeAmount" | "changeEveryNDays", value: string) => void;
}

export const TitrationFields = ({
  initialDose,
  changeAmount,
  changeEveryNDays,
  errors,
  minDose,
  maxDose,
  onChange
}: TitrationFieldsProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-200">
          Initial daily dose (ml)
        </label>
        <input
          type="number"
          min={minDose}
          max={maxDose}
          value={initialDose}
          onChange={(e) => onChange("initialDose", e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder={`${minDose} - ${maxDose}`}
        />
        {errors?.initialDailyDose && (
          <p
            className="text-xs text-rose-400"
            data-testid="initial-dose-error"
          >
            {errors.initialDailyDose}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-200">
          Change amount (ml)
        </label>
        <input
          type="number"
          value={changeAmount}
          onChange={(e) => onChange("changeAmount", e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="e.g. 4"
        />
        {errors?.changeAmount && (
          <p
            className="text-xs text-rose-400"
            data-testid="change-amount-error"
          >
            {errors.changeAmount}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-200">
          Change every N days
        </label>
        <input
          type="number"
          min={1}
          max={14}
          value={changeEveryNDays}
          onChange={(e) => onChange("changeEveryNDays", e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="e.g. 3"
        />
        {errors?.changeEveryNDays && (
          <p
            className="text-xs text-rose-400"
            data-testid="change-every-error"
          >
            {errors.changeEveryNDays}
          </p>
        )}
      </div>
    </div>
  );
};

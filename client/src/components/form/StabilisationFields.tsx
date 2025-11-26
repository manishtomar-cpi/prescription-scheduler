interface StabilisationFieldsProps {
  value: string;
  error?: string;
  minDose: number;
  maxDose: number;
  onChange: (value: string) => void;
}

export const StabilisationFields = ({
  value,
  error,
  minDose,
  maxDose,
  onChange
}: StabilisationFieldsProps) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-200">
        Daily dose (ml)
      </label>
      <input
        type="number"
        min={minDose}
        max={maxDose}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
        placeholder={`${minDose} - ${maxDose}`}
      />
      {error && (
        <p className="text-xs text-rose-400" data-testid="stabilisation-error">
          {error}
        </p>
      )}
    </div>
  );
};

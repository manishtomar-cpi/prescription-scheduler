import type { ChangeEvent } from "react";

interface AvailabilitySelectorProps {
  validDays: string[];
  selectedDays: string[];
  error?: string;
  onChange: (days: string[]) => void;
}

export const AvailabilitySelector = ({
  validDays,
  selectedDays,
  error,
  onChange
}: AvailabilitySelectorProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      onChange([...selectedDays, value]);
    } else {
      onChange(selectedDays.filter((d) => d !== value));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-200 mb-1">
        Available days of the week
      </label>
      <div className="flex flex-wrap gap-2">
        {validDays.map((day) => (
          <label
            key={day}
            className="inline-flex items-center gap-1 text-sm text-slate-200"
          >
            <input
              type="checkbox"
              value={day}
              checked={selectedDays.includes(day)}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
            />
            <span>{day}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-400" data-testid="availability-error">
          {error}
        </p>
      )}
    </div>
  );
};

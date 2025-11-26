import type { PrescriptionType } from "../../types/schedule";

interface PrescriptionTypeSelectorProps {
  types: PrescriptionType[];
  value: PrescriptionType | "";
  error?: string;
  onChange: (type: PrescriptionType) => void;
}

export const PrescriptionTypeSelector = ({
  types,
  value,
  error,
  onChange
}: PrescriptionTypeSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-200 mb-1">
        Prescription type
      </label>
      <div className="flex flex-wrap gap-3">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
              value === type
                ? "border-sky-500 bg-sky-500/20 text-sky-300"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-500/60"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-400" data-testid="type-error">
          {error}
        </p>
      )}
    </div>
  );
};

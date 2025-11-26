import { useState } from "react";
import type { FormEvent } from "react";

import type {
  ConfigResponse,
  PrescriptionType,
  ScheduleRequestPayload,
} from "../../types/schedule";
import { hasErrors, validateSchedulePayload } from "../../utils/validation";
import type { FormErrorMap } from "../../utils/validation";
import { AvailabilitySelector } from "./AvailabilitySelector";
import { PrescriptionTypeSelector } from "./PrescriptionTypeSelector";
import { StabilisationFields } from "./StabilisationFields";
import { TitrationFields } from "./TitrationFields";

interface PrescriptionFormProps {
  config: ConfigResponse;
  onSubmit: (payload: ScheduleRequestPayload) => void;
}

interface FormState {
  availableDays: string[];
  prescriptionType: PrescriptionType | "";
  stabilisationDose: string;
  initialDailyDose: string;
  changeAmount: string;
  changeEveryNDays: string;
}

export const PrescriptionForm = ({
  config,
  onSubmit,
}: PrescriptionFormProps) => {
  const [state, setState] = useState<FormState>({
    availableDays: [],
    prescriptionType: "",
    stabilisationDose: "",
    initialDailyDose: "",
    changeAmount: "",
    changeEveryNDays: "",
  });

  const [errors, setErrors] = useState<FormErrorMap>({});

  const handleAvailableDaysChange = (days: string[]) => {
    setState((prev) => ({ ...prev, availableDays: days }));
  };

  const handleTypeChange = (type: PrescriptionType) => {
    setState((prev) => ({
      ...prev,
      prescriptionType: type,
      // reset type-specific fields when switching
      stabilisationDose: "",
      initialDailyDose: "",
      changeAmount: "",
      changeEveryNDays: "",
    }));
    setErrors((prev) => ({
      ...prev,
      stabilisationDose: undefined,
      initialDailyDose: undefined,
      changeAmount: undefined,
      changeEveryNDays: undefined,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!state.prescriptionType) {
      setErrors((prev) => ({
        ...prev,
        prescriptionType: "Please select a prescription type.",
      }));
      return;
    }

    const payload: ScheduleRequestPayload = {
      availableDays: state.availableDays,
      prescriptionType: state.prescriptionType,
    };

    if (state.prescriptionType === "stabilisation") {
      payload.stabilisationDose =
        state.stabilisationDose.trim() === ""
          ? undefined
          : Number(state.stabilisationDose);
    } else {
      payload.initialDailyDose =
        state.initialDailyDose.trim() === ""
          ? undefined
          : Number(state.initialDailyDose);
      payload.changeAmount =
        state.changeAmount.trim() === ""
          ? undefined
          : Number(state.changeAmount);
      payload.changeEveryNDays =
        state.changeEveryNDays.trim() === ""
          ? undefined
          : Number(state.changeEveryNDays);
    }

    const validationErrors = validateSchedulePayload(payload, config.doseRange);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(payload);
  };

  const isTitration =
    state.prescriptionType === "increasing" ||
    state.prescriptionType === "reducing";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6"
    >
      <h2 className="text-lg font-semibold text-slate-100 mb-2">
        Stage 1 – Prescription details
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Provide the user&apos;s availability and prescription details. The
        schedule will be calculated in the next stage.
      </p>

      <AvailabilitySelector
        validDays={config.validDays}
        selectedDays={state.availableDays}
        error={errors.availableDays}
        onChange={handleAvailableDaysChange}
      />

      <PrescriptionTypeSelector
        types={config.prescriptionTypes}
        value={state.prescriptionType}
        error={errors.prescriptionType}
        onChange={handleTypeChange}
      />

      {state.prescriptionType === "stabilisation" && (
        <StabilisationFields
          value={state.stabilisationDose}
          error={errors.stabilisationDose}
          minDose={config.doseRange.min}
          maxDose={config.doseRange.max}
          onChange={(value) =>
            setState((prev) => ({ ...prev, stabilisationDose: value }))
          }
        />
      )}

      {isTitration && (
        <TitrationFields
          initialDose={state.initialDailyDose}
          changeAmount={state.changeAmount}
          changeEveryNDays={state.changeEveryNDays}
          minDose={config.doseRange.min}
          maxDose={config.doseRange.max}
          errors={{
            initialDailyDose: errors.initialDailyDose,
            changeAmount: errors.changeAmount,
            changeEveryNDays: errors.changeEveryNDays,
          }}
          onChange={(field, value) =>
            setState((prev) => ({
              ...prev,
              ...(field === "initialDose" && { initialDailyDose: value }),
              ...(field === "changeAmount" && { changeAmount: value }),
              ...(field === "changeEveryNDays" && {
                changeEveryNDays: value,
              }),
            }))
          }
        />
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60"
        >
          Preview schedule input
        </button>
      </div>
    </form>
  );
};

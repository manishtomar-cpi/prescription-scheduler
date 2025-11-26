import { useState } from "react";
import { createSchedule } from "../api/scheduleApi";
import type { ScheduleRequestPayload, DaySchedule } from "../types/schedule";

export type ScheduleStatus = "idle" | "loading" | "success" | "error";

interface UseScheduleResult {
  schedule: DaySchedule[] | null;
  status: ScheduleStatus;
  error: string | null;
  requestId: string | null;
  requestSchedule: (payload: ScheduleRequestPayload) => Promise<void>;
  reset: () => void;
}

export const useSchedule = (): UseScheduleResult => {
  const [schedule, setSchedule] = useState<DaySchedule[] | null>(null);
  const [status, setStatus] = useState<ScheduleStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const requestSchedule = async (payload: ScheduleRequestPayload) => {
    try {
      setStatus("loading");
      setError(null);

      const response = await createSchedule(payload);

      setSchedule(response.schedule);
      setRequestId(response.requestId ?? null);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setSchedule(null);
      setRequestId(null);

      const message =
        err instanceof Error ? err.message : "Failed to generate schedule";
      setError(message);
    }
  };

  const reset = () => {
    setSchedule(null);
    setStatus("idle");
    setError(null);
    setRequestId(null);
  };

  return {
    schedule,
    status,
    error,
    requestId,
    requestSchedule,
    reset
  };
};

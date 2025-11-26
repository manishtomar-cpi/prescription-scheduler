import { useState } from "react";
import { createSchedule } from "../api/scheduleApi";
import type {
  ScheduleRequestPayload,
  DaySchedule,
  ScheduleResponse
} from "../types/schedule";

export type ScheduleStatus = "idle" | "loading" | "success" | "error";

interface UseScheduleResult {
  schedule: DaySchedule[] | null;
  status: ScheduleStatus;
  error: string | null;
  requestId: string | null;
  requestSchedule: (payload: ScheduleRequestPayload) => Promise<boolean>;
  reset: () => void;
}

/**
 * useSchedule
 *
 * Small state machine around the schedule API:
 * - keeps track of loading / success / error state
 * - exposes the last schedule and requestId
 * - returns a boolean from requestSchedule so callers can show toasts, etc.
 */
export const useSchedule = (): UseScheduleResult => {
  const [schedule, setSchedule] = useState<DaySchedule[] | null>(null);
  const [status, setStatus] = useState<ScheduleStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const requestSchedule = async (
    payload: ScheduleRequestPayload
  ): Promise<boolean> => {
    try {
      setStatus("loading");
      setError(null);

      const response: ScheduleResponse = await createSchedule(payload);

      setSchedule(response.schedule);
      setRequestId(response.requestId ?? null);
      setStatus("success");
      return true;
    } catch (err) {
      setStatus("error");
      setSchedule(null);
      setRequestId(null);

      const message =
        err instanceof Error ? err.message : "Failed to generate schedule";
      setError(message);
      return false;
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

import { apiClient } from "./httpClient";
import type {
  ScheduleRequestPayload,
  ScheduleResponse
} from "../types/schedule";

export const createSchedule = async (
  payload: ScheduleRequestPayload
): Promise<ScheduleResponse> => {
  return apiClient.post<ScheduleRequestPayload, ScheduleResponse>(
    "/schedule",
    payload
  );
};

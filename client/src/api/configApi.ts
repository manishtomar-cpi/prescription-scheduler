import { apiClient } from "./httpClient";
import type { ConfigResponse } from "../types/schedule";

export const fetchConfig = async (): Promise<ConfigResponse> => {
  return apiClient.get<ConfigResponse>("/config");
};

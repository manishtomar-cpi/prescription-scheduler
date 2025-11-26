import { apiClient } from "./httpClient";

export interface HealthResponse {
  status: string;
  message: string;
}

export const fetchHealth = async (): Promise<HealthResponse> => {
  return apiClient.get<HealthResponse>("/health");
};

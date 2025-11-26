const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Request failed with status ${response.status}${
        text ? `: ${text}` : ""
      }`
    );
  }
  return response.json() as Promise<T>;
};

export const apiClient = {
  get: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${path}`);
    return handleResponse<T>(res);
  },
  post: async <TBody, TResponse>(
    path: string,
    body: TBody
  ): Promise<TResponse> => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return handleResponse<TResponse>(res);
  }
};

export { API_BASE_URL };

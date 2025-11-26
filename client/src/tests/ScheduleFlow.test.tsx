import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import type { ConfigResponse, ScheduleResponse } from "../types/schedule";

// Mock health API
vi.mock("../api/healthApi", () => ({
  fetchHealth: vi.fn().mockResolvedValue({
    status: "ok",
    message: "Server is healthy",
  }),
}));

// Mock config API
vi.mock("../api/configApi", () => ({
  fetchConfig: vi.fn().mockResolvedValue({
    prescriptionTypes: ["stabilisation", "increasing", "reducing"],
    validDays: ["Mon", "Tue", "Wed"],
    doseRange: { min: 0, max: 60 },
    bankHolidays: [],
  } as ConfigResponse),
}));

// Mock schedule API
vi.mock("../api/scheduleApi", () => ({
  createSchedule: vi.fn().mockResolvedValue({
    requestId: "test-123",
    schedule: [
      { date: "2025-02-10", day: "Mon", dose: 20, isBankHoliday: false },
      { date: "2025-02-11", day: "Tue", dose: 0, isBankHoliday: false },
    ],
  } as ScheduleResponse),
}));

describe("Schedule flow", () => {
  it("submits form and displays schedule table", async () => {
    render(<App />);

    // Wait for config to load and the prescription form to render.
    // We specifically look for the heading to avoid multiple text matches.
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /Prescription details/i })
      ).toBeInTheDocument()
    );

    // Select availability day
    const monCheckbox = screen.getByLabelText("Mon") as HTMLInputElement;
    fireEvent.click(monCheckbox);

    // Select stabilisation type
    const stabilisationButton = screen.getByRole("button", {
      name: /Stabilisation/i,
    });
    fireEvent.click(stabilisationButton);

    // Enter dose
    const doseInput = screen.getByPlaceholderText(
      "0 - 60"
    ) as HTMLInputElement;
    fireEvent.change(doseInput, { target: { value: "20" } });

    // Submit form
    const submitButton = screen.getByRole("button", {
      name: /Preview schedule input/i,
    });
    fireEvent.click(submitButton);

    // Expect schedule table to show mocked data
    await waitFor(() => {
      expect(screen.getByText("2025-02-10")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
    });

    // Toast should appear
    await waitFor(() => {
      expect(
        screen.getByText(
          /Schedule generated successfully for the next 14 days/i
        )
      ).toBeInTheDocument();
    });
  });
});

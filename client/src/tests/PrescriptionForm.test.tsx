import { render, screen, fireEvent } from "@testing-library/react";
import { PrescriptionForm } from "../components/form/PrescriptionForm";
import type { ConfigResponse } from "../types/schedule";

const mockConfig: ConfigResponse = {
  prescriptionTypes: ["stabilisation", "increasing", "reducing"],
  validDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  doseRange: { min: 0, max: 60 },
  bankHolidays: []
};

describe("PrescriptionForm", () => {
  it("renders availability and type selectors", () => {
    const handleSubmit = vi.fn();

    render(<PrescriptionForm config={mockConfig} onSubmit={handleSubmit} />);

    expect(
      screen.getByText(/available days of the week/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/prescription type/i)).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", () => {
    const handleSubmit = vi.fn();

    render(<PrescriptionForm config={mockConfig} onSubmit={handleSubmit} />);

    const button = screen.getByRole("button", {
      name: /preview schedule input/i
    });

    fireEvent.click(button);

    expect(screen.getByTestId("type-error")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with valid stabilisation payload", () => {
    const handleSubmit = vi.fn();

    render(<PrescriptionForm config={mockConfig} onSubmit={handleSubmit} />);

    // select availability day
    const monCheckbox = screen.getByLabelText("Mon") as HTMLInputElement;
    fireEvent.click(monCheckbox);

    // choose stabilisation type
    const stabilisationButton = screen.getByRole("button", {
      name: /Stabilisation/i
    });
    fireEvent.click(stabilisationButton);

    // enter dose
    const doseInput = screen.getByPlaceholderText("0 - 60") as HTMLInputElement;
    fireEvent.change(doseInput, { target: { value: "20" } });

    const button = screen.getByRole("button", {
      name: /preview schedule input/i
    });
    fireEvent.click(button);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      availableDays: ["Mon"],
      prescriptionType: "stabilisation",
      stabilisationDose: 20
    });
  });
});

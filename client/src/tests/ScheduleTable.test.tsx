import { render, screen } from "@testing-library/react";
import { ScheduleTable } from "../components/schedule/ScheduleTable";
import type { DaySchedule } from "../types/schedule";

const sampleSchedule: DaySchedule[] = [
  { date: "2025-02-10", day: "Mon", dose: 20, isBankHoliday: false },
  { date: "2025-02-11", day: "Tue", dose: 0, isBankHoliday: false },
];

describe("ScheduleTable", () => {
  it("renders rows for each schedule entry", () => {
    render(<ScheduleTable schedule={sampleSchedule} />);

    // First row
    expect(screen.getByText("2025-02-10")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();

    // Second row
    expect(screen.getByText("2025-02-11")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    // "(no dose)" label for zero-dose day
    expect(screen.getByText("(no dose)")).toBeInTheDocument();
  });
});

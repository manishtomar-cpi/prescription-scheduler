import { render, screen } from "@testing-library/react";
import { ScheduleTable } from "../components/schedule/ScheduleTable";
import type { DaySchedule } from "../types/schedule";

const sampleSchedule: DaySchedule[] = [
  { date: "2025-02-10", day: "Mon", dose: 20 },
  { date: "2025-02-11", day: "Tue", dose: 0 }
];

describe("ScheduleTable", () => {
  it("renders rows for each schedule entry", () => {
    render(<ScheduleTable schedule={sampleSchedule} />);

    expect(screen.getByText("2025-02-10")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();

    expect(screen.getByText("2025-02-11")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

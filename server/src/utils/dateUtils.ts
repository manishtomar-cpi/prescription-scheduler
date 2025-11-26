export interface DateWithDayName {
  date: Date;
  dayName: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const getNextNDays = (
  startDate: Date,
  n: number
): DateWithDayName[] => {
  const days: DateWithDayName[] = [];

  for (let i = 0; i < n; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dayName = DAY_NAMES[d.getDay()];
    days.push({ date: d, dayName });
  }

  return days;
};

export const toIsoDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

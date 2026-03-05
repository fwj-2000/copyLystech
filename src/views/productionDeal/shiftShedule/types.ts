export interface IDayData {
  day: number;
  weekday: string;
  is_weekend: boolean;
  is_holiday: boolean;
}

export interface IMonthData {
  month: number;
  name: string;
  days: IDayData[];
}

export interface ICalendarData {
  year: number;
  months: IMonthData[];
}

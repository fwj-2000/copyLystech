import dayjs from 'dayjs';

export enum ShiftType {
  DayShift = '1',
  NightShift = '2',
}

export function getShiftType(): ShiftType {
  const hour = dayjs().hour();
  return hour >= 8 && hour < 20 ? ShiftType.DayShift : ShiftType.NightShift;
}

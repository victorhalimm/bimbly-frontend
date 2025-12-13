export interface AvailabilitySlot {
  start: string;
  end: string;
  dayOfWeek: number;
}

export type AvailabilitySchedule = AvailabilitySlot[];

export interface DaySchedule {
  enabled: boolean;
  slots: { start: string; end: string }[];
}

export interface WeekSchedule {
  0: DaySchedule;
  1: DaySchedule;
  2: DaySchedule;
  3: DaySchedule;
  4: DaySchedule;
  5: DaySchedule;
  6: DaySchedule;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DayInfo {
  dayOfWeek: DayOfWeek;
  label: string;
  fullLabel: string;
}

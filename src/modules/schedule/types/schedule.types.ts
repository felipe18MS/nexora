export type DayOfWeek =
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ScheduleInterval {
  id: string;
  startTime: string;
  endTime: string;
}

export interface BusinessScheduleDay {
  day: DayOfWeek;
  label: string;
  shortLabel: string;
  isOpen: boolean;
  intervals: ScheduleInterval[];
}

export type UpdateScheduleDayRequest = Pick<BusinessScheduleDay, 'isOpen' | 'intervals'>;

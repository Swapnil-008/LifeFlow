import { toDateKey } from './mood';

export const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** The current Mon–Sun week as local date-keys, oldest first. */
export const currentWeekKeys = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateKey(d);
  });
};

/** Set of a habit's completedDates as local date-keys, for quick lookups. */
export const completedKeySet = (completedDates = []) => new Set(completedDates.map((d) => toDateKey(d)));

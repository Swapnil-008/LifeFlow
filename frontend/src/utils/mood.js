export const MOODS = [
  { value: 'terrible', emoji: '😞', label: 'Terrible' },
  { value: 'bad', emoji: '😐', label: 'Bad' },
  { value: 'okay', emoji: '🙂', label: 'Okay' },
  { value: 'good', emoji: '😄', label: 'Good' },
  { value: 'amazing', emoji: '🤩', label: 'Amazing' },
];

export const moodEmoji = (value) => MOODS.find((m) => m.value === value)?.emoji || null;
export const moodLabel = (value) => MOODS.find((m) => m.value === value)?.label || null;

// YYYY-MM-DD in local time (not UTC) so "today" matches the user's own day.
export const toDateKey = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
};

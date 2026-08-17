const DAY_MS = 24 * 60 * 60 * 1000;

/** Normalizes any date input to UTC midnight, so it can be used as a stable day-key. */
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const dateKey = (date) => normalizeDate(date).toISOString().slice(0, 10);

/**
 * Computes current + longest streak from a habit's completedDates.
 *
 * `referenceDate` is the day to treat as "today" when walking the current
 * streak backwards. Callers should pass the date-key the client just acted
 * on (its own local "today") rather than relying on the server's clock, so
 * a streak doesn't wobble around midnight for users in other timezones.
 * Defaults to the server's current time for read-only endpoints where that
 * precision doesn't matter (see habitController.presentHabit).
 */
const computeStreaks = (completedDates, referenceDate = new Date()) => {
  const keys = new Set(completedDates.map((d) => dateKey(d)));
  if (keys.size === 0) return { currentStreak: 0, longestStreak: 0 };

  const today = normalizeDate(referenceDate);
  // If today isn't marked done yet, the streak is still "alive" through
  // yesterday — it only breaks on an actual missed day, not on an
  // unfinished today.
  let cursor = keys.has(dateKey(today)) ? today : new Date(today.getTime() - DAY_MS);
  let currentStreak = 0;
  while (keys.has(dateKey(cursor))) {
    currentStreak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }

  const sortedKeys = [...keys].sort();
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < sortedKeys.length; i++) {
    const prev = new Date(`${sortedKeys[i - 1]}T00:00:00.000Z`).getTime();
    const cur = new Date(`${sortedKeys[i]}T00:00:00.000Z`).getTime();
    run = cur - prev === DAY_MS ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
  }

  return { currentStreak, longestStreak };
};

/** % of the trailing `days` days (inclusive of referenceDate) that are completed. */
const completionRate = (completedDates, days, referenceDate = new Date()) => {
  const keys = new Set(completedDates.map((d) => dateKey(d)));
  const today = normalizeDate(referenceDate);
  let done = 0;
  for (let i = 0; i < days; i++) {
    if (keys.has(dateKey(new Date(today.getTime() - i * DAY_MS)))) done += 1;
  }
  return Math.round((done / days) * 100);
};

module.exports = { normalizeDate, dateKey, computeStreaks, completionRate };

const mongoose = require('mongoose');
const Activity = require('../models/Activity');

const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Idempotent activity writer.
 * The same referenced task/habit/type can only create one activity for a
 * user on a calendar day. Marking, unmarking and re-marking therefore never
 * creates a stream of duplicate activity rows.
 */
const recordActivity = async (
  userId,
  { type, title, description = '', refId = null, refModel = null, date = new Date() }
) => {
  const normalizedDate = normalizeDate(date);
  const filter = { userId, type, refId, date: normalizedDate };

  try {
    return await Activity.findOneAndUpdate(
      filter,
      {
        $setOnInsert: {
          userId,
          type,
          title,
          description,
          refId,
          refModel,
          date: normalizedDate,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    if (err?.code === 11000) {
      return Activity.findOne(filter);
    }
    console.error('Failed to record activity:', err.message);
    return null;
  }
};

/**
 * One-time/boot-time cleanup for activity rows written by older versions
 * before the per-item/day uniqueness rule existed. Keeps the newest row.
 */
const deduplicateActivities = async () => {
  const groups = await Activity.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { userId: '$userId', type: '$type', refId: '$refId', date: '$date' },
        ids: { $push: '$_id' },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ]);

  let removed = 0;
  for (const group of groups) {
    const duplicateIds = group.ids.slice(1);
    if (!duplicateIds.length) continue;
    const result = await Activity.deleteMany({ _id: { $in: duplicateIds } });
    removed += result.deletedCount || 0;
  }
  return removed;
};

const getHeatmapData = async (userId, days = 365) => {
  const today = normalizeDate(new Date());
  const start = new Date(today.getTime() - (days - 1) * DAY_MS);

  const counts = await Activity.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: start, $lte: today },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = new Map(counts.map((c) => [c._id, c.count]));
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * DAY_MS);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: countMap.get(key) || 0 });
  }
  return result;
};

module.exports = { normalizeDate, recordActivity, deduplicateActivities, getHeatmapData };

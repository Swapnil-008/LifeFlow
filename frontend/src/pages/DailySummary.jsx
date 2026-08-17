import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import summaryService from '../services/summaryService';
import MoodPicker from '../components/summary/MoodPicker';
import RatingStars from '../components/summary/RatingStars';
import DailyStatsRow from '../components/summary/DailyStatsRow';
import Spinner from '../components/ui/Spinner';
import { useToast } from '../context/ToastContext';
import { toDateKey } from '../utils/mood';

const emptyForm = { accomplishments: '', challenges: '', notes: '', mood: null, rating: null };

function DailySummary() {
  const navigate = useNavigate();
  const { show: showToast } = useToast();
  const [cursor, setCursor] = useState(new Date());
  const [summary, setSummary] = useState(null);
  const [dailyStats, setDailyStats] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const dateKey = toDateKey(cursor);
  const isToday = dateKey === toDateKey(new Date());
  const isFuture = cursor > new Date();

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await summaryService.getByDate(dateKey);
      setSummary(data.summary);
      setDailyStats(data.dailyStats);
      setForm(
        data.summary
          ? {
              accomplishments: data.summary.accomplishments || '',
              challenges: data.summary.challenges || '',
              notes: data.summary.notes || '',
              mood: data.summary.mood || null,
              rating: data.summary.rating || null,
            }
          : emptyForm
      );
    } catch {
      setError('Could not load this day. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [dateKey]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const updateForm = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const changeDay = (delta) => {
    const next = new Date(cursor);
    next.setDate(next.getDate() + delta);
    setCursor(next);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (summary) {
        await summaryService.update(dateKey, form);
      } else {
        await summaryService.create({ ...form, date: dateKey });
      }
      showToast(isToday ? "Today's reflection saved" : 'Daily summary saved');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your reflection');
      setSaving(false);
    }
  };

  return (
    <div className="page-shell max-w-5xl animate-fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Daily Summary</h1><p className="page-subtitle">Close the loop on what you accomplished and how the day felt.</p></div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeDay(-1)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-card"
            aria-label="Previous day"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-ink-soft w-32 text-center">
            {isToday
              ? 'Today'
              : cursor.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={() => changeDay(1)}
            disabled={isToday}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-card disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next day"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-10 flex items-center justify-center">
          <Spinner />
        </div>
      ) : isFuture ? (
        <div className="card p-8 text-center text-ink-muted text-sm">You can't reflect on a day that hasn't happened yet.</div>
      ) : (
        <div className="card p-6 sm:p-8">
          <p className="font-display text-lg mb-4">How was your day?</p>

          <div className="mb-5">
            <DailyStatsRow stats={dailyStats} />
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">What did you accomplish?</label>
              <textarea
                value={form.accomplishments}
                onChange={(e) => updateForm({ accomplishments: e.target.value })}
                rows={3}
                placeholder="Completed my AWS work and solved a couple of DSA problems…"
                className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">What went well?</label>
              <textarea
                value={form.notes}
                onChange={(e) => updateForm({ notes: e.target.value })}
                rows={2}
                placeholder="Stayed focused during the afternoon…"
                className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">What could be improved?</label>
              <textarea
                value={form.challenges}
                onChange={(e) => updateForm({ challenges: e.target.value })}
                rows={2}
                placeholder="Need to reduce distractions…"
                className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">Mood</label>
              <MoodPicker value={form.mood} onChange={(mood) => updateForm({ mood })} />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-ink-muted">Day rating</label>
              <RatingStars value={form.rating} onChange={(rating) => updateForm({ rating })} />
            </div>

            {error && (
              <p role="alert" className="text-coral-600 text-sm bg-coral-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              {saving ? 'Saving…' : 'Save Summary'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DailySummary;

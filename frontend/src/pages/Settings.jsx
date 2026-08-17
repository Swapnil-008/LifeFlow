import { useEffect, useMemo, useState } from 'react';
import { Bell, Check, ChevronRight, Clock3, LogOut, Monitor, Moon, Palette, ShieldCheck, Sun, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const STORAGE_KEY = 'dailylife_settings';
const DEFAULTS = {
  notifications: true,
  taskReminders: true,
  habitReminders: true,
  weeklySummary: true,
  weekStarts: 'monday',
  timeFormat: '12h',
};

function loadSettings() {
  try {
    return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')) };
  } catch {
    return { ...DEFAULTS };
  }
}

function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-brand-500' : 'bg-paper-border'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 border-b border-paper-border last:border-b-0">
      <div className="flex items-start gap-3 min-w-0">
        <span className="w-9 h-9 rounded-xl bg-paper flex items-center justify-center text-ink-soft shrink-0"><Icon size={17} strokeWidth={1.8} /></span>
        <div className="min-w-0"><p className="text-sm font-medium text-ink">{title}</p><p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{description}</p></div>
      </div>
      {children}
    </div>
  );
}

function Settings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { show } = useToast();
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }, [settings]);
  const themeOptions = useMemo(() => [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ], []);
  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }));
  const clearPreferences = () => { localStorage.removeItem(STORAGE_KEY); setSettings({ ...DEFAULTS }); show('Settings restored to defaults'); };

  return (
    <div className="page-shell animate-fade-in">
      <div className="page-header"><div><h1 className="page-title">Settings</h1><p className="page-subtitle">Personalize DailyLife and manage your account preferences.</p></div></div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-5"><span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 flex items-center justify-center"><Palette size={19} /></span><div><h2 className="text-base font-semibold">Appearance</h2><p className="text-xs text-ink-muted mt-0.5">Choose how DailyLife looks on your device.</p></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themeOptions.map(({ value, label, icon: Icon }) => <button key={value} type="button" onClick={() => setTheme(value)} className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${theme === value ? 'border-brand-500 bg-brand-50/70 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'border-paper-border hover:bg-paper'}`}><Icon size={18} /><span className="text-sm font-medium flex-1">{label}</span>{theme === value && <Check size={16} />}</button>)}
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-2"><span className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-ink-soft"><Bell size={19} /></span><div><h2 className="text-base font-semibold">Notifications</h2><p className="text-xs text-ink-muted mt-0.5">Control reminder preferences. These settings are saved locally.</p></div></div>
            <div className="divide-y divide-paper-border">
              <SettingRow icon={Bell} title="Notifications" description="Master switch for DailyLife reminders."><Toggle checked={settings.notifications} onChange={(value) => update({ notifications: value })} label="Enable notifications" /></SettingRow>
              <SettingRow icon={Check} title="Task reminders" description="Allow reminders for tasks that need attention."><Toggle checked={settings.notifications && settings.taskReminders} onChange={(value) => update({ taskReminders: value })} label="Enable task reminders" /></SettingRow>
              <SettingRow icon={Check} title="Habit reminders" description="Allow reminders for habits you haven't completed."><Toggle checked={settings.notifications && settings.habitReminders} onChange={(value) => update({ habitReminders: value })} label="Enable habit reminders" /></SettingRow>
              <SettingRow icon={Clock3} title="Weekly summary" description="Keep the weekly productivity summary preference enabled."><Toggle checked={settings.notifications && settings.weeklySummary} onChange={(value) => update({ weeklySummary: value })} label="Enable weekly summary" /></SettingRow>
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-2"><span className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-ink-soft"><Clock3 size={19} /></span><div><h2 className="text-base font-semibold">Preferences</h2><p className="text-xs text-ink-muted mt-0.5">Small defaults for how your daily information is organized.</p></div></div>
            <div className="divide-y divide-paper-border">
              <SettingRow icon={Clock3} title="Week starts on" description="Used for weekly views and planning."><select value={settings.weekStarts} onChange={(e) => update({ weekStarts: e.target.value })} className="input-base w-32"><option value="monday">Monday</option><option value="sunday">Sunday</option></select></SettingRow>
              <SettingRow icon={Clock3} title="Time format" description="Choose how task and habit times are displayed."><select value={settings.timeFormat} onChange={(e) => update({ timeFormat: e.target.value })} className="input-base w-32"><option value="12h">12-hour</option><option value="24h">24-hour</option></select></SettingRow>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-5"><span className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-ink-soft"><ShieldCheck size={19} /></span><div><h2 className="text-base font-semibold">Account & security</h2><p className="text-xs text-ink-muted mt-0.5">Manage your account without leaving settings.</p></div></div>
            <div className="rounded-xl bg-paper p-4 mb-4"><p className="text-sm font-medium truncate">{user?.name || 'User'}</p><p className="text-xs text-ink-muted truncate mt-0.5">{user?.email || ''}</p></div>
            <div className="space-y-2">
              <Link to="/profile" className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border border-paper-border hover:bg-paper transition-colors"><ShieldCheck size={17} className="text-ink-soft" /><span className="text-sm font-medium flex-1">Profile & password</span><ChevronRight size={16} className="text-ink-muted" /></Link>
              <button type="button" onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border border-paper-border hover:bg-coral-50 hover:text-coral-600 dark:hover:bg-coral-500/10 transition-colors text-left"><LogOut size={17} /><span className="text-sm font-medium flex-1">Log out</span></button>
            </div>
          </section>

          <section className="card p-5 sm:p-6"><h2 className="text-base font-semibold">Reset preferences</h2><p className="text-xs text-ink-muted mt-1.5 leading-relaxed">Restore local DailyLife settings to their defaults. Your tasks, habits, expenses and account data are not affected.</p><button type="button" onClick={clearPreferences} className="mt-4 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-paper-border text-sm font-medium hover:bg-paper transition-colors"><Trash2 size={16} />Restore defaults</button></section>
        </div>
      </div>
    </div>
  );
}

export default Settings;

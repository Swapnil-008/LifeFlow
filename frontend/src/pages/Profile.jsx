import { useState } from 'react';
import { Pencil, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import ActivityHeatmap from '../components/activity/ActivityHeatmap';
import ActivityTimeline from '../components/activity/ActivityTimeline';

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

function Profile() {
  const { user, updateUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const handleProfileSubmit = async (payload) => {
    const data = await profileService.update(payload);
    updateUser(data.user);
  };

  return (
    <div className="page-shell animate-fade-in">
      <div className="page-header"><div><h1 className="page-title">Profile</h1><p className="page-subtitle">Your account, activity and personal progress.</p></div></div>

      <div className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5 mb-7">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="w-16 h-16 rounded-full object-cover shrink-0 border border-paper-border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 flex items-center justify-center text-lg font-medium shrink-0">
            {initials(user?.name) || '?'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-ink truncate">{user?.name}</p>
          <p className="text-sm text-ink-muted truncate">{user?.email}</p>
          {user?.bio && <p className="text-sm text-ink-soft mt-1.5">{user.bio}</p>}
          {user?.createdAt && (
            <p className="text-xs text-ink-muted mt-1.5">
              Member since{' '}
              {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 dark:text-brand-300 dark:bg-brand-500/15 dark:hover:bg-brand-500/25 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Pencil size={12} strokeWidth={2} />
            Edit
          </button>
          <button
            onClick={() => setPasswordOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-soft bg-paper hover:bg-paper-border px-3 py-1.5 rounded-lg transition-colors"
          >
            <KeyRound size={12} strokeWidth={2} />
            Password
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <ActivityHeatmap weeks={53} title="Activity overview" />
        <ActivityTimeline limit={30} title="All activity" />
      </div>

      {editOpen && (
        <ProfileForm initialUser={user} onSubmit={handleProfileSubmit} onClose={() => setEditOpen(false)} />
      )}
      {passwordOpen && <ChangePasswordForm onClose={() => setPasswordOpen(false)} />}
    </div>
  );
}

export default Profile;

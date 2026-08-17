import { useState } from 'react';
import Modal from '../ui/Modal';
import profileService from '../../services/profileService';
import { useToast } from '../../context/ToastContext';

function ChangePasswordForm({ onClose }) {
  const { show } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await profileService.changePassword({ currentPassword, newPassword });
      setDone(true);
      show('Password updated');
    } catch (err) {
      const message = err.response?.data?.message || 'Could not change password';
      setError(message);
      show(message, { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Change password" onClose={onClose} maxWidth="max-w-sm">
      {done ? (
        <div className="space-y-3">
          <p className="text-sm text-brand-700 bg-brand-50 rounded-lg px-3 py-2">Password updated.</p>
          <button
            onClick={onClose}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="current-password" className="sr-only">
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="sr-only">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (6+ characters)"
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="text-coral-600 text-sm bg-coral-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            {submitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}
    </Modal>
  );
}

export default ChangePasswordForm;

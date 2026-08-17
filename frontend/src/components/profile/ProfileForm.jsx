import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Modal from '../ui/Modal';

function ProfileForm({ initialUser, onSubmit, onClose }) {
  const [name, setName] = useState(initialUser?.name || '');
  const [bio, setBio] = useState(initialUser?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(initialUser?.avatar || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Please choose a JPG, PNG, WEBP, or GIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar image must be 5 MB or smaller.');
      return;
    }

    setError(null);
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearSelectedAvatar = () => {
    setAvatarFile(null);
    setPreview(initialUser?.avatar || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name, bio, avatarFile });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Edit profile" onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-paper-border shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 flex items-center justify-center text-2xl font-semibold border-2 border-paper-border">
                {initialUser?.name?.trim()?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            {avatarFile && (
              <button
                type="button"
                onClick={clearSelectedAvatar}
                aria-label="Remove selected avatar"
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-ink text-paper flex items-center justify-center shadow"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            id="profile-avatar"
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarChange}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 dark:text-brand-300 dark:bg-brand-500/15 dark:hover:bg-brand-500/25 px-3 py-2 rounded-lg transition-colors"
          >
            <ImagePlus size={14} />
            {avatarFile ? 'Choose another image' : 'Upload avatar'}
          </button>
          <p className="text-[11px] text-ink-muted">JPG, PNG, WEBP or GIF · max 5 MB</p>
        </div>

        <div>
          <label htmlFor="profile-name" className="block text-xs font-medium text-ink-soft mb-1.5">
            Name
          </label>
          <input
            id="profile-name"
            name="name"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2.5 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label htmlFor="profile-bio" className="block text-xs font-medium text-ink-soft mb-1.5">
            Bio
          </label>
          <textarea
            id="profile-bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio (optional)"
            maxLength={280}
            rows={3}
            aria-describedby="profile-bio-count"
            className="w-full px-3 py-2.5 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm resize-none"
          />
          <p id="profile-bio-count" className="text-xs text-ink-muted text-right mt-1">
            {bio.length}/280
          </p>
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
          {submitting ? 'Uploading & saving…' : 'Save changes'}
        </button>
      </form>
    </Modal>
  );
}

export default ProfileForm;

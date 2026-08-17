import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await register(form);
    setSubmitting(false);
    if (ok) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card w-full max-w-sm p-8 animate-fade-in">
        <h1 className="font-display text-3xl mb-1">Create your account</h1>
        <p className="text-ink-muted text-sm mb-6">Start tracking your day with DailyLife.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p role="alert" className="text-coral-600 text-sm bg-coral-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-ink-muted mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

import { useState } from 'react';
import Modal from '../ui/Modal';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../utils/expenseCategories';

const todayISO = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  amount: '',
  category: 'Other',
  description: '',
  paymentMethod: 'Cash',
  date: todayISO(),
};

function ExpenseForm({ initialExpense, onSubmit, onClose }) {
  const [form, setForm] = useState(
    initialExpense
      ? {
          amount: String(initialExpense.amount ?? ''),
          category: initialExpense.category || 'Other',
          description: initialExpense.description || '',
          paymentMethod: initialExpense.paymentMethod || 'Cash',
          date: initialExpense.date ? initialExpense.date.slice(0, 10) : todayISO(),
        }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ ...form, amount: parseFloat(form.amount) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={initialExpense ? 'Edit expense' : 'Add expense'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="expense-amount" className="text-xs font-medium text-ink-muted mb-1 block">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">₹</span>
              <input
                id="expense-amount"
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                required
                autoFocus
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="expense-category" className="text-xs font-medium text-ink-muted mb-1 block">Category</label>
            <select
              id="expense-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="expense-description" className="text-xs font-medium text-ink-muted mb-1 block">Description</label>
            <input
              id="expense-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Dinner with friends"
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            />
          </div>

          <div role="group" aria-label="Payment method">
            <span className="text-xs font-medium text-ink-muted mb-1.5 block">Payment method</span>
            <div className="flex gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={form.paymentMethod === m}
                  onClick={() => setForm({ ...form, paymentMethod: m })}
                  className={`flex-1 px-2 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                    form.paymentMethod === m
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'border-paper-border text-ink-soft hover:bg-paper'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="expense-date" className="text-xs font-medium text-ink-muted mb-1 block">Date</label>
            <input
              id="expense-date"
              type="date"
              name="date"
              required
              value={form.date}
              onChange={handleChange}
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
            {submitting ? 'Saving…' : initialExpense ? 'Save changes' : 'Add expense'}
          </button>
      </form>
    </Modal>
  );
}

export default ExpenseForm;

import { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, Receipt } from 'lucide-react';
import expenseService from '../services/expenseService';
import ExpenseItem from '../components/expenses/ExpenseItem';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseCategoryChart from '../components/expenses/ExpenseCategoryChart';
import ExpenseTrendChart from '../components/expenses/ExpenseTrendChart';
import SkeletonRows from '../components/ui/SkeletonRows';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Spinner from '../components/ui/Spinner';
import { EXPENSE_CATEGORIES } from '../utils/expenseCategories';
import { formatCurrency } from '../utils/format';
import { useToast } from '../context/ToastContext';

const VIEWS = [
  { value: '', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
];

const PERIODS = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

function Expenses() {
  const { show } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('month');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-date');
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const hasLoadedOnce = useRef(false);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sort };
      if (view) params.view = view;
      if (category) params.category = category;
      if (search) params.search = search;
      const data = await expenseService.list(params);
      setExpenses(data.expenses);
      setTotal(data.total);
    } catch {
      setError('Could not load expenses. Check that the backend is running.');
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }, [view, category, search, sort]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await expenseService.stats(period);
      setStats(data);
    } finally {
      setStatsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    const timeout = setTimeout(fetchExpenses, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchExpenses, search]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refreshAll = () => {
    fetchExpenses();
    fetchStats();
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete this ₹${expense.amount} expense?`)) return;
    setExpenses((prev) => prev.filter((e) => e._id !== expense._id));
    try {
      await expenseService.remove(expense._id);
      fetchStats();
      show('Expense deleted');
    } catch {
      refreshAll();
      show('Could not delete that expense', { type: 'error' });
    }
  };

  const handleFormSubmit = async (payload) => {
    if (editingExpense) {
      await expenseService.update(editingExpense._id, payload);
      show('Expense updated');
    } else {
      await expenseService.create(payload);
      show('Expense added');
    }
    refreshAll();
  };

  const openCreate = () => {
    setEditingExpense(null);
    setFormOpen(true);
  };
  const openEdit = (expense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const showSkeleton = loading && !hasLoadedOnce.current;

  return (
    <div className="page-shell animate-fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Expenses</h1><p className="page-subtitle">Understand where your money goes and keep spending visible.</p></div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 min-h-10 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 sm:px-5 py-2.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2} />
          Add Expense
        </button>
      </div>

      {/* Charts */}
      <div className="section-card mb-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h2 className="font-medium text-sm">Spending overview</h2>
          <div role="group" aria-label="Chart time period" className="tab-list overflow-x-auto">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                aria-pressed={period === p.value}
                className={`tab-button ${
                  period === p.value ? 'tab-button-active' : 'tab-button-idle'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {statsLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-6">
            <ExpenseCategoryChart data={stats?.byCategory} total={stats?.total} />
            <div>
              <p className="text-xs font-medium text-ink-muted mb-2">Daily trend</p>
              <ExpenseTrendChart data={stats?.trend} />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div role="group" aria-label="Filter expenses by view" className="tab-list w-full lg:w-fit overflow-x-auto">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              onClick={() => setView(v.value)}
              aria-pressed={view === v.value}
              className={`tab-button whitespace-nowrap ${
                view === v.value ? 'tab-button-active' : 'tab-button-idle'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <label htmlFor="expense-search" className="sr-only">
          Search expenses
        </label>
        <input
          id="expense-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expenses…"
          className="flex-1 min-h-10 px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper-card focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
        />

        <label htmlFor="expense-category-filter" className="sr-only">
          Filter by category
        </label>
        <select
          id="expense-category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-h-10 px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper-card focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
        >
          <option value="">All categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="expense-sort" className="sr-only">
          Sort expenses
        </label>
        <select
          id="expense-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="min-h-10 px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper-card focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
        >
          <option value="-date">Newest first</option>
          <option value="date">Oldest first</option>
          <option value="-amount">Amount high→low</option>
        </select>
      </div>

      {/* List */}
      <div className={`card overflow-hidden transition-opacity duration-150 ${loading && hasLoadedOnce.current ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-paper-border">
          <h2 className="font-medium text-sm">{expenses.length} expense{expenses.length === 1 ? '' : 's'}</h2>
          <span className="stat-number text-sm text-ink-soft">{formatCurrency(total)}</span>
        </div>

        {showSkeleton ? (
          <SkeletonRows count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchExpenses} />
        ) : expenses.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No expenses recorded."
            description="Add something you spent on to start tracking."
          />
        ) : (
          expenses.map((expense) => (
            <ExpenseItem key={expense._id} expense={expense} onEdit={openEdit} onDelete={handleDelete} />
          ))
        )}
      </div>

      {formOpen && (
        <ExpenseForm initialExpense={editingExpense} onSubmit={handleFormSubmit} onClose={() => setFormOpen(false)} />
      )}
    </div>
  );
}

export default Expenses;

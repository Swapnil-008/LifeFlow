import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import expenseService from '../../services/expenseService';
import ExpenseItem from '../expenses/ExpenseItem';
import { formatCurrency } from '../../utils/format';

function TodayExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    try {
      const data = await expenseService.list({ view: 'today', sort: '-date' });
      setExpenses(data.expenses);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-paper-border">
        <h2 className="font-medium text-sm">Today's Expenses</h2>
        <div className="flex items-center gap-3">
          {!loading && total > 0 && <span className="stat-number text-xs text-ink-soft">{formatCurrency(total)}</span>}
          <Link to="/expenses" className="text-xs text-brand-600 font-medium hover:underline">
            View all
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center text-ink-muted text-sm">Loading…</div>
      ) : expenses.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-ink-soft text-sm">No expenses recorded today.</p>
          <Link to="/expenses" className="inline-block mt-3 text-xs font-medium text-brand-600 hover:underline">
            + Add Expense
          </Link>
        </div>
      ) : (
        expenses.slice(0, 6).map((expense) => <ExpenseItem key={expense._id} expense={expense} hideActions />)
      )}
    </div>
  );
}

export default TodayExpenses;

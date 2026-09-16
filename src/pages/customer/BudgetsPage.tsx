import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Budget, ExpenseCategory } from '../../types';

export const BudgetsPage: React.FC = () => {
  const { currentUser, budgets, saveBudget, deleteBudget } = useApp();

  const userBudgets = budgets.filter((b) => b.userId === currentUser.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Form state
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [monthlyLimitStr, setMonthlyLimitStr] = useState('');

  const categories: ExpenseCategory[] = [
    'Food',
    'Shopping',
    'Transport',
    'Education',
    'Bills',
    'Entertainment',
    'Healthcare',
    'Travel',
    'Other',
  ];

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setCategory('Food');
    setMonthlyLimitStr('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Budget) => {
    setEditingBudget(b);
    setCategory(b.category);
    setMonthlyLimitStr(b.monthlyLimit.toString());
    setIsModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(monthlyLimitStr);
    if (!limit || limit <= 0) return;

    saveBudget({
      id: editingBudget?.id,
      category,
      monthlyLimit: limit,
      month: 9,
      year: 2026,
      spent: editingBudget ? editingBudget.spent : 0,
    });

    setIsModalOpen(false);
  };

  return (
    <div id="budgets-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Monthly Budget Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Threshold Alerts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Define category allowances. The system generates alerts at 80% usage and 100% overrun.
          </p>
        </div>

        <button
          id="btn-create-budget"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-900/30 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Category Budget
        </button>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {userBudgets.map((b) => {
          const ratio = b.spent / b.monthlyLimit;
          const percentage = Math.min(Math.round(ratio * 100), 100);
          const remaining = Math.max(0, b.monthlyLimit - b.spent);

          let statusText = 'Safe Zone';
          let statusBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
          let barColor = 'bg-emerald-500';
          let Icon = CheckCircle2;

          if (ratio >= 1.0) {
            statusText = 'Exceeded (100%+)';
            statusBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            barColor = 'bg-rose-500';
            Icon = AlertOctagon;
          } else if (ratio >= 0.8) {
            statusText = 'Warning (≥80%)';
            statusBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            barColor = 'bg-amber-500';
            Icon = AlertTriangle;
          }

          return (
            <div
              key={b.id}
              id={`budget-card-${b.id}`}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-white">{b.category}</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusBg}`}
                  >
                    <Icon className="w-3 h-3" /> {statusText}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Spent
                    </span>
                    <span className="text-base font-extrabold text-white">
                      {formatCurrency(b.spent)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Monthly Limit
                    </span>
                    <span className="text-base font-bold text-slate-300">
                      {formatCurrency(b.monthlyLimit)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{percentage}% used</span>
                    <span>Remaining: {formatCurrency(remaining)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Cycle: September 2026</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit budget limit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteBudget(b.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete budget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingBudget ? 'Edit Monthly Budget' : 'Set Category Budget'}
                  </h3>
                  <p className="text-xs text-slate-400">Monitors expenses against safe spending caps</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  disabled={!!editingBudget}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Monthly Limit (₹ INR)
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  required
                  placeholder="e.g. 5000"
                  value={monthlyLimitStr}
                  onChange={(e) => setMonthlyLimitStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300">Automated Alarm System:</span>
                <p>An in-app notification triggers at 80% usage and when the limit is exceeded (100%+).</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-confirm-save-budget"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-md shadow-emerald-900/30"
                >
                  {editingBudget ? 'Update Limit' : 'Set Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

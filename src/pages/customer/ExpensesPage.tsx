import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PieChart as PieIcon,
  Plus,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  Filter,
  ArrowDownLeft,
  X
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ExpenseCategory, Expense } from '../../types';

export const ExpensesPage: React.FC = () => {
  const { currentUser, accounts, expenses, addExpense, deleteExpense } = useApp();

  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');
  const userExpenses = expenses.filter((e) => e.userId === currentUser.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Form state
  const [amountStr, setAmountStr] = useState('');
  const [accountId, setAccountId] = useState(userAccounts[0]?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>('ACCOUNT_TRANSFER');

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

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);
    if (!amount || amount <= 0) return;

    addExpense({
      accountId,
      amount,
      category,
      description: description || `${category} expense`,
      date,
      paymentMethod,
    });

    setAmountStr('');
    setDescription('');
    setIsModalOpen(false);
  };

  const filteredExpenses = userExpenses.filter((e) =>
    selectedCategory === 'ALL' ? true : e.category === selectedCategory
  );

  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div id="expenses-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Expense Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Categorized Tracking
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Log, categorize, and monitor spending against simulated accounts and budget thresholds.
          </p>
        </div>

        <button
          id="btn-add-expense"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-900/30 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Log New Expense
        </button>
      </div>

      {/* Category Pills & Total Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Filtered Spending</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {formatCurrency(totalExpense)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All ({userExpenses.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Description / Merchant</th>
                <th className="p-4">Category</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No expenses logged in this category yet.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} id={`expense-row-${exp.id}`} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-white block">{exp.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {exp.paymentMethod.replace(/_/g, ' ')}
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(exp.date)}</td>
                    <td className="p-4 text-right font-bold text-sm text-rose-400">
                      -{formatCurrency(exp.amount)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Log Expense</h3>
                  <p className="text-xs text-slate-400">Records debit and checks monthly budget</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Account To Debit
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-rose-500"
                >
                  {userAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountType} ({acc.accountNumber}) — Balance: {formatCurrency(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grocery purchase, books, petrol"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="ACCOUNT_TRANSFER">Account Transfer</option>
                    <option value="SIMULATED_DEBIT_CARD">Simulated Debit Card</option>
                    <option value="SIMULATED_UPI">Simulated UPI</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-confirm-add-expense"
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-md shadow-rose-900/30"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Plus,
  ArrowDownLeft,
  DollarSign,
  Building,
  Briefcase,
  GraduationCap,
  Gift,
  X
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IncomeSource } from '../../types';

export const IncomePage: React.FC = () => {
  const { currentUser, accounts, income, addIncome } = useApp();

  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');
  const userIncome = income.filter((i) => i.userId === currentUser.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountStr, setAmountStr] = useState('');
  const [accountId, setAccountId] = useState(userAccounts[0]?.id || '');
  const [source, setSource] = useState<IncomeSource>('Salary');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const sources: IncomeSource[] = [
    'Salary',
    'Freelance',
    'Scholarship',
    'Business',
    'Gift',
    'Other',
  ];

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);
    if (!amount || amount <= 0) return;

    addIncome({
      accountId,
      amount,
      source,
      description: description || `${source} credit`,
      date,
    });

    setAmountStr('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleSimulateSalary = () => {
    if (!userAccounts[0]) return;
    addIncome({
      accountId: userAccounts[0].id,
      amount: 65000,
      source: 'Salary',
      description: 'Simulated Monthly IT Salary Credit - Tech Corp Ltd',
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const totalIncome = userIncome.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div id="income-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Income Streams & Credits</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Cash Inflow Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track salaries, freelance payouts, grants, and simulate inbound deposits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-simulate-salary-deposit"
            onClick={handleSimulateSalary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <Building className="w-4 h-4" /> Simulate Salary Credit (₹65,000)
          </button>
          <button
            id="btn-add-income"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-teal-900/30 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Log Inbound Income
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Recorded Inflow</span>
          <div className="text-3xl font-extrabold text-teal-400 mt-0.5">
            {formatCurrency(totalIncome)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Across {userIncome.length} deposit events
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* Income Records Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Description / Payer</th>
                <th className="p-4">Income Source</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Credit Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {userIncome.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No income records logged yet. Use the buttons above to log or simulate a deposit.
                  </td>
                </tr>
              ) : (
                userIncome.map((inc) => (
                  <tr key={inc.id} id={`income-row-${inc.id}`} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-white block">{inc.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                        {inc.source}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(inc.date)}</td>
                    <td className="p-4 text-right font-bold text-sm text-teal-400">
                      +{formatCurrency(inc.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Income Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Log Income Credit</h3>
                  <p className="text-xs text-slate-400">Credits simulated balance to your account</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddIncome} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Deposit Into Account
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as IncomeSource)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500"
                  >
                    {sources.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description / Employer / Client
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Consulting, Stipend, Tech Salary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Credit Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-teal-500"
                />
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
                  id="btn-confirm-add-income"
                  className="w-1/2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors shadow-md shadow-teal-900/30"
                >
                  Deposit Credit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

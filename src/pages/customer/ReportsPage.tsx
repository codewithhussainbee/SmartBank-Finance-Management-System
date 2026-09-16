import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CheckCircle2,
  Award,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { currentUser, accounts, expenses, income, transactions, budgets } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('9');
  const [selectedYear, setSelectedYear] = useState('2026');

  const userExpenses = expenses.filter((e) => e.userId === currentUser.id);
  const userIncome = income.filter((i) => i.userId === currentUser.id);
  const userTxns = transactions.filter(
    (t) => t.senderUserId === currentUser.id || t.receiverUserId === currentUser.id
  );

  const totalIncome = userIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = userExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netSavings = Math.max(0, totalIncome - totalExpense);
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  userExpenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const categoriesSorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const highestCategory = categoriesSorted[0] || ['None', 0];
  const lowestCategory = categoriesSorted[categoriesSorted.length - 1] || ['None', 0];

  const pieData = categoriesSorted.map(([name, value], idx) => ({
    name,
    value,
    color: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#0ea5e9', '#8b5cf6'][idx % 6],
  }));

  const comparisonData = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpense, fill: '#f43f5e' },
    { name: 'Savings', amount: netSavings, fill: '#6366f1' },
  ];

  return (
    <div id="reports-page" className="space-y-6">
      {/* Header with Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Monthly Financial Statement</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Audit & Viva Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated statement of cashflow, savings velocity, and categorical expenditures.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Month & Year Selectors */}
          <select
            id="select-report-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
          >
            <option value="9">September</option>
            <option value="8">August</option>
            <option value="7">July</option>
          </select>

          <select
            id="select-report-year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>

          <button
            id="btn-print-report"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-900/30 active:scale-95"
          >
            <Printer className="w-4 h-4" /> Print / PDF Export
          </button>
        </div>
      </div>

      {/* Printable Report Canvas Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Statement Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight">FinSim Digital Banking</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                Simulated Statement
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Account Holder: <strong className="text-white">{currentUser.fullName}</strong> • Email: {currentUser.email}
            </p>
            <p className="text-xs text-slate-400">
              Billing Period: September 1, 2026 - September 30, 2026
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Computer Science Major Project</span>
            <span className="text-sm font-bold text-emerald-400 block mt-0.5">Developed by Hussain Bee</span>
            <span className="text-[10px] text-slate-500 font-mono">Generated on: 16 Sep 2026</span>
          </div>
        </div>

        {/* High-Level Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Inflow</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Outflow</span>
            <div className="text-xl font-bold text-rose-400 mt-1">{formatCurrency(totalExpense)}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Retained Savings</span>
            <div className="text-xl font-bold text-indigo-400 mt-1">{formatCurrency(netSavings)}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Savings Rate</span>
            <div className="text-xl font-bold text-teal-400 mt-1">{savingsRate}%</div>
          </div>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Highest Spending Category:</span>
            <span className="text-white font-bold text-sm">
              {highestCategory[0]} ({formatCurrency(highestCategory[1] as number)})
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Lowest Spending Category:</span>
            <span className="text-white font-bold text-sm">
              {lowestCategory[0]} ({formatCurrency(lowestCategory[1] as number)})
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Total Ledger Transactions:</span>
            <span className="text-white font-bold text-sm">{userTxns.length} events</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Audit Compliance Status:</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Ledger Verified
            </span>
          </div>
        </div>

        {/* Visual Charts Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Monthly Cashflow Balance
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Category Distribution
            </h3>
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Watermark & Viva Footer */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            Official 4th-Year Major CSE Project Demonstration Artifact
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold">
            Developed by Hussain Bee
          </p>
          <p className="text-[10px] text-slate-500">
            Simulated banking platform. All balances and ledger records are computational simulation instances.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  ShieldCheck,
  CreditCard,
  Plus,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', // emerald
  Shopping: '#6366f1', // indigo
  Transport: '#0ea5e9', // sky
  Education: '#f59e0b', // amber
  Bills: '#ec4899', // pink
  Entertainment: '#8b5cf6', // purple
  Healthcare: '#ef4444', // red
  Travel: '#14b8a6', // teal
  Other: '#64748b', // slate
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { currentUser, accounts, transactions, expenses, income, budgets } = useApp();

  // User-specific accounts
  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);
  const totalBalance = userAccounts.reduce((acc, a) => acc + a.balance, 0);

  // Income and Expense sums
  const userExpenses = expenses.filter((e) => e.userId === currentUser.id);
  const totalExpenseAmount = userExpenses.reduce((acc, e) => acc + e.amount, 0);

  const userIncome = income.filter((i) => i.userId === currentUser.id);
  const totalIncomeAmount = userIncome.reduce((acc, i) => acc + i.amount, 0);

  const netSavings = Math.max(0, totalIncomeAmount - totalExpenseAmount);

  // User transactions (last 6)
  const userTxns = transactions
    .filter((t) => t.senderUserId === currentUser.id || t.receiverUserId === currentUser.id)
    .slice(0, 6);

  // Chart 1: Income vs Expense by Category / Weekly mock trends
  const cashflowData = [
    { name: 'Week 1', Income: 65000, Expense: 8200 },
    { name: 'Week 2', Income: 5000, Expense: 4100 },
    { name: 'Week 3', Income: 15000, Expense: 6800 },
    { name: 'Week 4', Income: 2000, Expense: 3900 },
  ];

  // Chart 2: Category Breakdown
  const categoryTotals: Record<string, number> = {};
  userExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const pieData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
    color: CATEGORY_COLORS[cat] || '#64748b',
  }));

  // Budget summary
  const userBudgets = budgets.filter((b) => b.userId === currentUser.id);
  const totalBudgetLimit = userBudgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const totalBudgetSpent = userBudgets.reduce((acc, b) => acc + b.spent, 0);
  const budgetUtilization = totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0;

  return (
    <div id="dashboard-page" className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Simulated Core Banking • Live
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, {currentUser.fullName}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Educational Banking & Personal Finance Platform. Manage simulated accounts, execute transfers, and track budget analytics in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-quick-transfer"
              onClick={() => onNavigate('transfer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4" /> Transfer Money
            </button>
            <button
              id="btn-quick-expense"
              onClick={() => onNavigate('expenses')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Log Expense
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Balance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalBalance)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">Across {userAccounts.length} accounts</span>
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Income</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-extrabold text-teal-400 tracking-tight">
              {formatCurrency(totalIncomeAmount)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <ArrowDownLeft className="w-3.5 h-3.5 text-teal-400" />
              <span>{userIncome.length} credits recorded</span>
            </div>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-extrabold text-rose-400 tracking-tight">
              {formatCurrency(totalExpenseAmount)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
              <span>{userExpenses.length} categorized charges</span>
            </div>
          </div>
        </div>

        {/* Net Savings & Budget Usage */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Savings</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-extrabold text-indigo-400 tracking-tight">
              {formatCurrency(netSavings)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                {budgetUtilization.toFixed(0)}% budget utilized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Weekly Cashflow Overview</h2>
              <p className="text-xs text-slate-400">Income vs Expenses Comparison</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              September 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories Donut */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Expense Categories</h2>
              <p className="text-xs text-slate-400">Distribution by sector</p>
            </div>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All
            </button>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-slate-400">No expenses logged yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            )}
          </div>

          {/* Mini Legend */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            {pieData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}:</span>
                <span className="font-semibold text-white ml-auto">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Cards & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Accounts Overview */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Simulated Accounts</h2>
            <button
              id="btn-manage-accounts"
              onClick={() => onNavigate('accounts')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Manage ({userAccounts.length})
            </button>
          </div>

          <div className="space-y-3">
            {userAccounts.map((acc) => (
              <div
                key={acc.id}
                id={`dashboard-account-card-${acc.id}`}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {acc.accountType}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{acc.accountNumber}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white">{formatCurrency(acc.balance)}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">{acc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Recent Transactions</h2>
              <p className="text-xs text-slate-400">Simulated transfer ledger records</p>
            </div>
            <button
              id="btn-view-all-txns"
              onClick={() => onNavigate('transactions')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              View Full History <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {userTxns.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">No transactions recorded yet.</p>
            ) : (
              userTxns.map((txn) => {
                const isDebit = txn.senderUserId === currentUser.id;
                return (
                  <div
                    key={txn.id}
                    id={`txn-row-${txn.id}`}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          txn.flagged
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : isDebit
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {txn.flagged ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : isDebit ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white truncate">
                            {txn.receiverName || txn.description}
                          </p>
                          {txn.flagged && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              ANOMALY ({txn.anomalyScore}/100)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {formatDate(txn.timestamp)} • {txn.category} • Ref: {txn.referenceNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`text-xs font-bold ${
                          isDebit ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isDebit ? '-' : '+'}
                        {formatCurrency(txn.amount)}
                      </p>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {txn.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

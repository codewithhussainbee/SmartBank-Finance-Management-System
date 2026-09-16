import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  CreditCard,
  Receipt,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  Activity,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { AuditLog, FraudAlert, User } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    accounts,
    transactions,
    fraudAlerts,
    auditLogs,
    toggleBlockUser,
    resolveFraudAlert,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'FRAUD' | 'AUDIT'>('OVERVIEW');
  const [userSearch, setUserSearch] = useState('');

  // Total system stats
  const totalSystemLiquidity = accounts.reduce((acc, a) => acc + a.balance, 0);
  const totalFlaggedCount = transactions.filter((t) => t.flagged).length;
  const pendingAlerts = fraudAlerts.filter((a) => a.status === 'PENDING');

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div id="admin-dashboard-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin & Compliance Portal</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Role: SYSTEM_ADMIN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            System-wide oversight, user account management, fraud triage queue, and immutable audit logs.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'USERS', label: `Users (${users.length})` },
            { id: 'FRAUD', label: `Fraud Triage (${pendingAlerts.length})` },
            { id: 'AUDIT', label: 'Audit Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Simulated Liquidity</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-2">
                {formatCurrency(totalSystemLiquidity)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1">Across all customer accounts</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Accounts</span>
              <div className="text-2xl font-extrabold text-white mt-2">{accounts.length}</div>
              <span className="text-[11px] text-slate-500 mt-1">Active ledger instances</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 uppercase font-semibold">Ledger Transactions</span>
              <div className="text-2xl font-extrabold text-teal-400 mt-2">{transactions.length}</div>
              <span className="text-[11px] text-slate-500 mt-1">Total transferred volume</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 uppercase font-semibold">Flagged Anomalies</span>
              <div className="text-2xl font-extrabold text-rose-400 mt-2">{totalFlaggedCount}</div>
              <span className="text-[11px] text-rose-400/80 mt-1">{pendingAlerts.length} pending investigation</span>
            </div>
          </div>

          {/* Quick Fraud Triage Preview */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Recent High-Risk Triggers</h3>
                <p className="text-xs text-slate-400">Transactions intercepted by anomaly heuristic rules</p>
              </div>
              <button
                onClick={() => setActiveTab('FRAUD')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                View Queue ({pendingAlerts.length})
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {pendingAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">{alert.userName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Score: {alert.anomalyScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{alert.reason}</p>
                  </div>
                  <button
                    onClick={() => resolveFraudAlert(alert.id, 'RESOLVED')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                  >
                    Resolve Alert
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredUsers.length} users registered</span>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-semibold text-white">{u.fullName}</td>
                      <td className="p-4 text-slate-300 font-mono">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.isBlocked
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {u.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{formatDateTime(u.createdAt)}</td>
                      <td className="p-4 text-center">
                        <button
                          id={`btn-toggle-block-${u.id}`}
                          onClick={() => toggleBlockUser(u.id)}
                          className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 mx-auto transition-colors ${
                            u.isBlocked
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {u.isBlocked ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" /> Unblock
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" /> Block Access
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FRAUD TRIAGE TAB */}
      {activeTab === 'FRAUD' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white">Fraud & Risk Triage Queue</h3>
            <p className="text-xs text-slate-400">
              Review flagged simulated transactions and mark them as reviewed or dismissed.
            </p>
          </div>

          <div className="space-y-3">
            {fraudAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                No active fraud alerts.
              </div>
            ) : (
              fraudAlerts.map((fa) => (
                <div
                  key={fa.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{fa.userName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Risk Score: {fa.anomalyScore}/100
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fa.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {fa.status}
                      </span>
                    </div>
                    <p className="text-xs text-rose-300 mt-1 font-medium">{fa.reason}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
                      Detected on: {formatDateTime(fa.timestamp)}
                    </p>
                  </div>

                  {fa.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveFraudAlert(fa.id, 'DISMISSED')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                      >
                        Dismiss False Positive
                      </button>
                      <button
                        onClick={() => resolveFraudAlert(fa.id, 'RESOLVED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                      >
                        Resolve & Mark Safe
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white">Immutable Security Audit Trail</h3>
            <p className="text-xs text-slate-400">
              Monitors authentication events, ledger mutations, transfer creations, and administrator actions.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Entity Type</th>
                    <th className="p-4">IP Address / Client</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {auditLogs.slice(0, 20).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-400">{formatDateTime(log.timestamp)}</td>
                      <td className="p-4 font-bold text-emerald-400">{log.action}</td>
                      <td className="p-4 text-white font-sans">{log.userName}</td>
                      <td className="p-4 text-slate-300">{log.entityType}</td>
                      <td className="p-4 text-slate-400">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

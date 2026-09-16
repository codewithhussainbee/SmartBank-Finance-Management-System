import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  Clock,
  ShieldAlert,
  Printer,
  ChevronDown,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import { Transaction, TransactionType, TransactionStatus } from '../../types';

export const TransactionsPage: React.FC = () => {
  const { currentUser, transactions } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'AMOUNT_DESC' | 'AMOUNT_ASC'>('NEWEST');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // User transactions
  const userTxns = useMemo(() => {
    return transactions.filter(
      (t) => t.senderUserId === currentUser.id || t.receiverUserId === currentUser.id
    );
  }, [transactions, currentUser.id]);

  // Filtered & Sorted transactions
  const filteredTxns = useMemo(() => {
    return userTxns
      .filter((t) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDesc = t.description.toLowerCase().includes(q);
          const matchReceiver = t.receiverName.toLowerCase().includes(q);
          const matchRef = t.referenceNumber.toLowerCase().includes(q);
          const matchTxnId = t.transactionId.toLowerCase().includes(q);
          if (!matchDesc && !matchReceiver && !matchRef && !matchTxnId) return false;
        }

        // Type filter
        if (typeFilter !== 'ALL' && t.transactionType !== typeFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'ALL' && t.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (sortBy === 'OLDEST') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        if (sortBy === 'AMOUNT_DESC') return b.amount - a.amount;
        if (sortBy === 'AMOUNT_ASC') return a.amount - b.amount;
        return 0;
      });
  }, [userTxns, searchQuery, typeFilter, statusFilter, sortBy]);

  return (
    <div id="transactions-page" className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Transaction History & Ledger</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Immutable Audit Trail
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Search, filter, and inspect simulated transactions, anomaly assessments, and digital payment receipts.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-search-transactions"
              type="text"
              placeholder="Search receiver, reference, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Type */}
            <select
              id="filter-txn-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">All Types</option>
              <option value="TRANSFER">Transfer</option>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>

            {/* Status */}
            <select
              id="filter-txn-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FLAGGED">Flagged / Anomaly</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            {/* Sort */}
            <select
              id="sort-txn"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="AMOUNT_DESC">Highest Amount</option>
              <option value="AMOUNT_ASC">Lowest Amount</option>
            </select>

            {(searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 text-xs flex items-center gap-1"
                title="Reset filters"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Transaction / Receiver</th>
                <th className="p-4">Category & Type</th>
                <th className="p-4">Reference & Date</th>
                <th className="p-4">Status & Anomaly</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No transactions match your current search and filters.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => {
                  const isDebit = txn.senderUserId === currentUser.id;
                  return (
                    <tr
                      key={txn.id}
                      id={`txn-table-row-${txn.id}`}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name and Icon */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
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
                          <div>
                            <span className="font-semibold text-white block">
                              {txn.receiverName || txn.description}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                              {txn.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Type */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                          {txn.category || 'General'}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1 uppercase font-semibold">
                          {txn.transactionType}
                        </span>
                      </td>

                      {/* Reference & Date */}
                      <td className="p-4 font-mono text-[11px] text-slate-300">
                        <div>{txn.referenceNumber}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                          {formatDateTime(txn.timestamp)}
                        </div>
                      </td>

                      {/* Status & Anomaly */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              txn.status === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : txn.status === 'FLAGGED'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {txn.status}
                          </span>
                          {txn.anomalyScore > 0 && (
                            <span
                              className={`text-[10px] font-medium ${
                                txn.anomalyScore >= 70
                                  ? 'text-rose-400 font-bold'
                                  : txn.anomalyScore >= 40
                                  ? 'text-amber-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              Risk Score: {txn.anomalyScore}/100
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 text-right">
                        <span
                          className={`font-bold text-sm ${
                            isDebit ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {isDebit ? '-' : '+'}
                          {formatCurrency(txn.amount)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-4 text-center">
                        <button
                          id={`btn-view-txn-${txn.id}`}
                          onClick={() => setSelectedTxn(txn)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Simulated Payment Receipt</h3>
                  <p className="text-xs text-slate-400">Transaction ID: {selectedTxn.transactionId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Reference Number:</span>
                <span className="text-white font-mono font-bold">{selectedTxn.referenceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Sender Account:</span>
                <span className="text-white font-mono">{selectedTxn.senderAccount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Receiver Account:</span>
                <span className="text-white font-mono">{selectedTxn.receiverAccount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Receiver Name:</span>
                <span className="text-white font-medium">{selectedTxn.receiverName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-white">{formatDateTime(selectedTxn.timestamp)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Transfer Method:</span>
                <span className="text-white">{selectedTxn.metadata?.transferMethod || 'INTERNAL'}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold pt-1">
                <span className="text-slate-200">Amount:</span>
                <span className="text-emerald-400">{formatCurrency(selectedTxn.amount)}</span>
              </div>
            </div>

            {/* Anomaly Breakdown inside Receipt */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Anomaly Assessment Score:
                </span>
                <span
                  className={`font-bold ${
                    selectedTxn.anomalyScore >= 70
                      ? 'text-rose-400'
                      : selectedTxn.anomalyScore >= 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {selectedTxn.anomalyScore} / 100
                </span>
              </div>
              {selectedTxn.flagReason && (
                <p className="text-[11px] text-rose-300 leading-relaxed bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  <strong className="block text-rose-400">Flag Reason:</strong>
                  {selectedTxn.flagReason}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-500">
                Simulated Core Banking Ledger Record
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

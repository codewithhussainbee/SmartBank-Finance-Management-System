import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Activity,
  ArrowUpRight,
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

interface FraudAlertsPageProps {
  onNavigate: (page: string) => void;
}

export const FraudAlertsPage: React.FC<FraudAlertsPageProps> = ({ onNavigate }) => {
  const { currentUser, transactions, fraudAlerts } = useApp();

  const flaggedTxns = transactions.filter(
    (t) => (t.senderUserId === currentUser.id || t.receiverUserId === currentUser.id) && t.flagged
  );

  return (
    <div id="fraud-alerts-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Anomaly & Fraud Detection Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Rule-Based AI Heuristics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated core banking fraud detection evaluating transfer velocity, balance drain, and entity blacklists.
          </p>
        </div>

        <button
          onClick={() => onNavigate('transfer')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-900/30"
        >
          <Zap className="w-4 h-4" /> Test Simulation in Transfer Page
        </button>
      </div>

      {/* Heuristic Rules Architecture Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Active Anomaly Detection Heuristics</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Rule 1: High Value Spike</span>
              <span className="text-[10px] font-bold text-rose-400">+45 pts</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Triggers when a single simulated transaction exceeds ₹50,000 threshold.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Rule 2: Balance Drain</span>
              <span className="text-[10px] font-bold text-rose-400">+35 pts</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Triggers when transaction amount drains ≥80% of total available balance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Rule 3: High Velocity</span>
              <span className="text-[10px] font-bold text-rose-400">+30 pts</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Triggers when more than 3 transactions occur within a 5-minute rolling window.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Rule 4: Entity Risk Filter</span>
              <span className="text-[10px] font-bold text-rose-400">+40 pts</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Triggers when target account matches flagged or overseas simulation identifiers.
            </p>
          </div>
        </div>
      </div>

      {/* Flagged Transactions for Current User */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Flagged Transactions for Review</h3>
            <p className="text-xs text-slate-400">Ledger items marked with risk score ≥ 70</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {flaggedTxns.length} Flagged
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {flaggedTxns.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No transactions currently flagged as anomalous for your account.
            </div>
          ) : (
            flaggedTxns.map((txn) => (
              <div key={txn.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        {txn.receiverName || txn.description}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono">
                        Score: {txn.anomalyScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ref: {txn.referenceNumber} • {formatDateTime(txn.timestamp)}
                    </p>
                    {txn.flagReason && (
                      <p className="text-xs text-rose-300 mt-2 p-2 rounded-lg bg-rose-950/40 border border-rose-900/50">
                        <strong>Anomaly Reason:</strong> {txn.flagReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-rose-400">
                    {formatCurrency(txn.amount)}
                  </span>
                  <span className="block text-[10px] text-amber-400 uppercase font-semibold mt-1">
                    Pending Admin Audit
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

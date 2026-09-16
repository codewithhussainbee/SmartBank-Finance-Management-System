import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import { AnomalyAnalysisResult, Transaction } from '../../types';

export const TransferPage: React.FC = () => {
  const { currentUser, accounts, executeTransfer, addToast } = useApp();

  const userAccounts = accounts.filter((a) => a.userId === currentUser.id && a.status === 'ACTIVE');

  // Form State
  const [senderAccountId, setSenderAccountId] = useState(userAccounts[0]?.id || '');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState('Bills');
  const [description, setDescription] = useState('');
  const [transferType, setTransferType] = useState<'INTERNAL' | 'SIMULATED_INTERBANK'>('INTERNAL');

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [anomalyResult, setAnomalyResult] = useState<AnomalyAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedSenderAccount = userAccounts.find((a) => a.id === senderAccountId);
  const numericAmount = parseFloat(amountStr) || 0;

  // Quick Beneficiaries for Easy 4th-Year Major Project Viva Presentation
  const demoBeneficiaries = [
    { name: 'Meera Nambiar', acc: 'SIM-9003-4411', note: 'Customer Account (Internal)' },
    { name: 'BESCOM Electricity Board', acc: 'SIM-BENGALURU-BESCOM', note: 'Utility Provider' },
    { name: 'Apex Crypto Exchange Ltd', acc: 'SIM-UNKNOWN-OVERSEAS-99', note: 'High-Risk Beneficiary (Anomaly Trigger)' },
  ];

  // Real-time estimated anomaly score calculation
  const estimatedAnomaly = useMemo(() => {
    if (!selectedSenderAccount || numericAmount <= 0) return null;
    let score = 5;
    const triggers: string[] = [];

    if (numericAmount > 50000) {
      score += 45;
      triggers.push('High value simulated transfer (> ₹50,000)');
    } else if (numericAmount > 20000) {
      score += 20;
      triggers.push('Elevated transfer amount');
    }

    if (selectedSenderAccount.balance > 0 && numericAmount >= selectedSenderAccount.balance * 0.8) {
      score += 30;
      triggers.push('High balance drain ratio (≥80% of funds)');
    }

    if (receiverAccountNumber.includes('CRYPTO') || receiverAccountNumber.includes('OVERSEAS')) {
      score += 35;
      triggers.push('Target matches high-risk simulated entity filter');
    }

    const finalScore = Math.min(Math.max(score, 5), 96);
    return {
      score: finalScore,
      isFlagged: finalScore >= 70,
      triggers,
    };
  }, [selectedSenderAccount, numericAmount, receiverAccountNumber]);

  const handleStartTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSenderAccount) {
      addToast({ type: 'error', title: 'Error', message: 'Please choose an active sender account.' });
      return;
    }
    if (numericAmount <= 0) {
      addToast({ type: 'error', title: 'Invalid Amount', message: 'Amount must be greater than ₹0.' });
      return;
    }
    if (numericAmount > selectedSenderAccount.balance) {
      addToast({
        type: 'error',
        title: 'Insufficient Balance',
        message: `Account has only ${formatCurrency(selectedSenderAccount.balance)}.`,
      });
      return;
    }
    if (!receiverAccountNumber.trim() || !receiverName.trim()) {
      addToast({ type: 'error', title: 'Missing Details', message: 'Please enter receiver name and account.' });
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = executeTransfer({
        senderAccountId,
        receiverAccountNumber,
        receiverName,
        amount: numericAmount,
        description: description || `Transfer to ${receiverName}`,
        category,
      });

      setIsProcessing(false);
      setIsConfirmModalOpen(false);

      if (res.success && res.transaction) {
        setCompletedTxn(res.transaction);
        setAnomalyResult(res.anomalyResult || null);
        // Clear inputs
        setAmountStr('');
        setDescription('');
      }
    }, 600);
  };

  return (
    <div id="transfer-page" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Simulated Money Transfer</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Educational Sandbox
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Perform atomic ledger transfers between accounts with simulated anomaly detection and real-time validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Transfer Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <form onSubmit={handleStartTransfer} className="space-y-4">
            {/* Sender Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                From Account (Sender)
              </label>
              <select
                id="select-sender-account"
                value={senderAccountId}
                onChange={(e) => setSenderAccountId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {userAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountType} ({acc.accountNumber}) — Balance: {formatCurrency(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Beneficiary Picker */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Demo Beneficiary (Viva Demonstration)
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {demoBeneficiaries.map((b) => (
                  <button
                    type="button"
                    key={b.acc}
                    onClick={() => {
                      setReceiverName(b.name);
                      setReceiverAccountNumber(b.acc);
                    }}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      receiverAccountNumber === b.acc
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-xs truncate">{b.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{b.acc}</div>
                    <div className="text-[9px] text-emerald-400/80 truncate mt-0.5">{b.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Receiver Name and Account */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Receiver Name
                </label>
                <input
                  id="input-receiver-name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Receiver Account Number
                </label>
                <input
                  id="input-receiver-account"
                  type="text"
                  required
                  placeholder="e.g. SIM-9003-4411"
                  value={receiverAccountNumber}
                  onChange={(e) => setReceiverAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Amount & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    id="input-transfer-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Expense / Purpose Category
                </label>
                <select
                  id="select-transfer-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Education">Education & Tuition</option>
                  <option value="Bills">Utility Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Travel">Travel</option>
                  <option value="Other">Other / Personal Transfer</option>
                </select>
              </div>
            </div>

            {/* Transfer Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Transfer Protocol
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="transferType"
                    checked={transferType === 'INTERNAL'}
                    onChange={() => setTransferType('INTERNAL')}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Internal FinSim Transfer (Instant)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="transferType"
                    checked={transferType === 'SIMULATED_INTERBANK'}
                    onChange={() => setTransferType('SIMULATED_INTERBANK')}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Simulated NEFT/IMPS Interbank</span>
                </label>
              </div>
            </div>

            {/* Note / Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Transfer Remarks / Description
              </label>
              <input
                id="input-transfer-description"
                type="text"
                placeholder="e.g. Shared project fee, books reimbursement"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              id="btn-submit-transfer"
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/30 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" /> Review & Confirm Simulated Transfer
            </button>
          </form>
        </div>

        {/* Live Anomaly Detection Assistant Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Anomaly Engine</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates risk metrics in real-time before transaction submission.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Predicted Risk Score:</span>
                {estimatedAnomaly ? (
                  <span
                    className={`font-bold text-xs px-2.5 py-0.5 rounded-full ${
                      estimatedAnomaly.score >= 70
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : estimatedAnomaly.score >= 40
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {estimatedAnomaly.score} / 100
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Enter amount</span>
                )}
              </div>

              {/* Progress visual */}
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    (estimatedAnomaly?.score || 0) >= 70
                      ? 'bg-rose-500'
                      : (estimatedAnomaly?.score || 0) >= 40
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${estimatedAnomaly?.score || 5}%` }}
                />
              </div>

              {estimatedAnomaly?.triggers && estimatedAnomaly.triggers.length > 0 && (
                <div className="pt-2 border-t border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    Active Rule Triggers:
                  </span>
                  {estimatedAnomaly.triggers.map((t, idx) => (
                    <div key={idx} className="text-[11px] text-amber-300 flex items-start gap-1.5">
                      <span className="shrink-0 text-amber-400">•</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Educational Simulation Notice
            </div>
            <p className="leading-relaxed">
              This application is an educational simulation. All transfers and account balances are strictly simulated in local storage and test environments.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Simulated Transfer</h3>
                <p className="text-xs text-slate-400">Review transfer parameters</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/40">
                <span className="text-slate-400">Sender Account:</span>
                <span className="text-white font-mono">{selectedSenderAccount?.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/40">
                <span className="text-slate-400">Beneficiary Name:</span>
                <span className="text-white font-semibold">{receiverName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/40">
                <span className="text-slate-400">Target Account:</span>
                <span className="text-white font-mono">{receiverAccountNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/40">
                <span className="text-slate-400">Category:</span>
                <span className="text-white">{category}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold pt-2">
                <span className="text-slate-200">Total Deducted:</span>
                <span className="text-emerald-400">{formatCurrency(numericAmount)}</span>
              </div>
            </div>

            {estimatedAnomaly?.isFlagged && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Simulated Anomaly Warning:</span>
                  <p className="text-[11px] text-rose-200 mt-0.5">
                    This transaction will be recorded with status FLAGGED and registered in the Admin Fraud Triage Queue.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-transfer-final"
                disabled={isProcessing}
                onClick={handleConfirmTransfer}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-900/30 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing Ledger...' : 'Confirm & Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Success Receipt Modal */}
      {completedTxn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Transfer Completed</h3>
              <p className="text-xs text-slate-400">Simulated transaction logged to ledger</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-white font-mono font-bold">{completedTxn.transactionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Reference Number:</span>
                <span className="text-white font-mono">{completedTxn.referenceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Receiver:</span>
                <span className="text-white">{completedTxn.receiverName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Amount Sent:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {formatCurrency(completedTxn.amount)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Status:</span>
                <span
                  className={`font-semibold ${
                    completedTxn.flagged ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {completedTxn.status}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Anomaly Risk Score:</span>
                <span
                  className={`font-bold ${
                    completedTxn.anomalyScore >= 70
                      ? 'text-rose-400'
                      : completedTxn.anomalyScore >= 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {completedTxn.anomalyScore} / 100
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setCompletedTxn(null)}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

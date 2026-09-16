import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  CreditCard,
  Plus,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Lock,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Account, AccountType } from '../../types';

export const AccountsPage: React.FC = () => {
  const { currentUser, accounts, createAccount, transactions } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAccountType, setNewAccountType] = useState<AccountType>('SAVINGS');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const userAccounts = accounts.filter((a) => a.userId === currentUser.id);

  const handleOpenAccount = (e: React.FormEvent) => {
    e.preventDefault();
    createAccount(newAccountType);
    setIsCreateModalOpen(false);
  };

  const accountTxns = selectedAccount
    ? transactions.filter(
        (t) =>
          t.senderAccount === selectedAccount.accountNumber ||
          t.receiverAccount === selectedAccount.accountNumber
      )
    : [];

  return (
    <div id="accounts-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Simulated Accounts & Cards</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Multi-Account Architecture
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your simulated savings, checking, and student accounts. Balances are maintained through ledger transactions.
          </p>
        </div>

        <button
          id="btn-open-new-account"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-900/30 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Open New Simulated Account
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {userAccounts.map((acc) => (
          <div
            key={acc.id}
            id={`account-card-${acc.id}`}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between relative overflow-hidden group shadow-lg"
          >
            {/* Background shimmer */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  {acc.accountType}
                </span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> Opened {formatDate(acc.createdAt)}
                </span>
              </div>

              <div className="mt-5">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Available Balance
                </span>
                <div className="text-2xl md:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
                  {formatCurrency(acc.balance)}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Account Number:</span>
                  <span className="font-mono text-slate-200 font-medium">{acc.accountNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Daily Transfer Limit:</span>
                  <span className="text-slate-300 font-medium">{formatCurrency(acc.dailyTransferLimit)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-semibold">{acc.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <button
                id={`btn-view-acc-txns-${acc.id}`}
                onClick={() => setSelectedAccount(acc)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" /> View Ledger Transactions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Account Transactions Drawer / Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Account Ledger: {selectedAccount.accountNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedAccount.accountType} • Current Balance: {formatCurrency(selectedAccount.balance)}
                </p>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-800/60">
              {accountTxns.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No transactions recorded for this account yet.
                </div>
              ) : (
                accountTxns.map((txn) => {
                  const isDebit = txn.senderAccount === selectedAccount.accountNumber;
                  return (
                    <div key={txn.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-semibold text-white">
                          {txn.receiverName || txn.description}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {formatDate(txn.timestamp)} • Ref: {txn.referenceNumber}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isDebit ? '-' : '+'}
                          {formatCurrency(txn.amount)}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">
                          {txn.status}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Open Account Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Open Simulated Account</h3>
                <p className="text-xs text-slate-400">Generates simulated account number & opening balance</p>
              </div>
            </div>

            <form onSubmit={handleOpenAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Account Type
                </label>
                <div className="space-y-2">
                  {[
                    { type: 'SAVINGS' as AccountType, label: 'Savings Account', note: 'Standard interest rate, opening credit of ₹10,000' },
                    { type: 'CHECKING' as AccountType, label: 'Checking Account', note: 'Higher daily limit (₹75k), opening credit of ₹15,000' },
                    { type: 'STUDENT' as AccountType, label: 'Student Account', note: 'Zero-maintenance student sandbox, opening credit of ₹5,000' },
                  ].map((item) => (
                    <label
                      key={item.type}
                      className={`block p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        newAccountType === item.type
                          ? 'border-emerald-500 bg-emerald-500/10 text-white'
                          : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="accountType"
                          value={item.type}
                          checked={newAccountType === item.type}
                          onChange={() => setNewAccountType(item.type)}
                          className="text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="font-semibold text-white">{item.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 pl-5">{item.note}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Security Rule:</span> All simulated account numbers are prefixed with <code className="text-emerald-400 font-mono">SIM-</code> to prevent confusion with real banking credentials.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-confirm-create-account"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-900/30"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

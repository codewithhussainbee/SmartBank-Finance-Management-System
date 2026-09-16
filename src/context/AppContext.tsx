import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  Account,
  Transaction,
  Expense,
  Income,
  Budget,
  Notification,
  AuditLog,
  FraudAlert,
  AnomalyAnalysisResult,
  ExpenseCategory,
  IncomeSource
} from '../types';
import { MockDatabaseService } from '../services/mockDatabase';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  notifications: Notification[];
  unreadNotificationCount: number;
  auditLogs: AuditLog[];
  fraudAlerts: FraudAlert[];
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  switchUser: (userId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  createAccount: (accountType: Account['accountType']) => Account;
  executeTransfer: (params: {
    senderAccountId: string;
    receiverAccountNumber: string;
    receiverName: string;
    amount: number;
    description: string;
    category?: string;
  }) => { success: boolean; message: string; transaction?: Transaction; anomalyResult?: AnomalyAnalysisResult };
  addExpense: (data: { accountId: string; amount: number; category: ExpenseCategory; description: string; date: string; paymentMethod: any }) => Expense;
  deleteExpense: (id: string) => void;
  addIncome: (data: { accountId: string; amount: number; source: IncomeSource; description: string; date: string }) => Income;
  saveBudget: (data: { id?: string; category: ExpenseCategory; monthlyLimit: number; month: number; year: number; spent?: number }) => Budget;
  deleteBudget: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  toggleUserBlock: (userId: string) => boolean;
  reviewFraudAlert: (alertId: string, status: FraudAlert['status'], notes?: string) => void;
  resetAllData: () => void;
  refreshState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => MockDatabaseService.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => MockDatabaseService.getUsers());
  const [accounts, setAccounts] = useState<Account[]>(() => MockDatabaseService.getAccounts());
  const [transactions, setTransactions] = useState<Transaction[]>(() => MockDatabaseService.getTransactions());
  const [expenses, setExpenses] = useState<Expense[]>(() => MockDatabaseService.getExpenses());
  const [income, setIncome] = useState<Income[]>(() => MockDatabaseService.getIncome());
  const [budgets, setBudgets] = useState<Budget[]>(() => MockDatabaseService.getBudgets());
  const [notifications, setNotifications] = useState<Notification[]>(() => MockDatabaseService.getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => MockDatabaseService.getAuditLogs());
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(() => MockDatabaseService.getFraudAlerts());
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshState = useCallback(() => {
    setCurrentUserState(MockDatabaseService.getCurrentUser());
    setUsers(MockDatabaseService.getUsers());
    setAccounts(MockDatabaseService.getAccounts());
    setTransactions(MockDatabaseService.getTransactions());
    setExpenses(MockDatabaseService.getExpenses());
    setIncome(MockDatabaseService.getIncome());
    setBudgets(MockDatabaseService.getBudgets());
    setNotifications(MockDatabaseService.getNotifications());
    setAuditLogs(MockDatabaseService.getAuditLogs());
    setFraudAlerts(MockDatabaseService.getFraudAlerts());
  }, []);

  const switchUser = (userId: string) => {
    const matched = MockDatabaseService.setCurrentUser(userId);
    if (matched) {
      refreshState();
      addToast({
        type: 'info',
        title: 'Active User Switched',
        message: `Switched session to ${matched.fullName} (${matched.role}).`,
      });
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    const updated = MockDatabaseService.updateUser(currentUser.id, updates);
    refreshState();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal information has been safely updated.',
    });
  };

  const createAccount = (accountType: Account['accountType']): Account => {
    const newAcc = MockDatabaseService.createAccount(currentUser.id, accountType);
    refreshState();
    addToast({
      type: 'success',
      title: 'New Account Opened',
      message: `Simulated ${accountType} account ${newAcc.accountNumber} created successfully.`,
    });
    return newAcc;
  };

  const executeTransfer = (params: {
    senderAccountId: string;
    receiverAccountNumber: string;
    receiverName: string;
    amount: number;
    description: string;
    category?: string;
  }) => {
    const res = MockDatabaseService.executeTransfer({
      ...params,
      senderUserId: currentUser.id,
    });

    refreshState();

    if (res.success) {
      if (res.anomalyResult?.flagged) {
        addToast({
          type: 'warning',
          title: '⚠️ Transfer Flagged for Anomaly',
          message: `Processed with Anomaly Score: ${res.anomalyResult.anomalyScore}/100. Flagged for review.`,
        });
      } else {
        addToast({
          type: 'success',
          title: 'Simulated Transfer Complete',
          message: `₹${params.amount.toLocaleString('en-IN')} sent to ${params.receiverName}.`,
        });
      }
    } else {
      addToast({
        type: 'error',
        title: 'Transfer Failed',
        message: res.message,
      });
    }

    return res;
  };

  const addExpense = (data: { accountId: string; amount: number; category: ExpenseCategory; description: string; date: string; paymentMethod: any }) => {
    const newExp = MockDatabaseService.addExpense({
      ...data,
      userId: currentUser.id,
    });
    refreshState();
    addToast({
      type: 'success',
      title: 'Expense Recorded',
      message: `₹${data.amount.toLocaleString('en-IN')} logged under ${data.category}.`,
    });
    return newExp;
  };

  const deleteExpense = (id: string) => {
    MockDatabaseService.deleteExpense(id);
    refreshState();
    addToast({
      type: 'info',
      title: 'Expense Removed',
      message: 'Expense entry was successfully deleted.',
    });
  };

  const addIncome = (data: { accountId: string; amount: number; source: IncomeSource; description: string; date: string }) => {
    const newInc = MockDatabaseService.addIncome({
      ...data,
      userId: currentUser.id,
    });
    refreshState();
    addToast({
      type: 'success',
      title: 'Income Logged',
      message: `₹${data.amount.toLocaleString('en-IN')} credited from ${data.source}.`,
    });
    return newInc;
  };

  const saveBudget = (data: { id?: string; category: ExpenseCategory; monthlyLimit: number; month: number; year: number; spent?: number }) => {
    const saved = MockDatabaseService.saveBudget({
      ...data,
      spent: data.spent ?? 0,
      userId: currentUser.id,
    });
    refreshState();
    addToast({
      type: 'success',
      title: 'Budget Saved',
      message: `Monthly limit for ${data.category} set to ₹${data.monthlyLimit.toLocaleString('en-IN')}.`,
    });
    return saved;
  };

  const deleteBudget = (id: string) => {
    MockDatabaseService.deleteBudget(id);
    refreshState();
    addToast({
      type: 'info',
      title: 'Budget Removed',
      message: 'Monthly budget category removed.',
    });
  };

  const markNotificationAsRead = (id: string) => {
    MockDatabaseService.markNotificationRead(id);
    refreshState();
  };

  const markAllNotificationsAsRead = () => {
    MockDatabaseService.markAllNotificationsRead(currentUser.id);
    refreshState();
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
    });
  };

  const toggleUserBlock = (userId: string) => {
    const newStatus = MockDatabaseService.toggleUserBlock(userId);
    refreshState();
    addToast({
      type: newStatus ? 'warning' : 'success',
      title: newStatus ? 'User Blocked' : 'User Restored',
      message: `Account status updated in simulated ledger.`,
    });
    return newStatus;
  };

  const reviewFraudAlert = (alertId: string, status: FraudAlert['status'], notes?: string) => {
    MockDatabaseService.updateFraudAlertStatus(alertId, status, notes);
    refreshState();
    addToast({
      type: 'info',
      title: 'Alert Status Updated',
      message: `Fraud alert moved to ${status}.`,
    });
  };

  const resetAllData = () => {
    MockDatabaseService.resetToSeed();
    refreshState();
    addToast({
      type: 'info',
      title: 'Demo Environment Reset',
      message: 'All mock accounts, transactions, and audit logs restored to initial clean state.',
    });
  };

  const userNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadNotificationCount = userNotifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        accounts,
        transactions,
        expenses,
        income,
        budgets,
        notifications: userNotifications,
        unreadNotificationCount,
        auditLogs,
        fraudAlerts,
        toasts,
        addToast,
        removeToast,
        switchUser,
        updateUserProfile,
        createAccount,
        executeTransfer,
        addExpense,
        deleteExpense,
        addIncome,
        saveBudget,
        deleteBudget,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toggleUserBlock,
        reviewFraudAlert,
        resetAllData,
        refreshState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

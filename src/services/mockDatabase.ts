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

const STORAGE_KEYS = {
  USERS: 'edu_bank_users_v1',
  ACCOUNTS: 'edu_bank_accounts_v1',
  TRANSACTIONS: 'edu_bank_transactions_v1',
  EXPENSES: 'edu_bank_expenses_v1',
  INCOME: 'edu_bank_income_v1',
  BUDGETS: 'edu_bank_budgets_v1',
  NOTIFICATIONS: 'edu_bank_notifications_v1',
  AUDIT_LOGS: 'edu_bank_audit_logs_v1',
  FRAUD_ALERTS: 'edu_bank_fraud_alerts_v1',
  CURRENT_USER_ID: 'edu_bank_current_user_id_v1',
};

// Realistic simulated seed data
const SEED_USERS: User[] = [
  {
    id: 'user-customer-1',
    fullName: 'Aarav Patel',
    email: 'customer@edu-bank.sim',
    phone: '+91 98765 43210',
    role: 'CUSTOMER',
    isBlocked: false,
    simulatedAddress: {
      street: '42 MG Road, Cyber Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    },
    lastLogin: '2026-09-15T14:30:00Z',
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'user-admin-1',
    fullName: 'Hussain Bee (Lead Admin)',
    email: 'admin@edu-bank.sim',
    phone: '+91 91234 56789',
    role: 'ADMIN',
    isBlocked: false,
    simulatedAddress: {
      street: 'HQ Operations Wing, Floor 8',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
    },
    lastLogin: '2026-09-16T08:15:00Z',
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'user-support-1',
    fullName: 'Priya Sharma (Support Specialist)',
    email: 'support@edu-bank.sim',
    phone: '+91 94567 12345',
    role: 'SUPPORT_STAFF',
    isBlocked: false,
    simulatedAddress: {
      street: 'Customer Care Center, Sector 5',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
    lastLogin: '2026-09-16T07:45:00Z',
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'user-customer-2',
    fullName: 'Meera Nambiar',
    email: 'meera.n@edu-bank.sim',
    phone: '+91 98111 22334',
    role: 'CUSTOMER',
    isBlocked: false,
    simulatedAddress: {
      street: '15 Anna Nagar 2nd Avenue',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
    },
    lastLogin: '2026-09-14T18:20:00Z',
    createdAt: '2026-03-12T14:00:00Z',
  },
];

const SEED_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    userId: 'user-customer-1',
    accountNumber: 'SIM-7740-9281',
    accountType: 'SAVINGS',
    balance: 85450.0,
    currency: 'INR',
    status: 'ACTIVE',
    isPrimary: true,
    dailyTransferLimit: 100000,
    createdAt: '2026-01-10T09:30:00Z',
  },
  {
    id: 'acc-2',
    userId: 'user-customer-1',
    accountNumber: 'SIM-5192-3304',
    accountType: 'CHECKING',
    balance: 24500.0,
    currency: 'INR',
    status: 'ACTIVE',
    isPrimary: false,
    dailyTransferLimit: 50000,
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'acc-3',
    userId: 'user-customer-1',
    accountNumber: 'SIM-8821-6650',
    accountType: 'STUDENT',
    balance: 8200.0,
    currency: 'INR',
    status: 'ACTIVE',
    isPrimary: false,
    dailyTransferLimit: 25000,
    createdAt: '2026-03-01T16:00:00Z',
  },
  {
    id: 'acc-4',
    userId: 'user-customer-2',
    accountNumber: 'SIM-9003-4411',
    accountType: 'SAVINGS',
    balance: 142000.0,
    currency: 'INR',
    status: 'ACTIVE',
    isPrimary: true,
    dailyTransferLimit: 150000,
    createdAt: '2026-03-12T14:30:00Z',
  },
];

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    transactionId: 'TXN-20260914-10293',
    referenceNumber: 'REF-EDUBANK-99120',
    senderAccount: 'SYSTEM_SALARY_GATEWAY',
    receiverAccount: 'SIM-7740-9281',
    senderUserId: 'system',
    receiverUserId: 'user-customer-1',
    receiverName: 'Aarav Patel',
    amount: 65000.0,
    transactionType: 'INCOME',
    category: 'Salary',
    description: 'Monthly Tech Salary Credit - Infosys Ltd',
    status: 'SUCCESS',
    anomalyScore: 4,
    flagged: false,
    timestamp: '2026-09-01T10:00:00Z',
  },
  {
    id: 'txn-2',
    transactionId: 'TXN-20260904-44812',
    referenceNumber: 'REF-EDUBANK-44812',
    senderAccount: 'SIM-7740-9281',
    receiverAccount: 'SIM-BENGALURU-BESCOM',
    senderUserId: 'user-customer-1',
    receiverName: 'BESCOM Electricity Board',
    amount: 3200.0,
    transactionType: 'EXPENSE',
    category: 'Bills',
    description: 'Monthly Apartment Electricity Bill',
    status: 'SUCCESS',
    anomalyScore: 8,
    flagged: false,
    timestamp: '2026-09-04T12:30:00Z',
  },
  {
    id: 'txn-3',
    transactionId: 'TXN-20260907-88219',
    referenceNumber: 'REF-EDUBANK-88219',
    senderAccount: 'SIM-7740-9281',
    receiverAccount: 'SIM-SWIGGY-REST',
    senderUserId: 'user-customer-1',
    receiverName: 'FreshMenu / Swiggy Delivery',
    amount: 1450.0,
    transactionType: 'EXPENSE',
    category: 'Food',
    description: 'Team dinner order',
    status: 'SUCCESS',
    anomalyScore: 12,
    flagged: false,
    timestamp: '2026-09-07T20:15:00Z',
  },
  {
    id: 'txn-4',
    transactionId: 'TXN-20260910-33100',
    referenceNumber: 'REF-EDUBANK-33100',
    senderAccount: 'SIM-7740-9281',
    receiverAccount: 'SIM-9003-4411',
    senderUserId: 'user-customer-1',
    receiverUserId: 'user-customer-2',
    receiverName: 'Meera Nambiar',
    amount: 8500.0,
    transactionType: 'TRANSFER',
    category: 'Other',
    description: 'Shared rent & internet reimbursement',
    status: 'SUCCESS',
    anomalyScore: 18,
    flagged: false,
    timestamp: '2026-09-10T15:40:00Z',
  },
  {
    id: 'txn-5',
    transactionId: 'TXN-20260912-77114',
    referenceNumber: 'REF-EDUBANK-77114',
    senderAccount: 'SIM-7740-9281',
    receiverAccount: 'SIM-UNKNOWN-OVERSEAS-99',
    senderUserId: 'user-customer-1',
    receiverName: 'Apex Crypto Exchange Ltd',
    amount: 78000.0,
    transactionType: 'TRANSFER',
    category: 'Other',
    description: 'Urgent transfer to crypto wallet address',
    status: 'FLAGGED',
    anomalyScore: 89,
    flagged: true,
    flagReason: 'Sudden spike: Amount is 12x user average transfer and recipient is flagged risk category.',
    timestamp: '2026-09-12T02:14:00Z',
  },
  {
    id: 'txn-6',
    transactionId: 'TXN-20260914-99201',
    referenceNumber: 'REF-EDUBANK-99201',
    senderAccount: 'SIM-7740-9281',
    receiverAccount: 'SIM-AMZN-RETAIL',
    senderUserId: 'user-customer-1',
    receiverName: 'Amazon India Retail',
    amount: 4999.0,
    transactionType: 'EXPENSE',
    category: 'Shopping',
    description: 'Mechanical keyboard for CS Project coding',
    status: 'SUCCESS',
    anomalyScore: 14,
    flagged: false,
    timestamp: '2026-09-14T11:05:00Z',
  },
  {
    id: 'txn-7',
    transactionId: 'TXN-20260915-11092',
    referenceNumber: 'REF-EDUBANK-11092',
    senderAccount: 'CLIENT_FREELANCE_PORTAL',
    receiverAccount: 'SIM-5192-3304',
    senderUserId: 'system',
    receiverUserId: 'user-customer-1',
    receiverName: 'Aarav Patel',
    amount: 15000.0,
    transactionType: 'INCOME',
    category: 'Freelance',
    description: 'Full-stack consulting milestone 1 payment',
    status: 'SUCCESS',
    anomalyScore: 10,
    flagged: false,
    timestamp: '2026-09-15T09:20:00Z',
  },
];

const SEED_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    userId: 'user-customer-1',
    accountId: 'acc-1',
    amount: 3200,
    category: 'Bills',
    description: 'Monthly Apartment Electricity Bill',
    date: '2026-09-04',
    paymentMethod: 'ACCOUNT_TRANSFER',
  },
  {
    id: 'exp-2',
    userId: 'user-customer-1',
    accountId: 'acc-1',
    amount: 1450,
    category: 'Food',
    description: 'Team dinner order Swiggy',
    date: '2026-09-07',
    paymentMethod: 'SIMULATED_UPI',
  },
  {
    id: 'exp-3',
    userId: 'user-customer-1',
    accountId: 'acc-1',
    amount: 4999,
    category: 'Shopping',
    description: 'Mechanical keyboard for CS Project coding',
    date: '2026-09-14',
    paymentMethod: 'SIMULATED_DEBIT_CARD',
  },
  {
    id: 'exp-4',
    userId: 'user-customer-1',
    accountId: 'acc-1',
    amount: 2100,
    category: 'Transport',
    description: 'Metro smart card recharge & Uber rides',
    date: '2026-09-08',
    paymentMethod: 'SIMULATED_UPI',
  },
  {
    id: 'exp-5',
    userId: 'user-customer-1',
    accountId: 'acc-1',
    amount: 1800,
    category: 'Entertainment',
    description: 'IMAX movie tickets & Netflix subscription',
    date: '2026-09-11',
    paymentMethod: 'SIMULATED_DEBIT_CARD',
  },
  {
    id: 'exp-6',
    userId: 'user-customer-1',
    accountId: 'acc-1',
    amount: 6500,
    category: 'Education',
    description: 'Cloud Certification & Algorithm Textbook',
    date: '2026-09-03',
    paymentMethod: 'ACCOUNT_TRANSFER',
  },
];

const SEED_INCOME: Income[] = [
  {
    id: 'inc-1',
    userId: 'user-customer-1',
    accountId: 'acc-1',
    amount: 65000,
    source: 'Salary',
    description: 'Monthly Tech Salary Credit - Infosys Ltd',
    date: '2026-09-01',
  },
  {
    id: 'inc-2',
    userId: 'user-customer-1',
    accountId: 'acc-2',
    amount: 15000,
    source: 'Freelance',
    description: 'Full-stack consulting milestone 1 payment',
    date: '2026-09-15',
  },
  {
    id: 'inc-3',
    userId: 'user-customer-1',
    accountId: 'acc-3',
    amount: 5000,
    source: 'Scholarship',
    description: 'State Academic Merit Grant',
    date: '2026-09-05',
  },
];

const SEED_BUDGETS: Budget[] = [
  {
    id: 'bgt-1',
    userId: 'user-customer-1',
    category: 'Food',
    monthlyLimit: 6000,
    spent: 4850,
    month: 9,
    year: 2026,
    warnTriggered: true, // ~80.8%
    exceedTriggered: false,
  },
  {
    id: 'bgt-2',
    userId: 'user-customer-1',
    category: 'Shopping',
    monthlyLimit: 7000,
    spent: 4999,
    month: 9,
    year: 2026,
    warnTriggered: false,
    exceedTriggered: false,
  },
  {
    id: 'bgt-3',
    userId: 'user-customer-1',
    category: 'Bills',
    monthlyLimit: 4000,
    spent: 3200,
    month: 9,
    year: 2026,
    warnTriggered: true, // 80%
    exceedTriggered: false,
  },
  {
    id: 'bgt-4',
    userId: 'user-customer-1',
    category: 'Education',
    monthlyLimit: 8000,
    spent: 6500,
    month: 9,
    year: 2026,
    warnTriggered: true, // >80%
    exceedTriggered: false,
  },
  {
    id: 'bgt-5',
    userId: 'user-customer-1',
    category: 'Entertainment',
    monthlyLimit: 2500,
    spent: 1800,
    month: 9,
    year: 2026,
    warnTriggered: false,
    exceedTriggered: false,
  },
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-customer-1',
    title: 'Suspicious Transfer Flagged',
    message: 'Simulated transfer of ₹78,000 to Apex Crypto was flagged (Anomaly Score: 89) for security review.',
    type: 'SUSPICIOUS_TXN',
    read: false,
    createdAt: '2026-09-12T02:15:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-customer-1',
    title: 'Budget Alert: Food (80% Reached)',
    message: 'You have spent ₹4,850 of your ₹6,000 monthly food allowance.',
    type: 'BUDGET_WARNING',
    read: false,
    createdAt: '2026-09-10T14:30:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-customer-1',
    title: 'Simulated Transfer Received',
    message: '₹15,000 freelance fee credited to Checking Account SIM-5192-3304.',
    type: 'TRANSFER_SUCCESS',
    read: true,
    createdAt: '2026-09-15T09:21:00Z',
  },
  {
    id: 'notif-4',
    userId: 'user-customer-1',
    title: 'New Session Login Detected',
    message: 'Secure login established from Chrome 128 / Windows 11 (Simulated IP 103.21.144.10).',
    type: 'NEW_LOGIN',
    read: true,
    createdAt: '2026-09-15T14:30:00Z',
  },
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    userId: 'user-customer-1',
    userEmail: 'customer@edu-bank.sim',
    action: 'USER_LOGIN',
    entity: 'AUTH',
    timestamp: '2026-09-15T14:30:00Z',
    ipAddress: '103.21.144.10',
    description: 'Successful customer authentication via hashed password token verification',
    severity: 'INFO',
  },
  {
    id: 'audit-2',
    userId: 'user-customer-1',
    userEmail: 'customer@edu-bank.sim',
    action: 'SIMULATED_TRANSFER',
    entity: 'TRANSACTION',
    entityId: 'txn-4',
    timestamp: '2026-09-10T15:40:00Z',
    ipAddress: '103.21.144.10',
    description: 'Transferred ₹8,500 from SIM-7740-9281 to SIM-9003-4411 (Meera Nambiar)',
    severity: 'INFO',
  },
  {
    id: 'audit-3',
    userId: 'user-customer-1',
    userEmail: 'customer@edu-bank.sim',
    action: 'HIGH_RISK_ANOMALY_FLAGGED',
    entity: 'FRAUD_ENGINE',
    entityId: 'txn-5',
    timestamp: '2026-09-12T02:14:00Z',
    ipAddress: '194.26.29.11',
    description: 'Transaction flagged. Rule engine triggered: Spike ratio 12.4x above trailing 30-day mean.',
    severity: 'CRITICAL',
  },
  {
    id: 'audit-4',
    userId: 'user-admin-1',
    userEmail: 'admin@edu-bank.sim',
    action: 'ADMIN_FRAUD_REVIEW',
    entity: 'FRAUD_ALERT',
    entityId: 'fraud-1',
    timestamp: '2026-09-12T09:00:00Z',
    ipAddress: '127.0.0.1',
    description: 'Administrator opened fraud alert inspection for Txn-5 (₹78,000 to Apex Crypto)',
    severity: 'WARNING',
  },
];

const SEED_FRAUD_ALERTS: FraudAlert[] = [
  {
    id: 'fraud-1',
    transactionId: 'txn-5',
    userId: 'user-customer-1',
    userEmail: 'customer@edu-bank.sim',
    amount: 78000,
    receiverName: 'Apex Crypto Exchange Ltd',
    anomalyScore: 89,
    riskLevel: 'HIGH',
    triggers: [
      'Amount > 10x 30-day user average (₹6,200 avg vs ₹78,000)',
      'Unusual hour of transfer (02:14 AM local simulated time)',
      'External unknown beneficiary entity',
    ],
    status: 'PENDING_REVIEW',
    createdAt: '2026-09-12T02:14:00Z',
    notes: 'Awaiting customer secondary identity confirmation.',
  },
];

// Helper to load or initialize from localStorage
function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export class MockDatabaseService {
  // Reset all state to initial seed
  public static resetToSeed() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(SEED_ACCOUNTS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(SEED_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.INCOME, JSON.stringify(SEED_INCOME));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(SEED_BUDGETS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.FRAUD_ALERTS, JSON.stringify(SEED_FRAUD_ALERTS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-customer-1');
  }

  // Current session user
  public static getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-customer-1';
    const found = users.find((u) => u.id === currentId);
    return found || users[0];
  }

  public static setCurrentUser(userId: string): User | null {
    const users = this.getUsers();
    const match = users.find((u) => u.id === userId);
    if (match) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
      this.addAuditLog({
        userId: match.id,
        userEmail: match.email,
        action: 'USER_LOGIN',
        entity: 'AUTH',
        description: `Logged in as ${match.fullName} (${match.role})`,
        severity: 'INFO',
      });
      return match;
    }
    return null;
  }

  // Users
  public static getUsers(): User[] {
    return getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  public static getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public static updateUser(id: string, updates: Partial<User>): User {
    const users = this.getUsers().map((u) => (u.id === id ? { ...u, ...updates } : u));
    setStorage(STORAGE_KEYS.USERS, users);
    return users.find((u) => u.id === id)!;
  }

  public static toggleUserBlock(userId: string): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return false;
    const newStatus = !target.isBlocked;
    target.isBlocked = newStatus;
    setStorage(STORAGE_KEYS.USERS, users);
    this.addAuditLog({
      action: newStatus ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
      entity: 'USER_MANAGEMENT',
      entityId: userId,
      description: `Administrator ${newStatus ? 'blocked' : 'unblocked'} user ${target.fullName} (${target.email})`,
      severity: newStatus ? 'WARNING' : 'INFO',
    });
    return newStatus;
  }

  // Accounts
  public static getAccounts(): Account[] {
    return getStorage<Account[]>(STORAGE_KEYS.ACCOUNTS, SEED_ACCOUNTS);
  }

  public static getUserAccounts(userId: string): Account[] {
    return this.getAccounts().filter((a) => a.userId === userId);
  }

  public static getAccountById(id: string): Account | undefined {
    return this.getAccounts().find((a) => a.id === id);
  }

  public static getAccountByNumber(accNum: string): Account | undefined {
    return this.getAccounts().find((a) => a.accountNumber === accNum);
  }

  public static createAccount(userId: string, accountType: Account['accountType']): Account {
    const accounts = this.getAccounts();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const randomMid = Math.floor(1000 + Math.random() * 9000);
    const initialDeposit = accountType === 'SAVINGS' ? 10000 : accountType === 'CHECKING' ? 15000 : 5000;

    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      userId,
      accountNumber: `SIM-${randomMid}-${randomSuffix}`,
      accountType,
      balance: initialDeposit,
      currency: 'INR',
      status: 'ACTIVE',
      isPrimary: false,
      dailyTransferLimit: accountType === 'CHECKING' ? 75000 : 50000,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    setStorage(STORAGE_KEYS.ACCOUNTS, accounts);

    this.addAuditLog({
      userId,
      action: 'ACCOUNT_CREATED',
      entity: 'ACCOUNT',
      entityId: newAccount.id,
      description: `Opened simulated ${accountType} account ${newAccount.accountNumber} with opening credit of ₹${initialDeposit.toLocaleString('en-IN')}`,
      severity: 'INFO',
    });

    return newAccount;
  }

  // Transactions
  public static getTransactions(): Transaction[] {
    return getStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, SEED_TRANSACTIONS);
  }

  public static getUserTransactions(userId: string): Transaction[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    return this.getTransactions().filter(
      (t) => t.senderUserId === userId || t.receiverUserId === userId
    );
  }

  // Educational Anomaly Detection Algorithm (Simulates ML / Rules engine)
  public static analyzeTransactionAnomaly(
    senderAccount: Account,
    amount: number,
    receiverAccountStr: string
  ): AnomalyAnalysisResult {
    const recentTxns = this.getTransactions().filter(
      (t) => t.senderAccount === senderAccount.accountNumber
    );

    const amounts = recentTxns.map((t) => t.amount);
    const avgAmount = amounts.length > 0 ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 5000;

    let score = 5;
    const triggers: string[] = [];

    // Rule 1: High amount relative to user historical average
    const ratio = amount / Math.max(avgAmount, 1000);
    if (ratio > 8) {
      score += 45;
      triggers.push(`High transfer spike: ₹${amount.toLocaleString('en-IN')} is ${(ratio).toFixed(1)}x greater than historical average (₹${Math.round(avgAmount).toLocaleString('en-IN')}).`);
    } else if (ratio > 4) {
      score += 25;
      triggers.push(`Above normal transfer size: ₹${amount.toLocaleString('en-IN')} exceeds regular spending band.`);
    }

    // Rule 2: Near total balance drain
    if (amount >= senderAccount.balance * 0.85) {
      score += 30;
      triggers.push(`High liquidity drain: transfer constitutes ${(amount / senderAccount.balance * 100).toFixed(0)}% of total account balance.`);
    }

    // Rule 3: Rapid transfer frequency within last 1 hour
    const now = Date.now();
    const lastHourCount = recentTxns.filter((t) => {
      const diffMin = (now - new Date(t.timestamp).getTime()) / (1000 * 60);
      return diffMin <= 60;
    }).length;

    if (lastHourCount >= 3) {
      score += 25;
      triggers.push(`Velocity spike: ${lastHourCount + 1} transfers attempted within 60 minutes.`);
    }

    // Rule 4: Round large sums
    if (amount >= 50000 && amount % 10000 === 0) {
      score += 10;
      triggers.push('High-value structured round amount.');
    }

    const finalScore = Math.min(Math.max(score, 5), 98);
    let riskLevel: AnomalyAnalysisResult['riskLevel'] = 'LOW';
    if (finalScore >= 75) riskLevel = 'HIGH';
    else if (finalScore >= 50) riskLevel = 'MEDIUM';
    if (finalScore >= 90) riskLevel = 'CRITICAL';

    return {
      anomalyScore: finalScore,
      riskLevel,
      flagged: finalScore >= 70,
      triggers,
    };
  }

  // Atomic Money Transfer Simulator
  public static executeTransfer(params: {
    senderUserId: string;
    senderAccountId: string;
    receiverAccountNumber: string;
    receiverName: string;
    amount: number;
    description: string;
    category?: string;
  }): { success: boolean; message: string; transaction?: Transaction; anomalyResult?: AnomalyAnalysisResult } {
    const { senderUserId, senderAccountId, receiverAccountNumber, receiverName, amount, description, category } = params;

    if (amount <= 0) {
      return { success: false, message: 'Transfer amount must be strictly greater than ₹0.' };
    }

    const accounts = this.getAccounts();
    const senderAccount = accounts.find((a) => a.id === senderAccountId && a.userId === senderUserId);

    if (!senderAccount) {
      return { success: false, message: 'Sender account not found or access unauthorized.' };
    }

    if (senderAccount.status !== 'ACTIVE') {
      return { success: false, message: `Account is currently ${senderAccount.status}. Transfers disabled.` };
    }

    if (senderAccount.balance < amount) {
      return {
        success: false,
        message: `Insufficient balance. Available: ₹${senderAccount.balance.toLocaleString('en-IN')}, Requested: ₹${amount.toLocaleString('en-IN')}`,
      };
    }

    if (amount > senderAccount.dailyTransferLimit) {
      return {
        success: false,
        message: `Amount exceeds daily transfer limit of ₹${senderAccount.dailyTransferLimit.toLocaleString('en-IN')}.`,
      };
    }

    if (senderAccount.accountNumber === receiverAccountNumber) {
      return { success: false, message: 'Sender and receiver accounts cannot be identical.' };
    }

    // Run Educational Anomaly Detection Engine
    const anomaly = this.analyzeTransactionAnomaly(senderAccount, amount, receiverAccountNumber);

    // Atomic Balance Update
    senderAccount.balance -= amount;

    // Check if receiver account exists inside our simulated bank
    const receiverAccount = accounts.find((a) => a.accountNumber === receiverAccountNumber);
    if (receiverAccount) {
      receiverAccount.balance += amount;
    }

    setStorage(STORAGE_KEYS.ACCOUNTS, accounts);

    // Record Transaction
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      transactionId: `TXN-${dateStr}-${randNum}`,
      referenceNumber: `REF-EDUBANK-${randNum}`,
      senderAccount: senderAccount.accountNumber,
      receiverAccount: receiverAccountNumber,
      senderUserId,
      receiverUserId: receiverAccount ? receiverAccount.userId : undefined,
      receiverName: receiverName || 'Simulated Beneficiary',
      amount,
      transactionType: 'TRANSFER',
      category: category || 'Other',
      description: description || 'Simulated fund transfer',
      status: anomaly.flagged ? 'FLAGGED' : 'SUCCESS',
      anomalyScore: anomaly.anomalyScore,
      flagged: anomaly.flagged,
      flagReason: anomaly.flagged ? anomaly.triggers.join('; ') : undefined,
      timestamp: new Date().toISOString(),
      metadata: {
        ipAddress: '103.21.144.10',
        device: 'Web Client / Chrome',
        transferMethod: receiverAccount ? 'INTERNAL' : 'SIMULATED_INTERBANK',
      },
    };

    const transactions = this.getTransactions();
    transactions.unshift(newTxn);
    setStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

    // Audit Logging
    this.addAuditLog({
      userId: senderUserId,
      action: anomaly.flagged ? 'HIGH_RISK_ANOMALY_FLAGGED' : 'SIMULATED_TRANSFER',
      entity: 'TRANSACTION',
      entityId: newTxn.id,
      description: `Transferred ₹${amount.toLocaleString('en-IN')} from ${senderAccount.accountNumber} to ${receiverAccountNumber} (${receiverName})`,
      severity: anomaly.flagged ? 'CRITICAL' : 'INFO',
    });

    // In-App Notification to Sender
    this.addNotification({
      userId: senderUserId,
      title: anomaly.flagged ? '⚠️ Transfer Completed (Flagged for Review)' : 'Transfer Successful',
      message: `Simulated transfer of ₹${amount.toLocaleString('en-IN')} to ${receiverName} (${receiverAccountNumber}) processed. Ref: ${newTxn.referenceNumber}`,
      type: anomaly.flagged ? 'SUSPICIOUS_TXN' : 'TRANSFER_SUCCESS',
    });

    // If receiver is a customer in our system, notify them too
    if (receiverAccount) {
      this.addNotification({
        userId: receiverAccount.userId,
        title: 'Funds Credited',
        message: `Received ₹${amount.toLocaleString('en-IN')} into ${receiverAccount.accountNumber} from ${senderAccount.accountNumber}.`,
        type: 'TRANSFER_SUCCESS',
      });
    }

    // If flagged, create a Fraud Alert for admin review
    if (anomaly.flagged) {
      this.addFraudAlert({
        transactionId: newTxn.id,
        userId: senderUserId,
        userEmail: this.getUserById(senderUserId)?.email || 'customer@edu-bank.sim',
        amount,
        receiverName,
        anomalyScore: anomaly.anomalyScore,
        riskLevel: anomaly.riskLevel,
        triggers: anomaly.triggers,
        notes: 'Automatically flagged by AI/Anomaly Rule Scorer',
      });
    }

    // Check budget impacts if category provided
    if (category) {
      this.checkAndNotifyBudgetThresholds(senderUserId, category, amount);
    }

    return {
      success: true,
      message: anomaly.flagged
        ? 'Transfer completed, but flagged by educational anomaly detection system for review.'
        : 'Simulated transfer completed successfully!',
      transaction: newTxn,
      anomalyResult: anomaly,
    };
  }

  // Budget Monitoring & Threshold Alerts (80% Warning, 100% Exceeded)
  private static checkAndNotifyBudgetThresholds(userId: string, category: string, newSpentAmount: number) {
    const budgets = this.getBudgets().filter((b) => b.userId === userId && b.category === category);
    if (budgets.length === 0) return;

    for (const bgt of budgets) {
      bgt.spent += newSpentAmount;
      const ratio = bgt.spent / bgt.monthlyLimit;

      if (ratio >= 1.0 && !bgt.exceedTriggered) {
        bgt.exceedTriggered = true;
        this.addNotification({
          userId,
          title: `🚨 Budget Exceeded: ${bgt.category}`,
          message: `You have spent ₹${bgt.spent.toLocaleString('en-IN')}, exceeding your ₹${bgt.monthlyLimit.toLocaleString('en-IN')} limit (${(ratio * 100).toFixed(0)}%).`,
          type: 'BUDGET_EXCEEDED',
        });
      } else if (ratio >= 0.8 && !bgt.warnTriggered) {
        bgt.warnTriggered = true;
        this.addNotification({
          userId,
          title: `⚠️ Budget Alert: ${bgt.category} (80% Reached)`,
          message: `You have spent ₹${bgt.spent.toLocaleString('en-IN')} of your ₹${bgt.monthlyLimit.toLocaleString('en-IN')} monthly budget.`,
          type: 'BUDGET_WARNING',
        });
      }
    }
    setStorage(STORAGE_KEYS.BUDGETS, this.getBudgets());
  }

  // Expenses
  public static getExpenses(): Expense[] {
    return getStorage<Expense[]>(STORAGE_KEYS.EXPENSES, SEED_EXPENSES);
  }

  public static getUserExpenses(userId: string): Expense[] {
    return this.getExpenses().filter((e) => e.userId === userId);
  }

  public static addExpense(data: Omit<Expense, 'id'>): Expense {
    const expenses = this.getExpenses();
    const newExp: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
    };
    expenses.unshift(newExp);
    setStorage(STORAGE_KEYS.EXPENSES, expenses);

    // Also deduct balance from account
    const accounts = this.getAccounts();
    const acc = accounts.find((a) => a.id === data.accountId);
    if (acc) {
      acc.balance = Math.max(0, acc.balance - data.amount);
      setStorage(STORAGE_KEYS.ACCOUNTS, accounts);
    }

    // Check budget
    this.checkAndNotifyBudgetThresholds(data.userId, data.category, data.amount);

    this.addAuditLog({
      userId: data.userId,
      action: 'EXPENSE_LOGGED',
      entity: 'EXPENSE',
      entityId: newExp.id,
      description: `Logged expense of ₹${data.amount.toLocaleString('en-IN')} under ${data.category}`,
      severity: 'INFO',
    });

    return newExp;
  }

  public static deleteExpense(id: string): void {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    setStorage(STORAGE_KEYS.EXPENSES, expenses);
  }

  // Income
  public static getIncome(): Income[] {
    return getStorage<Income[]>(STORAGE_KEYS.INCOME, SEED_INCOME);
  }

  public static getUserIncome(userId: string): Income[] {
    return this.getIncome().filter((i) => i.userId === userId);
  }

  public static addIncome(data: Omit<Income, 'id'>): Income {
    const incomes = this.getIncome();
    const newInc: Income = {
      ...data,
      id: `inc-${Date.now()}`,
    };
    incomes.unshift(newInc);
    setStorage(STORAGE_KEYS.INCOME, incomes);

    // Add to account balance
    const accounts = this.getAccounts();
    const acc = accounts.find((a) => a.id === data.accountId);
    if (acc) {
      acc.balance += data.amount;
      setStorage(STORAGE_KEYS.ACCOUNTS, accounts);
    }

    this.addAuditLog({
      userId: data.userId,
      action: 'INCOME_LOGGED',
      entity: 'INCOME',
      entityId: newInc.id,
      description: `Logged income of ₹${data.amount.toLocaleString('en-IN')} from ${data.source}`,
      severity: 'INFO',
    });

    return newInc;
  }

  // Budgets
  public static getBudgets(): Budget[] {
    return getStorage<Budget[]>(STORAGE_KEYS.BUDGETS, SEED_BUDGETS);
  }

  public static getUserBudgets(userId: string): Budget[] {
    return this.getBudgets().filter((b) => b.userId === userId);
  }

  public static saveBudget(data: Omit<Budget, 'id'> & { id?: string }): Budget {
    const budgets = this.getBudgets();
    if (data.id) {
      const idx = budgets.findIndex((b) => b.id === data.id);
      if (idx !== -1) {
        budgets[idx] = { ...budgets[idx], ...data } as Budget;
        setStorage(STORAGE_KEYS.BUDGETS, budgets);
        return budgets[idx];
      }
    }

    const newBudget: Budget = {
      ...data,
      id: `bgt-${Date.now()}`,
      spent: data.spent || 0,
    };
    budgets.push(newBudget);
    setStorage(STORAGE_KEYS.BUDGETS, budgets);

    this.addAuditLog({
      userId: data.userId,
      action: 'BUDGET_CREATED',
      entity: 'BUDGET',
      entityId: newBudget.id,
      description: `Created monthly budget for ${data.category}: ₹${data.monthlyLimit.toLocaleString('en-IN')}`,
      severity: 'INFO',
    });

    return newBudget;
  }

  public static deleteBudget(id: string): void {
    const budgets = this.getBudgets().filter((b) => b.id !== id);
    setStorage(STORAGE_KEYS.BUDGETS, budgets);
  }

  // Notifications
  public static getNotifications(): Notification[] {
    return getStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  }

  public static getUserNotifications(userId: string): Notification[] {
    return this.getNotifications().filter((n) => n.userId === userId);
  }

  public static addNotification(data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const notifications = this.getNotifications();
    const newNotif: Notification = {
      ...data,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotif;
  }

  public static markNotificationRead(id: string): void {
    const notifications = this.getNotifications().map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  public static markAllNotificationsRead(userId: string): void {
    const notifications = this.getNotifications().map((n) =>
      n.userId === userId ? { ...n, read: true } : n
    );
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // Audit Logs
  public static getAuditLogs(): AuditLog[] {
    return getStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  }

  public static addAuditLog(data: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress'> & { ipAddress?: string }): AuditLog {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...data,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ipAddress: data.ipAddress || '127.0.0.1 (Local Client)',
    };
    logs.unshift(newLog);
    // keep max 200 logs
    if (logs.length > 200) logs.length = 200;
    setStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
    return newLog;
  }

  // Fraud Alerts
  public static getFraudAlerts(): FraudAlert[] {
    return getStorage<FraudAlert[]>(STORAGE_KEYS.FRAUD_ALERTS, SEED_FRAUD_ALERTS);
  }

  public static addFraudAlert(data: Omit<FraudAlert, 'id' | 'createdAt' | 'status'>): FraudAlert {
    const alerts = this.getFraudAlerts();
    const newAlert: FraudAlert = {
      ...data,
      id: `fraud-${Date.now()}`,
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
    };
    alerts.unshift(newAlert);
    setStorage(STORAGE_KEYS.FRAUD_ALERTS, alerts);
    return newAlert;
  }

  public static updateFraudAlertStatus(
    alertId: string,
    status: FraudAlert['status'],
    notes?: string
  ): void {
    const alerts = this.getFraudAlerts().map((a) =>
      a.id === alertId ? { ...a, status, notes: notes || a.notes } : a
    );
    setStorage(STORAGE_KEYS.FRAUD_ALERTS, alerts);
  }
}

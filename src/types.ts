export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPPORT_STAFF';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isBlocked: boolean;
  avatarUrl?: string;
  simulatedAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  lastLogin?: string;
  createdAt: string;
}

export type AccountType = 'SAVINGS' | 'CHECKING' | 'STUDENT';
export type AccountStatus = 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'CLOSED';

export interface Account {
  id: string;
  userId: string;
  accountNumber: string; // e.g. "SIM-8821-4920"
  accountType: AccountType;
  balance: number;
  currency: string; // "INR" or "₹"
  status: AccountStatus;
  isPrimary?: boolean;
  dailyTransferLimit: number;
  createdAt: string;
}

export type TransactionType = 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'FLAGGED';

export interface Transaction {
  id: string;
  transactionId: string; // TXN-YYYYMMDD-XXXX
  referenceNumber: string;
  senderAccount: string;
  receiverAccount: string;
  senderUserId: string;
  receiverUserId?: string;
  receiverName: string;
  amount: number;
  transactionType: TransactionType;
  category: string;
  description: string;
  status: TransactionStatus;
  anomalyScore: number; // 0 - 100
  flagged: boolean;
  flagReason?: string;
  timestamp: string;
  metadata?: {
    ipAddress?: string;
    device?: string;
    transferMethod?: 'INTERNAL' | 'SIMULATED_INTERBANK';
  };
}

export type ExpenseCategory =
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Education'
  | 'Bills'
  | 'Entertainment'
  | 'Healthcare'
  | 'Travel'
  | 'Other';

export interface Expense {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  paymentMethod: 'SIMULATED_DEBIT_CARD' | 'ACCOUNT_TRANSFER' | 'SIMULATED_UPI' | 'CASH';
}

export type IncomeSource =
  | 'Salary'
  | 'Freelance'
  | 'Scholarship'
  | 'Business'
  | 'Gift'
  | 'Other';

export interface Income {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  source: IncomeSource;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  monthlyLimit: number;
  spent: number;
  month: number; // 1 - 12
  year: number;
  warnTriggered?: boolean;
  exceedTriggered?: boolean;
}

export type NotificationType =
  | 'TRANSFER_SUCCESS'
  | 'TRANSFER_FAILED'
  | 'NEW_LOGIN'
  | 'BUDGET_WARNING'
  | 'BUDGET_EXCEEDED'
  | 'SUSPICIOUS_TXN'
  | 'REPORT_READY'
  | 'SECURITY_ALERT';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  timestamp: string;
  ipAddress: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  userId: string;
  userEmail: string;
  amount: number;
  receiverName: string;
  anomalyScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  triggers: string[];
  status: 'PENDING_REVIEW' | 'CLEARED' | 'CONFIRMED_FRAUD';
  createdAt: string;
  notes?: string;
}

export interface AnomalyAnalysisResult {
  anomalyScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flagged: boolean;
  triggers: string[];
}

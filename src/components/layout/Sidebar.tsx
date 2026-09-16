import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Receipt,
  PieChart,
  TrendingUp,
  Target,
  FileBarChart,
  Bell,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { currentUser, unreadNotificationCount, fraudAlerts } = useApp();

  const pendingFraudAlertsCount = fraudAlerts.filter(
    (a) => a.status === 'PENDING_REVIEW'
  ).length;

  const customerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts & Cards', icon: Wallet },
    { id: 'transfer', label: 'Transfer Money', icon: ArrowLeftRight },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'expenses', label: 'Expense Tracker', icon: PieChart },
    { id: 'income', label: 'Income Streams', icon: TrendingUp },
    { id: 'budgets', label: 'Budgets & Limits', icon: Target },
    { id: 'reports', label: 'Financial Reports', icon: FileBarChart },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
    {
      id: 'fraud-alerts',
      label: 'Anomaly Detection',
      icon: ShieldAlert,
      badge: pendingFraudAlertsCount > 0 ? pendingFraudAlertsCount : undefined,
      badgeColor: 'bg-amber-500',
    },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
    { id: 'admin-users', label: 'User Directory', icon: UserCheck },
    {
      id: 'admin-fraud',
      label: 'Fraud Triage',
      icon: ShieldAlert,
      badge: pendingFraudAlertsCount > 0 ? pendingFraudAlertsCount : undefined,
      badgeColor: 'bg-rose-500',
    },
  ];

  const handleItemClick = (pageId: string) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header of Sidebar */}
        <div className="flex flex-col">
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                ₹
              </div>
              <div>
                <span className="font-bold text-white tracking-tight text-sm">FinSim Portal</span>
                <span className="text-[10px] block text-emerald-400 font-semibold">4th-Year CSE Major</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Personal Banking
              </p>
              <div className="space-y-1">
                {customerNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                            item.badgeColor || 'bg-rose-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Management Section */}
            {(currentUser.role === 'ADMIN' || currentUser.role === 'SUPPORT_STAFF') && (
              <div>
                <div className="px-3 flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Governance & Admin
                  </p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <div className="space-y-1">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                              item.badgeColor || 'bg-rose-500'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer Developer Credit */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              HB
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-white truncate">Developed by Hussain Bee</p>
              <p className="text-[10px] text-slate-400 truncate">Computer Science & Eng. 2026</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

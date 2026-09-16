/**
 * Full-Stack Simulated Digital Banking & Personal Finance Platform
 * Developed by Hussain Bee - 4th Year Computer Science Engineering Major Project
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { DashboardPage } from './pages/customer/DashboardPage';
import { TransferPage } from './pages/customer/TransferPage';
import { AccountsPage } from './pages/customer/AccountsPage';
import { TransactionsPage } from './pages/customer/TransactionsPage';
import { ExpensesPage } from './pages/customer/ExpensesPage';
import { IncomePage } from './pages/customer/IncomePage';
import { BudgetsPage } from './pages/customer/BudgetsPage';
import { ReportsPage } from './pages/customer/ReportsPage';
import { NotificationsPage } from './pages/customer/NotificationsPage';
import { FraudAlertsPage } from './pages/customer/FraudAlertsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfilePage } from './pages/customer/ProfilePage';

const MainLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'transfer':
        return <TransferPage />;
      case 'accounts':
        return <AccountsPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'income':
        return <IncomePage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'fraud':
        return <FraudAlertsPage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderCurrentPage()}
          </div>

          {/* Educational Project Footer */}
          <footer className="mt-12 py-6 border-t border-slate-900 text-center text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-400">
              FinSim: Digital Banking & Personal Finance Simulation • 4th Year Major Project
            </p>
            <p className="text-emerald-400 font-semibold">
              Developed by Hussain Bee
            </p>
            <p className="text-[11px] text-slate-600">
              Disclaimer: Strictly an educational simulation for Computer Science Engineering. Does not connect to real financial networks or real money.
            </p>
          </footer>
        </main>
      </div>

      {/* Global Real-Time Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

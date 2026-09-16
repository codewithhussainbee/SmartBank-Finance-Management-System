import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { NotificationType } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');

  const userNotifications = notifications.filter((n) => n.userId === currentUser.id);

  const filtered = userNotifications.filter((n) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !n.read;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'SUSPICIOUS_TXN':
      case 'SECURITY_ALERT':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'BUDGET_EXCEEDED':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'BUDGET_WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'TRANSFER_SUCCESS':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'TRANSFER_FAILED':
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div id="notifications-page" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">System Alerts & Notifications</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Dispatcher
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time notifications for transfers, budget overruns, and anomaly risk detections.
          </p>
        </div>

        <button
          id="btn-mark-all-read"
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'UNREAD', 'SUSPICIOUS_TXN', 'BUDGET_WARNING', 'BUDGET_EXCEEDED', 'TRANSFER_SUCCESS'].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterType === type
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type.replace(/_/g, ' ')}
            </button>
          )
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            No notifications matching this filter.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              id={`notification-item-${n.id}`}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                n.read
                  ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                  : 'bg-slate-900 border-emerald-500/30 shadow-md shadow-emerald-950/20'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-sans">
                    {formatDateTime(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" title="Unread" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

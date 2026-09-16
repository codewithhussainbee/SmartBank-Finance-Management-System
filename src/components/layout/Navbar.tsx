import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Shield,
  User as UserIcon,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Menu
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate, currentPage: _currentPage }) => {
  const {
    currentUser,
    users,
    switchUser,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetAllData,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
      {/* Left section: mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 md:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-base">FinSim Core</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Simulation Sandbox
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Developed by Hussain Bee</p>
          </div>
        </div>
      </div>

      {/* Right controls: Role Selector, Notifications, Reset Data, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Quick Switcher for Project Viva & Demo */}
        <div className="hidden lg:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-xs">
          <span className="text-slate-400 px-2 py-1 flex items-center gap-1 font-medium text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Viva Persona:
          </span>
          {users.slice(0, 3).map((u) => (
            <button
              key={u.id}
              id={`switch-user-${u.id}`}
              onClick={() => switchUser(u.id)}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                currentUser.id === u.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {u.role === 'ADMIN' ? 'Admin' : u.role === 'SUPPORT_STAFF' ? 'Support' : 'Customer'}
            </button>
          ))}
        </div>

        {/* Demo reset button */}
        <button
          id="btn-reset-demo-data"
          onClick={() => {
            if (window.confirm('Reset simulated database back to initial seed data?')) {
              resetAllData();
            }
          }}
          title="Reset simulated accounts, balances, and history to seed state"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notifications-dropdown"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-1 divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <p className="text-[11px] text-slate-400">
                    {unreadNotificationCount} unread system alert{unreadNotificationCount === 1 ? '' : 's'}
                  </p>
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    id="btn-mark-all-read"
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No simulated notifications at this time.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      id={`notif-item-${notif.id}`}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-800/50 ${
                        !notif.read ? 'bg-slate-800/20' : 'opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-semibold ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">{notif.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {formatDateTime(notif.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 text-center bg-slate-950/40 rounded-b-xl">
                <button
                  id="btn-view-all-notifications"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('notifications');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium py-1 w-full"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile & Switcher Menu */}
        <div className="relative" ref={userRef}>
          <button
            id="btn-user-profile-menu"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold text-xs">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">{currentUser.fullName}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{currentUser.role}</p>
            </div>
          </button>

          {showUserMenu && (
            <div
              id="user-profile-popover"
              className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-2 divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="p-3">
                <p className="text-xs font-medium text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-white mt-0.5">{currentUser.fullName}</p>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Role: {currentUser.role}
                </div>
              </div>

              {/* Role switchers inside mobile / compact menu */}
              <div className="py-2">
                <p className="text-[11px] font-semibold text-slate-400 px-3 pb-1.5 uppercase tracking-wider">
                  Switch Active Persona
                </p>
                {users.map((u) => (
                  <button
                    key={u.id}
                    id={`menu-switch-user-${u.id}`}
                    onClick={() => {
                      switchUser(u.id);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentUser.id === u.id
                        ? 'bg-emerald-600/15 text-emerald-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{u.fullName}</div>
                      <div className="text-[10px] text-slate-400">{u.role}</div>
                    </div>
                    {currentUser.id === u.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>

              <div className="py-1">
                <button
                  id="btn-goto-profile"
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('profile');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" /> My Profile & Security
                </button>
                {currentUser.role === 'ADMIN' && (
                  <button
                    id="btn-goto-admin-dash"
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('admin');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 font-medium"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin Governance Portal
                  </button>
                )}
              </div>

              <div className="p-2 text-[10px] text-slate-400 text-center bg-slate-950/40 rounded-b-xl">
                <span>Educational Banking Engine</span>
                <span className="block font-semibold text-slate-300 mt-0.5">Developed by Hussain Bee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

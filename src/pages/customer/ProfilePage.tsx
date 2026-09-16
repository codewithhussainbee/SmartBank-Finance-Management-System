import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User as UserIcon,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  RotateCcw,
  KeyRound,
  Shield,
  CheckCircle2,
  Award
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const ProfilePage: React.FC = () => {
  const { currentUser, switchUserRole, resetDemoData, addToast } = useApp();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Simulated customer profile saved successfully.',
    });
  };

  return (
    <div id="profile-page" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Profile & Settings</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            KYC Tier 2 Verified
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Simulated identity credentials, project attribution, and viva presentation role controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center space-y-4 shadow-lg">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-emerald-950/40">
            {currentUser.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>

          <div>
            <h2 className="text-base font-bold text-white">{currentUser.fullName}</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{currentUser.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role: {currentUser.role}
            </div>
          </div>

          <div className="w-full pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400 text-left">
            <div className="flex items-center justify-between">
              <span>Account Status:</span>
              <span className="text-emerald-400 font-semibold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Simulated KYC:</span>
              <span className="text-emerald-400 font-semibold">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Member Since:</span>
              <span>{formatDateTime(currentUser.createdAt).slice(0, 11)}</span>
            </div>
          </div>

          {/* Quick Role Switch for Viva Demonstration */}
          <div className="w-full pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-medium block">
              Evaluation Role Switcher:
            </span>
            <button
              id="btn-switch-role"
              onClick={() => {
                const nextRole = currentUser.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
                switchUserRole(nextRole);
              }}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              Switch Role to {currentUser.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'}
            </button>
          </div>
        </div>

        {/* Profile Edit Form & Reset Controls */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Simulated State / Branch
                  </label>
                  <input
                    type="text"
                    defaultValue="Bengaluru Main Branch (Karnataka)"
                    disabled
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                >
                  Save Profile Updates
                </button>
              </div>
            </form>
          </div>

          {/* Educational Attribution & Seed Reset */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Project Attribution & Sandbox Reset</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This system is engineered for a 4th-year Computer Science Engineering major project.
              <br />
              <strong className="text-emerald-400">Developed by Hussain Bee</strong>.
            </p>

            <div className="pt-2">
              <button
                id="btn-reset-demo-data"
                onClick={resetDemoData}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-semibold text-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset Simulation to Seed State
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

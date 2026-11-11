import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Bell, ChevronDown, Shield, LogOut, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenSetup: () => void;
  onLogout: () => void;
  onSwitchProfile: (roleKey: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenSetup,
  onLogout,
  onSwitchProfile,
  unreadNotificationsCount,
  onOpenNotifications,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Interview<span className="text-indigo-600">AI</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap hover:text-slate-900 transition-colors ${
              currentView === 'landing' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <a
            href="#features"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="whitespace-nowrap hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="whitespace-nowrap hover:text-slate-900 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#categories"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="whitespace-nowrap hover:text-slate-900 transition-colors"
          >
            Categories
          </a>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap flex items-center gap-1.5 hover:text-slate-900 transition-colors ${
              currentView.startsWith('dashboard') ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('coding')}
            className={`whitespace-nowrap hover:text-slate-900 transition-colors ${
              currentView === 'coding' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            Coding Lab
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>

          {/* Quick Profile Dropdown & Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              {user.isAdmin && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold">Admin</span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.targetRole}</p>
                </div>

                <div className="py-1">
                  <div className="px-4 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Switch Demo Persona
                  </div>
                  <button
                    onClick={() => {
                      onSwitchProfile('default');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
                  >
                    <span>Alex Chen (Full Stack)</span>
                    <span className="text-[10px] text-slate-400">Score 86</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchProfile('graduate');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
                  >
                    <span>Sarah Jenkins (Fresh Grad)</span>
                    <span className="text-[10px] text-slate-400">Junior</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchProfile('senior');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
                  >
                    <span>David Lee (Staff Architect)</span>
                    <span className="text-[10px] text-slate-400">Senior 5+y</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchProfile('admin');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-purple-700 hover:bg-purple-50 flex items-center justify-between font-medium"
                  >
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Marcus Vance
                    </span>
                    <span className="text-[10px] bg-purple-100 px-1 rounded">Admin</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    Reset Data / Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenSetup}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-sm shadow-indigo-500/25 transition-all hover:shadow hover:shadow-indigo-500/30 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start AI Interview</span>
          </button>
        </div>
      </div>
    </header>
  );
};

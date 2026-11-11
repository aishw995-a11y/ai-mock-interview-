import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Trash2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onResetAllData,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [targetRole, setTargetRole] = useState(user.targetRole);
  const [college, setCollege] = useState(user.college);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Notifications toggles
  const [notifyReportReady, setNotifyReportReady] = useState(true);
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [notifyWeeklyReminder, setNotifyWeeklyReminder] = useState(true);

  const [message, setMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      targetRole,
      college,
    });
    setMessage('Profile settings updated successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert('Please fill out password fields');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setMessage('Password changed successfully.');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Account & Platform Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your candidate profile, security credentials, notification preferences, and privacy controls
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Edit Profile */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-base pb-3 border-b border-slate-100">
          <User className="w-5 h-5 text-indigo-600" />
          <span>Profile Information</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Job Role</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">College / Organization</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-base pb-3 border-b border-slate-100">
          <Lock className="w-5 h-5 text-indigo-600" />
          <span>Security & Password</span>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-base pb-3 border-b border-slate-100">
          <Bell className="w-5 h-5 text-indigo-600" />
          <span>Notification Preferences</span>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <p className="font-semibold text-slate-900">Evaluation Report Ready</p>
              <p className="text-slate-500">Receive alert as soon as the AI recruiter compiles your evaluation report.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyReportReady}
              onChange={(e) => setNotifyReportReady(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <p className="font-semibold text-slate-900">Skill Milestones</p>
              <p className="text-slate-500">Alerts when your competency score reaches a new bracket.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyMilestones}
              onChange={(e) => setNotifyMilestones(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <p className="font-semibold text-slate-900">Weekly Practice Reminders</p>
              <p className="text-slate-500">Stay consistent with smart pacing alerts to maintain interview readiness.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyWeeklyReminder}
              onChange={(e) => setNotifyWeeklyReminder(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Privacy and Reset */}
      <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-900 font-heading font-bold text-base pb-3 border-b border-rose-100">
          <Shield className="w-5 h-5 text-rose-600" />
          <span>Data Management & Reset</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Reset all cached interviews, local question modifications, and evaluation logs back to factory demo defaults.
        </p>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all mock interview data and restart?')) {
              onResetAllData();
            }
          }}
          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset All Mock Data to Default</span>
        </button>
      </div>
    </div>
  );
};

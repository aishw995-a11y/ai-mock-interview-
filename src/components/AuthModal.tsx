import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { DEMO_PROFILES } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (mode === 'forgot') {
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      setSuccessMessage('Password reset instructions have been sent to your email.');
      setTimeout(() => setMode('login'), 2500);
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: fullName,
        email,
        targetRole: 'Software Developer',
        experienceLevel: 'Entry Level (0-2 yrs)',
        college: 'University',
        skills: ['JavaScript', 'React', 'Problem Solving'],
        preferredCategory: 'Technical',
        careerGoals: 'Build high-impact software products.',
        isAdmin: false,
      };

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        onSuccess(newUser);
        onClose();
      }, 700);
      return;
    }

    // Login
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    // Match or create default
    const user: UserProfile = {
      ...DEMO_PROFILES.default,
      email: email || DEMO_PROFILES.default.email,
      name: email.split('@')[0] || DEMO_PROFILES.default.name,
    };

    setSuccessMessage('Signed in successfully!');
    setTimeout(() => {
      onSuccess(user);
      onClose();
    }, 500);
  };

  const handleDemoLogin = (profileKey: string) => {
    const profile = DEMO_PROFILES[profileKey] || DEMO_PROFILES.default;
    onSuccess(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login'
                ? 'Sign in to access your interview sessions and reports.'
                : mode === 'register'
                ? 'Join thousands of candidates preparing with AI.'
                : 'Enter your email to receive a password reset link.'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick Demo Accounts */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => handleDemoLogin('default')}
                className="py-1.5 px-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg transition-colors text-left"
              >
                Alex (Full Stack)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('graduate')}
                className="py-1.5 px-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg transition-colors text-left"
              >
                Sarah (Fresh Grad)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('senior')}
                className="py-1.5 px-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg transition-colors text-left"
              >
                David (Staff Arch)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors text-left font-semibold flex items-center gap-1"
              >
                <Shield className="w-3 h-3" /> Marcus (Admin)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-sm text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Modes */}
          <div className="mt-5 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Register now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Play,
  FileText,
  Code2,
  Brain,
  History,
  TrendingUp,
  HelpCircle,
  User,
  Shield,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, InterviewSession, QuestionBankItem, SkillCategoryScore, NotificationItem, InterviewQuestion } from './types';
import { StorageService } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { InterviewSetupModal } from './components/InterviewSetupModal';
import { MockInterviewInterface } from './components/MockInterviewInterface';
import { EvaluationReportModal } from './components/EvaluationReportModal';
import { DashboardView } from './components/DashboardView';
import { InterviewHistoryView } from './components/InterviewHistoryView';
import { SkillDevelopmentView } from './components/SkillDevelopmentView';
import { QuestionPracticeBank } from './components/QuestionPracticeBank';
import { ResumeInterviewModule } from './components/ResumeInterviewModule';
import { CodingInterviewModule } from './components/CodingInterviewModule';
import { AdminDashboard } from './components/AdminDashboard';
import { SettingsView } from './components/SettingsView';
import { NotificationDrawer } from './components/NotificationDrawer';

export default function App() {
  // App state
  const [user, setUser] = useState<UserProfile>(StorageService.getUser());
  const [sessions, setSessions] = useState<InterviewSession[]>(StorageService.getSessions());
  const [skills, setSkills] = useState<SkillCategoryScore[]>(StorageService.getSkills());
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(StorageService.getQuestionBank());
  const [notifications, setNotifications] = useState<NotificationItem[]>(StorageService.getNotifications());

  // Navigation
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'history' | 'coding' | 'resume' | 'skills' | 'questions' | 'profile' | 'admin' | 'settings'>('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [presetCategory, setPresetCategory] = useState<string | undefined>(undefined);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Active Mock Interview
  const [isMockInterviewActive, setIsMockInterviewActive] = useState(false);
  const [activeMockConfig, setActiveMockConfig] = useState<{
    role: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    durationMinutes: number;
    questionCount: number;
    resumeContext?: string;
  } | null>(null);
  const [preloadedQuestions, setPreloadedQuestions] = useState<InterviewQuestion[] | undefined>(undefined);

  // Evaluation Dossier Modal
  const [selectedReportSession, setSelectedReportSession] = useState<InterviewSession | null>(null);

  // Refresh user data when switched
  const handleSwitchProfile = (roleKey: string) => {
    const switched = StorageService.switchProfile(roleKey as any);
    setUser(switched);
    setSessions(StorageService.getSessions());
    setSkills(StorageService.getSkills());
    setNotifications(StorageService.getNotifications());
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleStartInterviewFromAnywhere = (category?: string) => {
    setPresetCategory(category);
    setPreloadedQuestions(undefined);
    setIsSetupModalOpen(true);
  };

  const handleLaunchConfiguredInterview = (config: {
    role: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    durationMinutes: number;
    questionCount: number;
    resumeContext?: string;
  }) => {
    setActiveMockConfig(config);
    setIsSetupModalOpen(false);
    setIsMockInterviewActive(true);
  };

  const handleLaunchResumeInterview = (questions: InterviewQuestion[], role: string) => {
    setActiveMockConfig({
      role,
      category: 'Technical (Resume-Based)',
      difficulty: 'Intermediate',
      durationMinutes: 20,
      questionCount: questions.length,
    });
    setPreloadedQuestions(questions);
    setIsMockInterviewActive(true);
  };

  const handlePracticeSingleQuestion = (bankItem: QuestionBankItem) => {
    const questionObj: InterviewQuestion = {
      id: bankItem.id,
      question: bankItem.question,
      category: bankItem.category,
      difficulty: bankItem.difficulty,
      idealAnswerKeyPoints: ['Structure', 'Technical detail', 'Clear examples'],
      expectedTimeSeconds: 150,
    };

    setActiveMockConfig({
      role: bankItem.role,
      category: bankItem.category,
      difficulty: bankItem.difficulty,
      durationMinutes: 10,
      questionCount: 1,
    });
    setPreloadedQuestions([questionObj]);
    setIsMockInterviewActive(true);
  };

  const handleInterviewCompleted = (session: InterviewSession) => {
    const updated = StorageService.saveSession(session);
    setSessions(updated);
    setSkills(StorageService.getSkills());
    setNotifications(StorageService.getNotifications());
    setIsMockInterviewActive(false);
    setSelectedReportSession(session);
  };

  const handleRetakeSession = (session: InterviewSession) => {
    setSelectedReportSession(null);
    setActiveMockConfig({
      role: session.role,
      category: session.category,
      difficulty: session.difficulty,
      durationMinutes: session.durationMinutes,
      questionCount: session.questionCount,
    });
    setPreloadedQuestions(session.questions);
    setIsMockInterviewActive(true);
  };

  const handleResetAll = () => {
    StorageService.resetAllData();
    setUser(StorageService.getUser());
    setSessions(StorageService.getSessions());
    setSkills(StorageService.getSkills());
    setQuestionBank(StorageService.getQuestionBank());
    setNotifications(StorageService.getNotifications());
    setCurrentView('landing');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Sidebar navigation items
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'coding', label: 'Coding Lab', icon: Code2 },
    { id: 'resume', label: 'Resume Interview', icon: FileText },
    { id: 'history', label: 'Interview History', icon: History },
    { id: 'skills', label: 'Skill Development', icon: TrendingUp },
    { id: 'questions', label: 'Question Bank', icon: HelpCircle },
    { id: 'profile', label: 'My Profile', icon: User },
    ...(user.isAdmin ? [{ id: 'admin', label: 'Admin Dashboard', icon: Shield, badge: 'Admin' }] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Universal Top Bar */}
      <Navbar
        user={user}
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v as any)}
        onOpenAuth={handleOpenAuth}
        onOpenSetup={() => handleStartInterviewFromAnywhere()}
        onLogout={handleResetAll}
        onSwitchProfile={handleSwitchProfile}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Main View Area */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          <LandingPage
            onStartInterview={(cat) => handleStartInterviewFromAnywhere(cat)}
            onNavigate={(v) => setCurrentView(v as any)}
            sessions={sessions}
          />
        </main>
      ) : (
        /* Dashboard Workspace with Collapsible Sidebar */
        <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
          {/* Collapsible Sidebar (Desktop) */}
          <aside
            className={`hidden md:flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs transition-all duration-200 shrink-0 ${
              isSidebarCollapsed ? 'w-20' : 'w-64'
            }`}
          >
            <div className="space-y-6">
              {/* Collapse Toggle & Brand kicker */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                {!isSidebarCollapsed && (
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Workspace
                  </span>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 mx-auto transition-colors"
                  title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* Start Interview CTA in Sidebar */}
              <button
                onClick={() => handleStartInterviewFromAnywhere()}
                className={`w-full py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all ${
                  isSidebarCollapsed ? 'px-2' : ''
                }`}
                title="Start New Interview"
              >
                <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                {!isSidebarCollapsed && <span>New Interview</span>}
              </button>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      title={item.label}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      {!isSidebarCollapsed && item.badge && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Profile Mini-Card */}
            <div className="pt-4 border-t border-slate-100">
              <div
                className={`flex items-center gap-3 ${
                  isSidebarCollapsed ? 'justify-center' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="truncate flex-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.targetRole}</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Dashboard View Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Nav Switcher Pills */}
            <div className="md:hidden mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {currentView === 'dashboard' && (
              <DashboardView
                user={user}
                sessions={sessions}
                skills={skills}
                onStartInterview={(cat) => handleStartInterviewFromAnywhere(cat)}
                onViewReport={(s) => setSelectedReportSession(s)}
                onNavigate={(v) => setCurrentView(v as any)}
              />
            )}

            {currentView === 'history' && (
              <InterviewHistoryView
                sessions={sessions}
                onViewReport={(s) => setSelectedReportSession(s)}
                onRetake={handleRetakeSession}
                onStartNew={() => handleStartInterviewFromAnywhere()}
              />
            )}

            {currentView === 'coding' && <CodingInterviewModule />}

            {currentView === 'resume' && (
              <ResumeInterviewModule
                user={user}
                onLaunchInterviewWithQuestions={handleLaunchResumeInterview}
              />
            )}

            {currentView === 'skills' && (
              <SkillDevelopmentView
                skills={skills}
                onStartPractice={(cat) => handleStartInterviewFromAnywhere(cat)}
              />
            )}

            {currentView === 'questions' && (
              <QuestionPracticeBank
                questions={questionBank}
                onPracticeQuestion={handlePracticeSingleQuestion}
              />
            )}

            {currentView === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-indigo-100 text-indigo-700 font-bold text-xl flex items-center justify-center">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-slate-900">{user.name}</h3>
                      <p className="text-xs text-slate-500">{user.email} · {user.experienceLevel}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-400 uppercase text-[10px] block mb-1">Target Job Role</span>
                    <span className="font-bold text-slate-900 text-sm">{user.targetRole}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-400 uppercase text-[10px] block mb-1">Education / College</span>
                    <span className="font-bold text-slate-900 text-sm">{user.college}</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider block mb-2">Verified Competencies</span>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-700 block mb-1">Career Goal Statement:</span>
                  <p className="text-slate-600 italic">"{user.careerGoals}"</p>
                </div>
              </div>
            )}

            {currentView === 'admin' && (
              <AdminDashboard
                currentUser={user}
                questionBank={questionBank}
                onUpdateQuestionBank={(items) => setQuestionBank(items)}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                user={user}
                onUpdateUser={(updated) => {
                  setUser(updated);
                  StorageService.saveUser(updated);
                }}
                onResetAllData={handleResetAll}
              />
            )}
          </main>
        </div>
      )}

      {/* Universal Footer */}
      <Footer
        onNavigate={(v) => setCurrentView(v as any)}
        onOpenSetup={() => handleStartInterviewFromAnywhere()}
      />

      {/* Modals & Interfaces */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            StorageService.saveUser(loggedInUser);
          }}
        />
      )}

      {isOnboardingOpen && (
        <OnboardingModal
          isOpen={isOnboardingOpen}
          user={user}
          onClose={() => setIsOnboardingOpen(false)}
          onSave={(updated) => {
            setUser(updated);
            StorageService.saveUser(updated);
          }}
        />
      )}

      {isSetupModalOpen && (
        <InterviewSetupModal
          isOpen={isSetupModalOpen}
          user={user}
          presetCategory={presetCategory}
          onClose={() => setIsSetupModalOpen(false)}
          onStart={handleLaunchConfiguredInterview}
        />
      )}

      {isMockInterviewActive && activeMockConfig && (
        <MockInterviewInterface
          user={user}
          initialRole={activeMockConfig.role}
          initialCategory={activeMockConfig.category}
          initialDifficulty={activeMockConfig.difficulty}
          initialDurationMinutes={activeMockConfig.durationMinutes}
          initialQuestionCount={activeMockConfig.questionCount}
          initialResumeContext={activeMockConfig.resumeContext}
          preloadedQuestions={preloadedQuestions}
          onComplete={handleInterviewCompleted}
          onExit={() => setIsMockInterviewActive(false)}
        />
      )}

      {selectedReportSession && (
        <EvaluationReportModal
          isOpen={Boolean(selectedReportSession)}
          session={selectedReportSession}
          onClose={() => setSelectedReportSession(null)}
          onRetake={handleRetakeSession}
          onPracticeWeakAreas={() => {
            setSelectedReportSession(null);
            setCurrentView('skills');
          }}
        />
      )}

      {isNotificationDrawerOpen && (
        <NotificationDrawer
          isOpen={isNotificationDrawerOpen}
          notifications={notifications}
          onClose={() => setIsNotificationDrawerOpen(false)}
          onMarkAllRead={() => {
            StorageService.markNotificationsRead();
            setNotifications(StorageService.getNotifications());
          }}
        />
      )}
    </div>
  );
}

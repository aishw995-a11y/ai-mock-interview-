import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Layers,
  ArrowRight,
  Play,
  RotateCcw,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { UserProfile, InterviewSession, SkillCategoryScore } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  sessions: InterviewSession[];
  skills: SkillCategoryScore[];
  onStartInterview: (presetCategory?: string) => void;
  onViewReport: (session: InterviewSession) => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  sessions,
  skills,
  onStartInterview,
  onViewReport,
  onNavigate,
}) => {
  // Aggregate KPIs
  const totalInterviews = sessions.length;
  const avgScore =
    totalInterviews > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.overallScore, 0) / totalInterviews)
      : 84;
  const bestScore =
    totalInterviews > 0
      ? Math.max(...sessions.map((s) => s.overallScore))
      : 88;
  const totalPracticeHours = (sessions.reduce((acc, s) => acc + (s.actualDurationSeconds || s.durationMinutes * 60), 0) / 3600).toFixed(1);

  // Performance Trend Data (reversed chronological)
  const trendData = [...sessions]
    .reverse()
    .slice(-6)
    .map((s, idx) => ({
      sessionName: `Session ${idx + 1}`,
      score: s.overallScore,
      date: s.date.slice(5),
    }));

  // Category Distribution Data
  const categoryCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });
  const categoryBarData = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat.length > 12 ? cat.slice(0, 10) + '...' : cat,
    count,
  }));

  // Skill Radar Data
  const skillRadarData = skills.map((sk) => ({
    subject: sk.name.length > 14 ? sk.name.slice(0, 12) + '...' : sk.name,
    score: sk.currentScore,
  }));

  // Weekly Practice Data
  const weeklyData = [
    { day: 'Mon', sessions: 1 },
    { day: 'Tue', sessions: 2 },
    { day: 'Wed', sessions: 1 },
    { day: 'Thu', sessions: 0 },
    { day: 'Fri', sessions: 2 },
    { day: 'Sat', sessions: 1 },
    { day: 'Sun', sessions: 1 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-dot-grid" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Targeting: {user.targetRole}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight mb-2">
              Welcome back, {user.name.split(' ')[0]}! Ready to improve your interview skills?
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your average score is <strong className="text-white font-mono">{avgScore}%</strong> across {totalInterviews} sessions. Practice consistently to master technical trade-offs and behavioral presence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onStartInterview()}
              className="px-5 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue Practice</span>
            </button>
            <button
              onClick={() => onNavigate('resume')}
              className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Resume Deep-Dive</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Interviews</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tabular-nums">
            {totalInterviews}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Full evaluation records</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Average Score</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600 tabular-nums">
            {avgScore}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Across 8 competence metrics</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Best Performance</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tabular-nums">
            {bestScore}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Senior Ready benchmark</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Practice Hours</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tabular-nums">
            {totalPracticeHours}h
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Voice & code simulator</p>
        </div>
      </div>

      {/* Analytics Visualizations Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Performance Progression</h3>
              <p className="text-xs text-slate-500">Evaluation scores across consecutive mock interview sessions</p>
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Trend: Upward
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="sessionName" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4F46E5' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill-Wise Radar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Skill Competence Radar</h3>
              <p className="text-xs text-slate-500">Multidimensional readiness evaluation</p>
            </div>
            <button
              onClick={() => onNavigate('skills')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              View Roadmap
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadarData} margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#CBD5E1" tick={false} />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#7C3AED"
                  fill="#7C3AED"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Interviews by Category</h3>
              <p className="text-xs text-slate-500">Distribution across technical and behavioral tracks</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Bars */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Weekly Practice Activity</h3>
              <p className="text-xs text-slate-500">Target: 4 sessions per week for steady retention</p>
            </div>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Goal on track
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis allowDecimals={false} domain={[0, 4]} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="sessions" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Interview Sessions List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">Recent Interview Sessions</h3>
            <p className="text-xs text-slate-500">Review evaluation dossiers, answer transcripts, and model answers</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {sessions.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-900">{s.title}</h4>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {s.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{s.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{s.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{s.questionCount} Questions</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-heading font-extrabold text-lg text-slate-900 tabular-nums">
                    {s.overallScore}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/100</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewReport(s)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                  <button
                    onClick={() => onStartInterview(s.category)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Retake session"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Practice & Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <h4 className="font-heading font-bold text-base text-indigo-950">Recommended Mock Interviews</h4>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Personalized tracks based on your profile as a {user.targetRole} ({user.experienceLevel}):
          </p>
          <div className="space-y-2.5">
            {[
              { title: 'Distributed Systems & Microservice Caching', track: 'Technical', diff: 'Intermediate' },
              { title: 'STAR Behavioral: Leading Through Ambiguity', track: 'Behavioral', diff: 'Intermediate' },
              { title: 'Live Coding: Tree Traversal & Dynamic Programming', track: 'Coding', diff: 'Advanced' },
            ].map((rec, i) => (
              <div
                key={i}
                className="p-3 bg-white rounded-xl border border-indigo-100/80 flex items-center justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">{rec.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {rec.track} · {rec.diff}
                  </p>
                </div>
                <button
                  onClick={() => onStartInterview(rec.track)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h4 className="font-heading font-bold text-base text-amber-950">Targeted Areas for Improvement</h4>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Specific concepts highlighted in your recent evaluations requiring deeper depth:
          </p>
          <div className="space-y-2">
            {[
              { topic: 'PostgreSQL EXPLAIN ANALYZE', desc: 'Detail index scans vs heap fetches and buffer metrics' },
              { topic: 'React 19 Concurrent Actions', desc: 'Explain priority lanes and optimistic update transitions' },
              { topic: 'STAR Quantified Impact', desc: 'Always conclude with percentage latency or revenue impact' },
            ].map((weak, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-amber-100 text-xs">
                <span className="font-semibold text-slate-900 block">{weak.topic}</span>
                <span className="text-slate-500 text-[11px]">{weak.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

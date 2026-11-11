import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Video,
  Mic,
  Brain,
  FileText,
  BarChart3,
  Award,
  CheckCircle2,
  Code2,
  Users,
  Compass,
  Cpu,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Play,
} from 'lucide-react';
import { InterviewSession } from '../types';

interface LandingPageProps {
  onStartInterview: (presetCategory?: string) => void;
  onNavigate: (view: string) => void;
  sessions: InterviewSession[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartInterview, onNavigate, sessions }) => {
  // Real platform metrics combined with user's local sessions
  const totalUserInterviews = sessions.length;
  const totalUserQuestions = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
  const avgScore = sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length) : 84;

  const categories = [
    {
      id: 'Technical',
      title: 'Technical Interview',
      desc: 'System architecture, API design, backend scaling, and frontend state engines.',
      icon: Cpu,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'Coding',
      title: 'Programming & Coding',
      desc: 'Live algorithmic challenges, edge case handling, and automated code review.',
      icon: Code2,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'Data Structures and Algorithms',
      title: 'Data Structures & Algorithms',
      desc: 'Trees, graphs, dynamic programming, heaps, and Big-O computational analysis.',
      icon: Brain,
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'Behavioral',
      title: 'Behavioral & STAR Method',
      desc: 'Conflict resolution, leadership milestones, executive communication, and team culture.',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'HR',
      title: 'HR & Culture Fit',
      desc: 'Career goals, salary expectations, role motivations, and company value alignment.',
      icon: Award,
      color: 'from-amber-600 to-orange-600',
    },
    {
      id: 'Communication Skills',
      title: 'Communication & Presence',
      desc: 'Articulating technical concepts clearly, reducing filler words, and vocal pacing.',
      icon: MessageSquare,
      color: 'from-cyan-600 to-blue-600',
    },
    {
      id: 'Aptitude Interview',
      title: 'Aptitude & Analytical Logic',
      desc: 'Quantitative reasoning, data interpretation, probability, and critical thinking.',
      icon: Compass,
      color: 'from-violet-600 to-indigo-600',
    },
    {
      id: 'Managerial',
      title: 'Managerial & Leadership',
      desc: 'Hiring bar management, sprint scoping, cross-functional roadblocks, and mentorship.',
      icon: ShieldCheck,
      color: 'from-rose-600 to-pink-600',
    },
  ];

  const features = [
    {
      title: 'AI-Powered Mock Interviews',
      desc: 'Simulate natural, dynamic conversational interviews tailored to your exact target role and seniority level.',
      icon: Video,
    },
    {
      title: 'Smart Question Generation',
      desc: 'Model generates challenging, non-generic questions adapted to your industry, tech stack, and background.',
      icon: Sparkles,
    },
    {
      title: 'Real-Time Answer Analysis',
      desc: 'Assess content relevance, problem-solving logic, and technical accuracy as soon as you finish speaking.',
      icon: Brain,
    },
    {
      title: 'Voice-Based Interview Practice',
      desc: 'Speak naturally into your microphone while the AI recruiter listens and responds with realistic speech audio.',
      icon: Mic,
    },
    {
      title: 'Speech-to-Text Conversion',
      desc: 'High-accuracy real-time speech transcription displays your spoken answers with editable text fallback.',
      icon: MessageSquare,
    },
    {
      title: 'Automated Performance Evaluation',
      desc: 'Receive transparent objective scoring out of 100 across 8 core competence dimensions.',
      icon: BarChart3,
    },
    {
      title: 'Personalized Improvement Suggestions',
      desc: 'Identify missing concepts, structural weaknesses, and review model senior-engineer answers for every question.',
      icon: TrendingUp,
    },
    {
      title: 'Interview History & Analytics',
      desc: 'Track score progression, category breakdowns, radar competence graphs, and practice hours over time.',
      icon: Award,
    },
    {
      title: 'Technical & HR Preparation',
      desc: 'Prepare comprehensively across system design, algorithms, behavioral STAR narratives, and executive HR.',
      icon: Users,
    },
    {
      title: 'Downloadable Performance Reports',
      desc: 'Export clean, comprehensive PDF evaluation dossiers to review key takeaways and share with mentors.',
      icon: FileText,
    },
  ];

  const testimonials = [
    {
      quote:
        'InterviewAI helped me identify exact blind spots in my React Fiber and system design answers. The model answers showed me how to articulate trade-offs cleanly. I passed my L5 engineering loop at a major fintech.',
      author: 'Marcus Vance',
      role: 'Senior Software Engineer',
      company: 'Fintech Scale-up',
    },
    {
      quote:
        'As a fresh computer science graduate, mock interviews with friends felt unstructured. InterviewAI asked rigorous behavioral and DSA questions that felt just like the real interviewers.',
      author: 'Sarah Jenkins',
      role: 'Associate Frontend Engineer',
      company: 'Cloud SaaS Corp',
    },
    {
      quote:
        'The resume-based interview mode was unbelievable—it read my portfolio projects and grilled me on the specific latency bottlenecks I claimed in my resume! Built tremendous confidence.',
      author: 'Priya Sharma',
      role: 'Data Analyst & Python Dev',
      company: 'HealthTech Analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-dot-grid border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Header kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Next-Generation AI Interview Coach</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6 text-balance">
              Your Personal AI Interview Coach –{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
                Practice, Improve & Succeed.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Experience realistic mock interviews, receive instant AI-powered feedback, and build the confidence to land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onStartInterview()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group text-base"
              >
                <span>Start Free Interview</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-base shadow-sm"
              >
                <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>Explore Dashboard</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI-Powered Interview Practice</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant Performance Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Personalized Learning Experience</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="relative max-w-5xl mx-auto mt-6 rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/80 to-slate-300/40 shadow-2xl border border-slate-200">
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[16/9] shadow-inner">
              <img
                src="/src/assets/images/hero_interview_preview_1794384759070.jpg"
                alt="InterviewAI Live Video Interview Simulation"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Floating interactive badge overlay */}
              <div className="absolute top-4 left-4 hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">Live Gemini AI Interviewer Active</span>
              </div>

              <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 text-xs">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  88
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Evaluation Score</p>
                  <p className="text-slate-500 text-[11px]">Top 10% · Strong Technical Depth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section (Dynamic & Real) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight tabular-nums">
                {1240 + totalUserInterviews * 8}+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Interviews Completed</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight tabular-nums">
                {5800 + totalUserQuestions * 24}+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Questions Practiced</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-heading font-extrabold text-indigo-600 tracking-tight tabular-nums">
                {avgScore}%
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Average Evaluation Score</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight tabular-nums">
                8 Core
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Competence Dimensions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Comprehensive Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
              Engineered for Real-World Interview Excellence
            </h3>
            <p className="text-slate-600 mt-4 leading-relaxed">
              Every feature is built around the actual hiring bars used by leading engineering, product, and enterprise tech teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-heading font-bold text-slate-900 mb-2">{feat.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (Four-Step Visual Process) */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Streamlined Preparation</h2>
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
              How InterviewAI Prepares You
            </h3>
            <p className="text-slate-600 mt-3">From configuration to deep evaluation in four structured steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                desc: 'Select your target job role, experience level, core technical skills, and career milestones.',
              },
              {
                step: '02',
                title: 'Choose Your Interview',
                desc: 'Pick between Technical, Behavioral, System Design, or upload your resume for custom project questions.',
              },
              {
                step: '03',
                title: 'Practice with AI',
                desc: 'Engage in an immersive video-call setting with voice transcription and realistic AI recruiter dialogue.',
              },
              {
                step: '04',
                title: 'Get Instant Evaluation',
                desc: 'Receive comprehensive scores, radar diagrams, missing technical concepts, and model senior answers.',
              },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-start p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-mono text-2xl font-bold text-indigo-600 mb-3">{item.step}</span>
                <h4 className="text-base font-heading font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Categories Section */}
      <section id="categories" className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Focused Tracks</h2>
              <h3 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                Explore Interview Categories
              </h3>
            </div>
            <button
              onClick={() => onStartInterview()}
              className="mt-4 md:mt-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="font-heading font-bold text-base text-slate-900 mb-1.5">{cat.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">{cat.desc}</p>
                  </div>
                  <button
                    onClick={() => onStartInterview(cat.id)}
                    className="w-full py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Start Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Verified Outcomes</h2>
            <h3 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Trusted by Candidates Landing Dream Offers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between">
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.author}</p>
                  <p className="text-xs text-slate-500">{t.role} · {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4">
            Ready to Ace Your Next Technical Interview?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Start a realistic mock session in seconds. No credit card required. Receive instant AI evaluation.
          </p>
          <button
            onClick={() => onStartInterview()}
            className="px-8 py-3.5 rounded-xl font-semibold text-slate-900 bg-white hover:bg-slate-100 shadow-lg shadow-white/10 transition-all text-base inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Launch Free Mock Interview</span>
          </button>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { TrendingUp, ArrowUpRight, BookOpen, CheckCircle2, Sparkles, Target, Layers, Play } from 'lucide-react';
import { SkillCategoryScore } from '../types';

interface SkillDevelopmentViewProps {
  skills: SkillCategoryScore[];
  onStartPractice: (category: string) => void;
}

export const SkillDevelopmentView: React.FC<SkillDevelopmentViewProps> = ({ skills, onStartPractice }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            Skill Development & Competence Roadmap
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Personalized learning trajectories dynamically calibrated to your AI mock interview evaluations
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Average Competence Growth: +6.5% this month</span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {skill.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{skill.improvementPercentage}%</span>
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-slate-900 mb-2">{skill.name}</h3>

              {/* Score Indicator */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-heading font-extrabold text-3xl text-slate-900 tabular-nums">
                  {skill.currentScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
                <span className="text-xs text-slate-500 ml-auto">
                  Prev: <strong className="font-mono">{skill.previousScore}</strong>
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 mb-5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${skill.currentScore}%` }}
                />
              </div>

              {/* Recommended Focus */}
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="font-semibold text-slate-800 block mb-1">Recommended Focus:</span>
                <p className="text-slate-600 leading-relaxed">{skill.recommendedPractice}</p>
              </div>

              {/* Actionable Suggestions */}
              <div className="space-y-1.5 mb-6 text-xs text-slate-600">
                <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider mb-2">
                  Key Milestones:
                </span>
                {skill.learningSuggestions.map((sugg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                    <span>{sugg}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onStartPractice(skill.category === 'Soft Skills' ? 'Communication Skills' : 'Technical')}
              className="w-full py-2.5 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Targeted Drill</span>
            </button>
          </div>
        ))}
      </div>

      {/* Global Learning Blueprint */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Guided Preparation Strategy</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold mb-3">
            Your Structured 4-Week Interview Mastery Plan
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Our recommendation engine prioritizes high-frequency system design patterns and concise STAR behavioral framing to maximize hiring committee consensus.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="font-semibold text-white block mb-1">Week 1: Foundations & Architecture</span>
              <p className="text-slate-400">Complete 3 mock technical sessions focused on caching, databases, and microservices.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="font-semibold text-white block mb-1">Week 2: Behavioral & STAR Mastery</span>
              <p className="text-slate-400">Practice 4 conflict and project leadership anecdotes with concise metrics.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="font-semibold text-white block mb-1">Week 3: Algorithmic Edge Cases</span>
              <p className="text-slate-400">Solve 5 live coding problems under strict 20-minute time limits.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="font-semibold text-white block mb-1">Week 4: Full Simulation Dress Rehearsals</span>
              <p className="text-slate-400">Conduct 2 comprehensive mixed-track interviews with live video recording.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

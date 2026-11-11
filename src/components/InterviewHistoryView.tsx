import React, { useState } from 'react';
import { Search, Filter, RotateCcw, FileText, Calendar, ArrowUpDown, ChevronRight, Award } from 'lucide-react';
import { InterviewSession } from '../types';

interface InterviewHistoryViewProps {
  sessions: InterviewSession[];
  onViewReport: (session: InterviewSession) => void;
  onRetake: (session: InterviewSession) => void;
  onStartNew: () => void;
}

export const InterviewHistoryView: React.FC<InterviewHistoryViewProps> = ({
  sessions,
  onViewReport,
  onRetake,
  onStartNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  const categories = ['All', 'Technical', 'Behavioral', 'Data Structures and Algorithms', 'Coding', 'HR', 'Management'];

  const filteredSessions = sessions
    .filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.overallScore - a.overallScore;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Interview History</h2>
          <p className="text-xs text-slate-500 mt-1">Review past evaluations, answer recordings, and track skill evolution</p>
        </div>

        <button
          onClick={onStartNew}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs rounded-xl shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all self-start sm:self-auto"
        >
          + Start New Interview
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role, track, or keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700 outline-none"
          >
            <option value="date">Sort by Most Recent</option>
            <option value="score">Sort by Highest Score</option>
          </select>
        </div>
      </div>

      {/* Sessions Table / Cards */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-heading font-bold text-slate-800">No mock interview sessions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Try adjusting your search criteria or launch a fresh mock interview session.
          </p>
          <button
            onClick={onStartNew}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            Launch Interview
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h4 className="font-heading font-bold text-sm text-slate-900">{s.title}</h4>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {s.difficulty}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {s.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Track: {s.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Date: {s.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{s.questionCount} Questions</span>
                  <span aria-hidden="true">·</span>
                  <span>Duration: {Math.round((s.actualDurationSeconds || s.durationMinutes * 60) / 60)} mins</span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto">
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span className="font-heading font-extrabold text-xl text-slate-900 tabular-nums">
                      {s.overallScore}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/100</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {s.overallScore >= 85 ? 'Senior Ready' : s.overallScore >= 75 ? 'Proficient' : 'Needs Practice'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewReport(s)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>
                  <button
                    onClick={() => onRetake(s)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Retake this session"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

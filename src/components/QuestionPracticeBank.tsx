import React, { useState } from 'react';
import { Search, Filter, BookOpen, Eye, EyeOff, Play, Sparkles, Tag, ChevronRight } from 'lucide-react';
import { QuestionBankItem } from '../types';

interface QuestionPracticeBankProps {
  questions: QuestionBankItem[];
  onPracticeQuestion: (question: QuestionBankItem) => void;
}

export const QuestionPracticeBank: React.FC<QuestionPracticeBankProps> = ({
  questions,
  onPracticeQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Technical', 'Behavioral', 'HR', 'Management'];

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = questions.filter((q) => {
    const matchSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Question Practice Bank</h2>
        <p className="text-xs text-slate-500 mt-1">
          Explore curated interview questions, examine senior model answers, and rehearse live with AI evaluation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by concept, keyword, or tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
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
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isRevealed = revealedAnswers[item.id];
          return (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">Target Role: {item.role}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                    {item.question}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start shrink-0">
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer'}</span>
                  </button>

                  <button
                    onClick={() => onPracticeQuestion(item)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Practice with AI</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Revealed Model Answer */}
              {isRevealed && (
                <div className="mt-3 p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Model Senior-Level Answer:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{item.sampleAnswer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

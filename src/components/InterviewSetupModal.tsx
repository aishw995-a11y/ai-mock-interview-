import React, { useState } from 'react';
import { X, Sparkles, Clock, HelpCircle, Layers, Briefcase, Play, FileText, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface InterviewSetupModalProps {
  isOpen: boolean;
  user: UserProfile;
  presetCategory?: string;
  onClose: () => void;
  onStart: (config: {
    role: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    durationMinutes: number;
    questionCount: number;
    resumeContext?: string;
  }) => void;
}

export const InterviewSetupModal: React.FC<InterviewSetupModalProps> = ({
  isOpen,
  user,
  presetCategory,
  onClose,
  onStart,
}) => {
  const [role, setRole] = useState(user.targetRole || 'Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [category, setCategory] = useState(presetCategory || user.preferredCategory || 'Technical');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [duration, setDuration] = useState<number>(20);
  const [customDuration, setCustomDuration] = useState<number>(15);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [resumeContext, setResumeContext] = useState('');
  const [showResumeInput, setShowResumeInput] = useState(false);

  if (!isOpen) return null;

  const roleList = [
    'Software Developer',
    'Web Developer',
    'Python Developer',
    'Java Developer',
    'Data Analyst',
    'UI/UX Designer',
    'HR Executive',
    'Custom Job Role',
  ];

  const categoryList = [
    'Technical',
    'HR',
    'Behavioral',
    'Coding',
    'Communication',
    'Mixed Interview',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = role === 'Custom Job Role' && customRole.trim() ? customRole.trim() : role;
    const finalDuration = isCustomDuration ? customDuration : duration;

    onStart({
      role: finalRole,
      category,
      difficulty,
      durationMinutes: finalDuration,
      questionCount,
      resumeContext: showResumeInput ? resumeContext : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">Configure AI Mock Interview</h3>
              <p className="text-xs text-slate-500">Customized simulation with live voice analysis and evaluation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Job Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Target Job Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roleList.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-2.5 text-xs rounded-xl font-medium border text-center transition-all ${
                    role === r
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {role === 'Custom Job Role' && (
              <input
                type="text"
                required
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Specify custom title (e.g. Cloud DevOps Engineer, AI Research Scientist)"
                className="mt-3 w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            )}
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Interview Track / Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categoryList.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`p-2.5 text-xs rounded-xl font-medium border text-center transition-all ${
                    category === c
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Questions Count Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-2 text-xs rounded-xl font-medium border text-center transition-all ${
                      difficulty === d
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 5, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 px-2 text-xs rounded-xl font-medium border text-center transition-all ${
                      questionCount === num
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Session Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setDuration(mins);
                    setIsCustomDuration(false);
                  }}
                  className={`py-2 px-2 text-xs rounded-xl font-medium border text-center transition-all ${
                    !isCustomDuration && duration === mins
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {mins} mins
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomDuration(true)}
                className={`py-2 px-2 text-xs rounded-xl font-medium border text-center transition-all ${
                  isCustomDuration
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Custom
              </button>
            </div>
            {isCustomDuration && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Number(e.target.value))}
                  className="w-24 p-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">minutes target time</span>
              </div>
            )}
          </div>

          {/* Optional Resume/Project Context Toggle */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-800">
                  Include Resume or Project Context (Optional)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowResumeInput(!showResumeInput)}
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                {showResumeInput ? 'Remove' : '+ Add Context'}
              </button>
            </div>

            {showResumeInput && (
              <textarea
                rows={3}
                value={resumeContext}
                onChange={(e) => setResumeContext(e.target.value)}
                placeholder="Paste key bullet points from your resume or specific projects you want the AI to interrogate you on..."
                className="mt-3 w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <span>Estimated: ~{questionCount * 3} mins total</span>
              <span className="mx-2">·</span>
              <span>Voice & Text Supported</span>
            </div>
            <button
              type="submit"
              className="py-2.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Mock Interview</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

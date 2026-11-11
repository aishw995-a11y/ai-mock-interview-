import React, { useState } from 'react';
import { Shield, Users, HelpCircle, Plus, Trash2, Sliders, CheckCircle2, BarChart2, Layers, AlertCircle } from 'lucide-react';
import { UserProfile, QuestionBankItem } from '../types';
import { StorageService } from '../utils/storage';

interface AdminDashboardProps {
  currentUser: UserProfile;
  questionBank: QuestionBankItem[];
  onUpdateQuestionBank: (items: QuestionBankItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  questionBank,
  onUpdateQuestionBank,
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'users' | 'config'>('questions');

  // New Question Form state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategory, setNewCategory] = useState('Technical');
  const [newRole, setNewRole] = useState('Software Developer');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newSampleAnswer, setNewSampleAnswer] = useState('');
  const [newTags, setNewTags] = useState('System Design, Core');

  // AI Evaluation Configuration State
  const [evaluationStrictness, setEvaluationStrictness] = useState('Balanced');
  const [technicalWeight, setTechnicalWeight] = useState(30);
  const [communicationWeight, setCommunicationWeight] = useState(25);
  const [relevanceWeight, setRelevanceWeight] = useState(25);
  const [problemSolvingWeight, setProblemSolvingWeight] = useState(20);
  const [configSaved, setConfigSaved] = useState(false);

  // Mock candidates registered
  const candidates = [
    { id: 'u1', name: 'Alex Chen', role: 'Full Stack Developer', score: 86, sessions: 3, status: 'Active' },
    { id: 'u2', name: 'Sarah Jenkins', role: 'Junior Frontend Engineer', score: 82, sessions: 4, status: 'Active' },
    { id: 'u3', name: 'David Lee', role: 'Staff Software Architect', score: 89, sessions: 2, status: 'Active' },
    { id: 'u4', name: 'Priya Sharma', role: 'Data Analyst', score: 88, sessions: 5, status: 'Active' },
    { id: 'u5', name: 'Marcus Vance', role: 'Platform Administrator', score: 94, sessions: 8, status: 'Admin' },
  ];

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newSampleAnswer.trim()) return;

    const created = StorageService.addQuestion({
      question: newQuestionText.trim(),
      category: newCategory,
      role: newRole,
      difficulty: newDifficulty,
      sampleAnswer: newSampleAnswer.trim(),
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    onUpdateQuestionBank([created, ...questionBank]);
    setIsAddingQuestion(false);
    setNewQuestionText('');
    setNewSampleAnswer('');
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question from the platform bank?')) {
      const updated = StorageService.deleteQuestion(id);
      onUpdateQuestionBank(updated);
    }
  };

  const handleSaveConfig = () => {
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  if (!currentUser.isAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
        <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h3 className="font-heading font-bold text-lg text-slate-900">Admin Privileges Required</h3>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          You are currently logged in as a candidate. Please switch to the Marcus Vance (Admin) demo profile via the top profile switcher to manage system questions and platform telemetry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              Administrator Console
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              Role: Master Admin
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage question catalog, candidate benchmarks, and AI evaluation heuristics
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'questions' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Question Bank ({questionBank.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'config' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Evaluation Settings
          </button>
        </div>
      </div>

      {/* Tab 1: Question Bank Management */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Manage Platform Questions ({questionBank.length})
            </h3>
            <button
              onClick={() => setIsAddingQuestion(!isAddingQuestion)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingQuestion ? 'Cancel' : 'Add New Question'}</span>
            </button>
          </div>

          {/* Add Question Form Modal/Box */}
          {isAddingQuestion && (
            <form onSubmit={handleAddQuestion} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
              <h4 className="font-heading font-bold text-sm text-slate-900">Add Question to Global Bank</h4>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. How would you design a distributed rate limiter that operates across multiple geographical regions?"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="HR">HR</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Model Senior Answer (Evaluation Reference)</label>
                <textarea
                  rows={3}
                  required
                  value={newSampleAnswer}
                  onChange={(e) => setNewSampleAnswer(e.target.value)}
                  placeholder="Outline key technical points, trade-offs, and expected candidate depth..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="System Design, Caching, Redis"
                  className="w-full p-2 text-xs border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
                >
                  Save Question
                </button>
              </div>
            </form>
          )}

          {/* Question List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
            {questionBank.map((q) => (
              <div key={q.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                      {q.category}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">{q.role}</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900">{q.question}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">Ref: {q.sampleAnswer}</p>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Candidates Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-heading font-bold text-base text-slate-900">Registered Candidates</h3>
            <p className="text-xs text-slate-500">Overview of candidate activity, performance benchmarks, and status</p>
          </div>

          <div className="divide-y divide-slate-100">
            {candidates.map((cand) => (
              <div key={cand.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{cand.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      cand.status === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {cand.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{cand.role}</p>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase">Interviews</span>
                    <span className="font-mono font-bold text-slate-800">{cand.sessions} completed</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase">Avg Score</span>
                    <span className="font-mono font-bold text-indigo-600 text-sm">{cand.score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: AI Heuristic & Rubric Configuration */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">AI Evaluation Calibration</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tune Gemini 3.8 Flash evaluation weights, strictness criteria, and scoring distributions
            </p>
          </div>

          {configSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AI Evaluation Calibration weights updated successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Evaluation Strictness</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Lenient', 'Balanced', 'Strict FAANG Bar'].map((str) => (
                  <button
                    key={str}
                    type="button"
                    onClick={() => setEvaluationStrictness(str)}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      evaluationStrictness === str
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {str}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Score Weighting Breakdown (Total: 100%)
              </span>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span>Technical Knowledge & Architecture</span>
                  <span className="font-mono">{technicalWeight}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={technicalWeight}
                  onChange={(e) => setTechnicalWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span>Communication & Pacing Clarity</span>
                  <span className="font-mono">{communicationWeight}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={communicationWeight}
                  onChange={(e) => setCommunicationWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span>Relevance & Direct Answer Match</span>
                  <span className="font-mono">{relevanceWeight}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={relevanceWeight}
                  onChange={(e) => setRelevanceWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span>Problem Solving & Logical Flow</span>
                  <span className="font-mono">{problemSolvingWeight}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={problemSolvingWeight}
                  onChange={(e) => setProblemSolvingWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Save Heuristic Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

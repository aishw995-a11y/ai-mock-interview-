import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles, GraduationCap, Briefcase, Target, Code2 } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, user, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState(user.targetRole || 'Full Stack Developer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>(user.experienceLevel || 'Entry Level (0-2 yrs)');
  const [college, setCollege] = useState(user.college || '');
  const [skillsText, setSkillsText] = useState(user.skills.join(', '));
  const [preferredCategory, setPreferredCategory] = useState(user.preferredCategory || 'Technical');
  const [careerGoals, setCareerGoals] = useState(user.careerGoals || '');

  if (!isOpen) return null;

  const roleOptions = [
    'Software Developer',
    'Full Stack Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'Python Developer',
    'Java Developer',
    'Data Analyst',
    'Machine Learning Engineer',
    'UI/UX Designer',
    'Product Manager',
    'HR Executive',
    'Custom',
  ];

  const categoryOptions = [
    'Technical',
    'Coding',
    'Data Structures and Algorithms',
    'Behavioral',
    'HR',
    'Communication Skills',
    'Aptitude Interview',
    'Managerial',
  ];

  const handleFinish = () => {
    const finalRole = targetRole === 'Custom' && customRole.trim() ? customRole.trim() : targetRole;
    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: UserProfile = {
      ...user,
      targetRole: finalRole,
      experienceLevel,
      college: college.trim() || 'University / Independent Study',
      skills: parsedSkills.length > 0 ? parsedSkills : ['Software Engineering', 'Problem Solving', 'Communication'],
      preferredCategory,
      careerGoals: careerGoals.trim() || 'Advance technical interview readiness and land high-caliber offers.',
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Progress Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Personalize Your Interview Coach</h3>
              <p className="text-xs text-slate-500">Step {step} of 3 · Tailoring AI questions to your career trajectory</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-indigo-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Target Job Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {roleOptions.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`p-2.5 text-xs rounded-xl font-medium border text-left transition-all ${
                        targetRole === role
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                {targetRole === 'Custom' && (
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Enter custom role title..."
                    className="mt-3 w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Experience Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(['Student/Fresh Graduate', 'Entry Level (0-2 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (5+ yrs)'] as const).map(
                    (lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setExperienceLevel(lvl)}
                        className={`p-3 text-xs rounded-xl font-medium border text-left transition-all ${
                          experienceLevel === lvl
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  College, Institution, or Current Company
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Stanford University or Self-Taught"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Key Skills & Technologies (Comma-separated)
                </label>
                <div className="relative">
                  <Code2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="React, TypeScript, Node.js, SQL, System Design..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Questions will reference these competencies during technical assessments.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Interview Focus Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPreferredCategory(cat)}
                      className={`p-2 text-xs rounded-xl font-medium border text-center transition-all ${
                        preferredCategory === cat
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Career Goals & Target Companies
                </label>
                <textarea
                  rows={3}
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  placeholder="e.g. Prepare for L4/L5 full-stack engineering loops, strengthen system design confidence, and master behavioral STAR storytelling."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-indigo-600" /> Profile Summary Ready
                </p>
                <p className="text-slate-600">
                  Target: <strong className="text-slate-900">{targetRole === 'Custom' ? customRole : targetRole}</strong> ({experienceLevel})
                </p>
                <p className="text-slate-600">
                  Focus: <strong className="text-slate-900">{preferredCategory}</strong> · AI questions will adapt to your background.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <span>Save & Launch Dashboard</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

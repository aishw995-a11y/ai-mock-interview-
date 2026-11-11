import React, { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, ArrowRight, Play, AlertCircle, Briefcase, Code2 } from 'lucide-react';
import { ApiService } from '../utils/api';
import { InterviewQuestion, UserProfile } from '../types';

interface ResumeInterviewModuleProps {
  user: UserProfile;
  onLaunchInterviewWithQuestions: (questions: InterviewQuestion[], role: string) => void;
}

export const ResumeInterviewModule: React.FC<ResumeInterviewModuleProps> = ({
  user,
  onLaunchInterviewWithQuestions,
}) => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const sampleResume = `Alex Chen - Software Engineer
Experience:
- Frontend Engineer at TechFlow (2024 - Present): Built high-concurrency analytics dashboard in React 19, TypeScript, and Tailwind CSS. Reduced data visualization re-renders by 42% through React compiler memoization and web workers.
- Software Intern at CloudScale (2023 - 2024): Designed REST APIs using Node.js, Express, and PostgreSQL. Implemented Redis caching for hot user endpoints, reducing database read latency by 60ms.
Projects:
- Distributed Event Queue: Developed a high-throughput async message broker with Go and Raft consensus handling 15k messages/sec.
- Real-Time Collaborative Canvas: Created a WebSocket canvas synchronizing drawing states across 50+ concurrent users with operational transformation.
Education: Stanford University, B.S. in Computer Science (2024).`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setFileName(file.name);
    setError(null);

    // Read text from file
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumeText(text || '');
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText || resumeText.trim().length < 20) {
      setError('Please provide your resume content before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await ApiService.analyzeResume(resumeText, user.targetRole);
      setAnalysisResult(res.data);
      setIsAnalyzing(false);
    } catch (err: any) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume. Please check your text.');
      setIsAnalyzing(false);
    }
  };

  const handleStartResumeInterview = () => {
    if (!analysisResult || !analysisResult.tailoredQuestions) return;

    const formattedQuestions: InterviewQuestion[] = analysisResult.tailoredQuestions.map(
      (q: any, i: number) => ({
        id: `rq_${i + 1}`,
        question: q.question,
        category: q.category || 'Technical',
        difficulty: (q.difficulty as any) || 'Intermediate',
        idealAnswerKeyPoints: ['Specific project metrics', 'Design trade-offs', 'STAR framework outcome'],
        expectedTimeSeconds: 150,
        projectTarget: q.projectTarget,
      })
    );

    onLaunchInterviewWithQuestions(formattedQuestions, user.targetRole);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          Resume-Based Deep Dive Interview
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload or paste your resume to extract claimed projects and generate custom technical interrogation questions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input / Upload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Resume Content
            </span>
            <button
              type="button"
              onClick={() => {
                setResumeText(sampleResume);
                setFileName('alex_chen_sample_resume.txt');
              }}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Load Sample Tech Resume
            </button>
          </div>

          {/* File drag/drop box */}
          <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center transition-colors bg-slate-50/50">
            <Upload className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-xs font-semibold text-slate-800">
              {fileName ? fileName : 'Upload Resume (.txt, .md, .pdf text)'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Max file size 5MB · Analyzed privately in your session
            </span>
            <input
              type="file"
              accept=".txt,.md,.json,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Textarea fallback */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Or Paste Text Directly:
            </label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste work experience, projects, technical skills, and achievements..."
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none resize-none text-slate-800"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Extracting Skills & Projects with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume & Generate Project Questions</span>
              </>
            )}
          </button>
        </div>

        {/* Right: AI Extraction & Tailored Questions */}
        <div className="space-y-6">
          {analysisResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Candidate Profile Extracted
                  </h3>
                  <p className="text-xs text-slate-500">
                    {analysisResult.candidateName} · {analysisResult.inferredRole || user.targetRole}
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                  {analysisResult.experienceYears || '2-4 yrs'}
                </span>
              </div>

              {/* Skills identified */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">Identified Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.topSkills?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-lg"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Projects */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">Verified Projects:</span>
                <div className="space-y-2">
                  {analysisResult.extractedProjects?.map((p: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-900 block">{p.name}</span>
                      <span className="text-slate-600">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tailored Questions Preview */}
              <div>
                <span className="text-xs font-semibold text-indigo-900 block mb-2">
                  Generated Project-Deep-Dive Questions:
                </span>
                <div className="space-y-2.5">
                  {analysisResult.tailoredQuestions?.map((q: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-indigo-600 font-bold uppercase">
                          Target: {q.projectTarget || 'Engineering'}
                        </span>
                        <span className="text-[10px] text-slate-400">{q.difficulty}</span>
                      </div>
                      <p className="font-medium text-slate-900">"{q.question}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Resume Interview Action */}
              <button
                onClick={handleStartResumeInterview}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Mock Interview With These Questions</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <FileText className="w-12 h-12 text-slate-400 mb-3" />
              <h4 className="font-heading font-bold text-base text-slate-700">No Resume Analyzed Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Upload your resume or click "Load Sample Tech Resume" on the left, then click analyze to generate project-specific interview rounds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Download,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Brain,
  Share2,
  ArrowRight,
  Printer,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { InterviewSession } from '../types';

interface EvaluationReportModalProps {
  isOpen: boolean;
  session: InterviewSession;
  onClose: () => void;
  onRetake: (session: InterviewSession) => void;
  onPracticeWeakAreas: (topics: string[]) => void;
}

export const EvaluationReportModal: React.FC<EvaluationReportModalProps> = ({
  isOpen,
  session,
  onClose,
  onRetake,
  onPracticeWeakAreas,
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    [session.evaluations[0]?.questionId || '0']: true,
  });

  if (!isOpen) return null;

  const toggleQuestion = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Compute aggregated metric averages
  const evals = session.evaluations || [];
  const count = evals.length || 1;

  const avgMetrics = {
    relevance: Math.round(evals.reduce((sum, e) => sum + (e.metrics?.relevance || 80), 0) / count),
    technical: Math.round(evals.reduce((sum, e) => sum + (e.metrics?.technicalKnowledge || 80), 0) / count),
    communication: Math.round(evals.reduce((sum, e) => sum + (e.metrics?.communication || 80), 0) / count),
    clarity: Math.round(evals.reduce((sum, e) => sum + (e.metrics?.clarity || 80), 0) / count),
    problemSolving: Math.round(evals.reduce((sum, e) => sum + (e.metrics?.problemSolving || 80), 0) / count),
    confidence: Math.round(evals.reduce((sum, e) => sum + (e.metrics?.confidence || 80), 0) / count),
    completeness: Math.round(evals.reduce((sum, e) => sum + (e.metrics?.completeness || 80), 0) / count),
    grammar: Math.round(evals.reduce((sum, e) => sum + (e.metrics?.grammar || 85), 0) / count),
  };

  const radarData = [
    { subject: 'Technical', score: avgMetrics.technical, fullMark: 100 },
    { subject: 'Relevance', score: avgMetrics.relevance, fullMark: 100 },
    { subject: 'Communication', score: avgMetrics.communication, fullMark: 100 },
    { subject: 'Clarity', score: avgMetrics.clarity, fullMark: 100 },
    { subject: 'Problem Solving', score: avgMetrics.problemSolving, fullMark: 100 },
    { subject: 'Completeness', score: avgMetrics.completeness, fullMark: 100 },
  ];

  // Grade classification
  const getRatingTier = (score: number) => {
    if (score >= 90) return { label: 'Exceptional (Senior Ready)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { label: 'Strong Hire Performance', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (score >= 70) return { label: 'Proficient (Minor Polish Needed)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    return { label: 'Needs Structural Practice', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  const tier = getRatingTier(session.overallScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0 print:bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading font-extrabold text-lg text-slate-900">
                Evaluation Dossier: {session.role}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${tier.color}`}>
                {tier.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{session.category}</span>
              <span aria-hidden="true">·</span>
              <span>{session.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>Date: {session.date}</span>
              <span aria-hidden="true">·</span>
              <span>Duration: {session.durationMinutes}m</span>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5 text-xs font-medium transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Body */}
        <div className="p-5 sm:p-8 space-y-8 overflow-y-auto">
          {/* Top Score & Radar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 rounded-2xl border border-slate-200/90">
            {/* Circular Big Score Indicator */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#4F46E5"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - session.overallScore / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-heading font-extrabold text-slate-900 tabular-nums">
                    {session.overallScore}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    out of 100
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-3">
                Overall AI Recruiter Score
              </p>
            </div>

            {/* Radar Chart */}
            <div className="md:col-span-2 h-56 w-full">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 text-center sm:text-left">
                Competence Radar Analysis
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#CBD5E1" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#94A3B8" tick={false} />
                  <Radar
                    name="Candidate Score"
                    dataKey="score"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 8-Dimensional Metric Progress Bars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Performance Breakdown Across 8 Core Evaluation Criteria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              {[
                { label: 'Technical Depth', val: avgMetrics.technical },
                { label: 'Answer Relevance', val: avgMetrics.relevance },
                { label: 'Communication Clarity', val: avgMetrics.communication },
                { label: 'Problem-Solving Structure', val: avgMetrics.problemSolving },
                { label: 'Delivery Clarity', val: avgMetrics.clarity },
                { label: 'Confidence Indicators', val: avgMetrics.confidence },
                { label: 'Completeness of Answer', val: avgMetrics.completeness },
                { label: 'Grammar & Professional Lexicon', val: avgMetrics.grammar },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="font-mono text-slate-900 font-semibold tabular-nums">{item.val}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.val >= 85 ? 'bg-indigo-600' : item.val >= 75 ? 'bg-indigo-400' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Qualitative Feedback: What Went Well & Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What you did well */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="flex items-center gap-2 mb-3 text-emerald-800 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What You Did Well</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {(session.summaryFeedback?.overallStrengths || [
                  'Articulate explanation of architectural choices.',
                  'Clear communication structure adhering to the STAR method.',
                  'Demonstrated solid command of fundamental concepts.',
                ]).map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to improve */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <div className="flex items-center gap-2 mb-3 text-amber-800 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Priority Areas to Improve</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {(session.summaryFeedback?.priorityImprovements || [
                  'Add quantified business metrics (e.g. latency reduced by X%).',
                  'Explicitly mention production failure modes and rollback strategies.',
                  'Clarify alternative algorithms considered before settling on the choice.',
                ]).map((imp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question-Wise Breakdown Accordion */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Question-by-Question Deep Analysis & Model Answers
            </h4>

            <div className="space-y-3">
              {evals.map((ev, index) => {
                const isOpenQ = expandedQuestions[ev.questionId || String(index)];
                return (
                  <div
                    key={ev.questionId || index}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => toggleQuestion(ev.questionId || String(index))}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          Q{index + 1}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                            {ev.question}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Score: <strong className="font-mono text-slate-800">{ev.overallScore}/100</strong>
                          </p>
                        </div>
                      </div>
                      {isOpenQ ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>

                    {isOpenQ && (
                      <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs space-y-4">
                        {/* Candidate transcript */}
                        <div>
                          <p className="font-semibold text-slate-700 mb-1">Your Spoken/Written Answer:</p>
                          <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 italic leading-relaxed">
                            "{ev.candidateAnswer || 'No transcript recorded.'}"
                          </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100">
                            <span className="font-semibold text-emerald-800 block mb-1">Strengths Noted:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                              {ev.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                            </ul>
                          </div>

                          <div className="p-3 bg-amber-50/40 rounded-lg border border-amber-100">
                            <span className="font-semibold text-amber-800 block mb-1">Missing Technical Concepts:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                              {ev.missingConcepts?.map((m, idx) => <li key={idx}>{m}</li>)}
                            </ul>
                          </div>
                        </div>

                        {/* Model Improved Answer */}
                        <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                          <div className="flex items-center gap-1.5 text-indigo-900 font-semibold mb-1.5">
                            <Brain className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Model Answer (Senior Engineer Benchmark):</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed">
                            {ev.improvedAnswer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Recommended Topics & Follow-up */}
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <h5 className="font-heading font-bold text-sm text-indigo-950">
                Recommended Study & Practice Topics
              </h5>
            </div>
            <p className="text-xs text-indigo-800 mb-3">
              Based on your answers, mastering these specific concepts will give you the greatest scoring jump in your next mock round:
            </p>
            <div className="flex flex-wrap gap-2">
              {(session.summaryFeedback?.recommendedTopics || ['Concurrent Rendering', 'EXPLAIN ANALYZE', 'System Caching']).map(
                (topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border border-indigo-200 text-indigo-800 rounded-lg text-xs font-medium shadow-xs"
                  >
                    {topic}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRetake(session)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Retake Interview</span>
            </button>
            <button
              onClick={() => onPracticeWeakAreas(session.summaryFeedback?.recommendedTopics || [])}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Practice Weak Areas</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

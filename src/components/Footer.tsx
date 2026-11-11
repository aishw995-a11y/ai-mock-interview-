import React from 'react';
import { BrainCircuit, Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenSetup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSetup }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-white tracking-tight">
                Interview<span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              Practice Smarter. Perform Better. Get Hired. The commercial AI mock interview platform delivering realistic voice simulation, deep technical evaluation, and personalized career coaching.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:support@interviewai.platform" aria-label="Email Support" className="hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Overview Dashboard
                </button>
              </li>
              <li>
                <button onClick={onOpenSetup} className="hover:text-white transition-colors">
                  Mock Interview Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('coding')} className="hover:text-white transition-colors">
                  Coding Interview Lab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('resume')} className="hover:text-white transition-colors">
                  Resume-Based Prep
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('skills')} className="hover:text-white transition-colors">
                  Skill Development
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('questions')} className="hover:text-white transition-colors">
                  Technical System Design
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('questions')} className="hover:text-white transition-colors">
                  Data Structures & Algorithms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('questions')} className="hover:text-white transition-colors">
                  Behavioral STAR Practice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('questions')} className="hover:text-white transition-colors">
                  HR & Culture Fit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('questions')} className="hover:text-white transition-colors">
                  Question Bank
                </button>
              </li>
            </ul>
          </div>

          {/* Legal and Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Legal & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: All mock interview voice streams and uploaded resumes are stored privately in your browser session and never used to train public models without consent.'); }} className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: InterviewAI provides automated evaluation heuristics and coaching. Feedback is advisory to assist candidate preparation.'); }} className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#rubric" onClick={(e) => { e.preventDefault(); alert('AI Evaluation Rubric: Answers are evaluated purely on technical depth, problem-solving structure, relevance, and clarity. Accent, background appearance, and speaking tempo are not penalized.'); }} className="hover:text-white transition-colors">
                  Fairness & AI Ethics
                </a>
              </li>
              <li>
                <a href="#support" onClick={(e) => { e.preventDefault(); alert('Need assistance? Email support@interviewai.platform or visit our help center.'); }} className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} InterviewAI Inc. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Server-side Gemini AI Verified</span>
            <span aria-hidden="true">·</span>
            <span>WCAG AA Accessible</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Voice Transcription</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

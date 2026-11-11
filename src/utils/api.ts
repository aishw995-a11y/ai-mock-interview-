import { InterviewQuestion, QuestionEvaluation } from '../types';

export const ApiService = {
  async generateQuestions(params: {
    role: string;
    category: string;
    difficulty: string;
    count: number;
    resumeContext?: string;
  }): Promise<{ questions: InterviewQuestion[]; source: string }> {
    try {
      const res = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        questions: data.questions || [],
        source: data.source || 'gemini-ai',
      };
    } catch (err) {
      console.warn('API error generating questions, returning standard questions:', err);
      return {
        questions: [
          {
            id: 'q1',
            question: `Tell me about your background and what motivated you to pursue a career as a ${params.role}.`,
            category: params.category,
            difficulty: params.difficulty as any,
            idealAnswerKeyPoints: ['Clear career story', 'Core technical passions', 'Key project impact'],
            expectedTimeSeconds: 120,
          },
          {
            id: 'q2',
            question: `Walk me through how you solve a complex technical problem when the root cause is unclear.`,
            category: 'Technical',
            difficulty: params.difficulty as any,
            idealAnswerKeyPoints: ['Hypothesis-driven debugging', 'Telemetry & logging', 'Edge case containment'],
            expectedTimeSeconds: 180,
          },
          {
            id: 'q3',
            question: `Describe a time you had to deliver high-priority software under tight deadlines. How did you maintain code quality?`,
            category: 'Behavioral',
            difficulty: params.difficulty as any,
            idealAnswerKeyPoints: ['Scoping essentials', 'Automated test suites', 'Transparent communication'],
            expectedTimeSeconds: 150,
          },
        ],
        source: 'fallback',
      };
    }
  },

  async evaluateAnswer(params: {
    question: string;
    candidateAnswer: string;
    role: string;
    category: string;
    difficulty: string;
  }): Promise<{ evaluation: QuestionEvaluation; source: string }> {
    try {
      const res = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        evaluation: {
          questionId: `eval_${Date.now()}`,
          question: params.question,
          candidateAnswer: params.candidateAnswer,
          ...data.evaluation,
        },
        source: data.source || 'gemini-ai',
      };
    } catch (err) {
      console.warn('API error evaluating answer, using local heuristic:', err);
      const words = params.candidateAnswer.trim().split(/\s+/).length;
      const base = Math.min(88, Math.max(55, Math.round(52 + words * 0.4)));
      return {
        evaluation: {
          questionId: `eval_${Date.now()}`,
          question: params.question,
          candidateAnswer: params.candidateAnswer,
          overallScore: base,
          metrics: {
            relevance: Math.min(95, base + 2),
            technicalKnowledge: Math.min(92, base - 2),
            communication: Math.min(90, base + 3),
            clarity: Math.min(90, base + 1),
            confidence: Math.min(88, base),
            problemSolving: Math.min(86, base - 1),
            grammar: 92,
            completeness: Math.min(90, base - 2),
          },
          strengths: ['Direct response to the question topic', 'Clear communication phrasing'],
          weaknesses: ['Add more concrete metrics and detailed technical trade-offs'],
          missingConcepts: ['Production edge cases', 'Quantified performance outcomes'],
          suggestedImprovement: 'Structure your answer with Situation, Action, and Quantified Result.',
          improvedAnswer: `In my experience as a ${params.role}, I address this systematically by establishing the boundaries, designing modular units, and verifying with load tests.`,
        },
        source: 'smart-heuristic',
      };
    }
  },

  async analyzeResume(resumeText: string, targetRole: string) {
    const res = await fetch('/api/interview/analyze-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, targetRole }),
    });
    if (!res.ok) throw new Error('Resume analysis failed');
    return res.json();
  },

  async evaluateCode(params: {
    problemTitle: string;
    problemDescription: string;
    language: string;
    code: string;
  }) {
    const res = await fetch('/api/interview/evaluate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Code evaluation failed');
    return res.json();
  },
};

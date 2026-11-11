export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: 'Student/Fresh Graduate' | 'Entry Level (0-2 yrs)' | 'Mid-Level (3-5 yrs)' | 'Senior (5+ yrs)';
  college: string;
  skills: string[];
  preferredCategory: string;
  careerGoals: string;
  isAdmin?: boolean;
  avatarUrl?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  idealAnswerKeyPoints: string[];
  expectedTimeSeconds?: number;
  projectTarget?: string;
}

export interface MetricBreakdown {
  relevance: number;
  technicalKnowledge: number;
  communication: number;
  clarity: number;
  confidence: number;
  problemSolving: number;
  grammar: number;
  completeness: number;
}

export interface QuestionEvaluation {
  questionId: string;
  question: string;
  candidateAnswer: string;
  overallScore: number;
  metrics: MetricBreakdown;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  suggestedImprovement: string;
  improvedAnswer: string;
  followUpQuestion?: string;
  answeredAt?: string;
}

export interface InterviewSession {
  id: string;
  title: string;
  role: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  actualDurationSeconds?: number;
  questionCount: number;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  evaluations: QuestionEvaluation[];
  overallScore: number;
  date: string;
  status: 'Completed' | 'In Progress' | 'Abandoned';
  summaryFeedback?: {
    overallStrengths: string[];
    priorityImprovements: string[];
    recommendedTopics: string[];
    suggestedNextDifficulty: string;
  };
  resumeTarget?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    javascript: string;
    python: string;
    typescript: string;
    java: string;
    cpp: string;
  };
  testCases: {
    input: any[];
    expected: any;
    displayInput: string;
    displayExpected: string;
  }[];
}

export interface QuestionBankItem {
  id: string;
  question: string;
  category: string;
  role: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sampleAnswer: string;
  tags: string[];
}

export interface SkillCategoryScore {
  name: string;
  category: string;
  currentScore: number;
  previousScore: number;
  improvementPercentage: number;
  recommendedPractice: string;
  learningSuggestions: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'interview' | 'report' | 'milestone' | 'reminder';
}

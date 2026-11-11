import { UserProfile, InterviewSession, QuestionBankItem, SkillCategoryScore, NotificationItem } from '../types';
import { INITIAL_USER, INITIAL_SESSIONS, INITIAL_QUESTION_BANK, INITIAL_SKILLS, INITIAL_NOTIFICATIONS } from './mockData';

const STORAGE_KEYS = {
  USER: 'interviewai_user_profile',
  SESSIONS: 'interviewai_sessions',
  QUESTIONS: 'interviewai_questions',
  SKILLS: 'interviewai_skills',
  NOTIFICATIONS: 'interviewai_notifications',
  THEME: 'interviewai_theme',
};

export const DEMO_PROFILES: Record<string, UserProfile> = {
  default: INITIAL_USER,
  graduate: {
    id: 'usr_grad',
    name: 'Sarah Jenkins',
    email: 'sarah.j@university.edu',
    targetRole: 'Junior Frontend Engineer',
    experienceLevel: 'Student/Fresh Graduate',
    college: 'UC Berkeley (B.S. EECS)',
    skills: ['JavaScript', 'HTML/CSS', 'React', 'Git', 'Tailwind', 'Algorithms'],
    preferredCategory: 'Technical',
    careerGoals: 'Land first full-time frontend role at an innovative product company.',
    isAdmin: false,
    avatarUrl: '/src/assets/images/candidate_success_1794384773899.jpg',
  },
  senior: {
    id: 'usr_senior',
    name: 'David Lee',
    email: 'david.lee@enterprise.com',
    targetRole: 'Staff Software Architect',
    experienceLevel: 'Senior (5+ yrs)',
    college: 'Carnegie Mellon University',
    skills: ['Distributed Systems', 'Go', 'Kubernetes', 'High Scale Microservices', 'Kafka', 'System Design'],
    preferredCategory: 'Technical',
    careerGoals: 'Advance to Principal Engineer role driving multi-region cloud architecture.',
    isAdmin: false,
    avatarUrl: '/src/assets/images/ai_interviewer_avatar_1794384773089.jpg',
  },
  admin: {
    id: 'usr_admin',
    name: 'Marcus Vance (Admin)',
    email: 'admin@interviewai.platform',
    targetRole: 'Platform Administrator',
    experienceLevel: 'Senior (5+ yrs)',
    college: 'MIT Computer Science',
    skills: ['AI Model Evaluation', 'Talent Benchmarking', 'Curriculum Design', 'Data Analytics'],
    preferredCategory: 'Management',
    careerGoals: 'Oversee AI question bank quality, fairness audits, and candidate evaluations.',
    isAdmin: true,
    avatarUrl: '/src/assets/images/ai_interviewer_avatar_1794384773089.jpg',
  },
};

export const StorageService = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    }
    return INITIAL_USER;
  },

  saveUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  switchProfile(profileKey: keyof typeof DEMO_PROFILES) {
    const profile = DEMO_PROFILES[profileKey] || INITIAL_USER;
    this.saveUser(profile);
    return profile;
  },

  getSessions(): InterviewSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load sessions', e);
    }
    return INITIAL_SESSIONS;
  },

  saveSession(session: InterviewSession) {
    const sessions = this.getSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Also update skill scores
    this.recalculateSkills(session);

    // Add notification
    this.addNotification({
      id: `notif_${Date.now()}`,
      title: 'Interview Completed',
      message: `Completed "${session.title}" with overall score ${session.overallScore}/100.`,
      time: 'Just now',
      read: false,
      type: 'report',
    });

    return sessions;
  },

  getSessionById(id: string): InterviewSession | undefined {
    return this.getSessions().find((s) => s.id === id);
  },

  getQuestionBank(): QuestionBankItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load questions', e);
    }
    return INITIAL_QUESTION_BANK;
  },

  saveQuestionBank(items: QuestionBankItem[]) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(items));
  },

  addQuestion(item: Omit<QuestionBankItem, 'id'>): QuestionBankItem {
    const items = this.getQuestionBank();
    const newItem: QuestionBankItem = {
      ...item,
      id: `qb_${Date.now()}`,
    };
    items.unshift(newItem);
    this.saveQuestionBank(items);
    return newItem;
  },

  deleteQuestion(id: string) {
    const items = this.getQuestionBank().filter((q) => q.id !== id);
    this.saveQuestionBank(items);
    return items;
  },

  getSkills(): SkillCategoryScore[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SKILLS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load skills', e);
    }
    return INITIAL_SKILLS;
  },

  recalculateSkills(latestSession: InterviewSession) {
    const currentSkills = this.getSkills();
    if (!latestSession.evaluations || latestSession.evaluations.length === 0) return;

    // Calculate averages across evaluations
    let totalTech = 0;
    let totalComm = 0;
    let totalProb = 0;
    const count = latestSession.evaluations.length;

    latestSession.evaluations.forEach((e) => {
      totalTech += e.metrics.technicalKnowledge;
      totalComm += e.metrics.communication;
      totalProb += e.metrics.problemSolving;
    });

    const avgTech = Math.round(totalTech / count);
    const avgComm = Math.round(totalComm / count);
    const avgProb = Math.round(totalProb / count);

    const updated = currentSkills.map((sk) => {
      let target = sk.currentScore;
      if (sk.name.includes('Technical') || sk.category === 'Engineering') target = Math.round(sk.currentScore * 0.7 + avgTech * 0.3);
      if (sk.name.includes('Communication') || sk.category === 'Soft Skills') target = Math.round(sk.currentScore * 0.7 + avgComm * 0.3);
      if (sk.name.includes('Problem-Solving') || sk.category === 'Computer Science') target = Math.round(sk.currentScore * 0.7 + avgProb * 0.3);

      const diff = target - sk.previousScore;
      const improvementPercentage = Number(((diff / sk.previousScore) * 100).toFixed(1));

      return {
        ...sk,
        previousScore: sk.currentScore,
        currentScore: target,
        improvementPercentage,
      };
    });

    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
  },

  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  },

  addNotification(item: NotificationItem) {
    const list = this.getNotifications();
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list.slice(0, 20)));
  },

  markNotificationsRead() {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  resetAllData() {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTION_BANK));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(INITIAL_SKILLS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  },
};

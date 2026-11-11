import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Send,
  X,
  Sparkles,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Brain,
  Award,
} from 'lucide-react';
import { InterviewQuestion, QuestionEvaluation, InterviewSession, UserProfile } from '../types';
import { SpeechService } from '../utils/speech';
import { ApiService } from '../utils/api';
import confetti from 'canvas-confetti';

interface MockInterviewInterfaceProps {
  user: UserProfile;
  initialRole: string;
  initialCategory: string;
  initialDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  initialDurationMinutes: number;
  initialQuestionCount: number;
  initialResumeContext?: string;
  preloadedQuestions?: InterviewQuestion[];
  onComplete: (session: InterviewSession) => void;
  onExit: () => void;
}

export const MockInterviewInterface: React.FC<MockInterviewInterfaceProps> = ({
  user,
  initialRole,
  initialCategory,
  initialDifficulty,
  initialDurationMinutes,
  initialQuestionCount,
  initialResumeContext,
  preloadedQuestions,
  onComplete,
  onExit,
}) => {
  // Questions State
  const [questions, setQuestions] = useState<InterviewQuestion[]>(preloadedQuestions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(!preloadedQuestions || preloadedQuestions.length === 0);

  // Candidate Answer State
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Evaluation Accumulator
  const [evaluations, setEvaluations] = useState<QuestionEvaluation[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<QuestionEvaluation | null>(null);

  // Video / Audio toggles
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 1. Fetch / Generate Questions on Mount if not passed
  useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      if (preloadedQuestions && preloadedQuestions.length > 0) {
        setQuestions(preloadedQuestions);
        setIsLoadingQuestions(false);
        return;
      }

      setIsLoadingQuestions(true);
      try {
        const res = await ApiService.generateQuestions({
          role: initialRole,
          category: initialCategory,
          difficulty: initialDifficulty,
          count: initialQuestionCount,
          resumeContext: initialResumeContext,
        });

        if (isMounted) {
          setQuestions(res.questions);
          setIsLoadingQuestions(false);
        }
      } catch (err) {
        console.error('Error fetching questions', err);
        if (isMounted) setIsLoadingQuestions(false);
      }
    }

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize Camera Preview
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      if (!cameraEnabled) {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        return;
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          });
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (e) {
        console.warn('Camera access denied or unavailable in sandbox, showing avatar fallback.', e);
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraEnabled]);

  // 3. Interview Timer
  useEffect(() => {
    if (isPaused || isLoadingQuestions) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isLoadingQuestions]);

  // 4. Trigger AI voice reading question whenever question changes
  useEffect(() => {
    if (!questions.length || isLoadingQuestions) return;
    const currentQ = questions[currentQuestionIndex];
    if (currentQ && aiVoiceEnabled) {
      setIsAiSpeaking(true);
      SpeechService.speak(currentQ.question, () => {
        setIsAiSpeaking(false);
      });
    }
    return () => {
      SpeechService.stopSpeaking();
    };
  }, [currentQuestionIndex, questions, aiVoiceEnabled, isLoadingQuestions]);

  // Handle Speech-to-text recording
  const toggleRecording = () => {
    if (isRecording) {
      SpeechService.stopListening();
      setIsRecording(false);
    } else {
      setSpeechError(null);
      setIsRecording(true);
      SpeechService.startListening(
        (transcript, _isFinal) => {
          setCandidateAnswer((prev) => {
            if (!prev) return transcript;
            return prev.endsWith(' ') ? prev + transcript : prev + ' ' + transcript;
          });
        },
        (error) => {
          setSpeechError(error);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  // Replay Question Audio
  const handleReplayQuestion = () => {
    const currentQ = questions[currentQuestionIndex];
    if (currentQ) {
      setIsAiSpeaking(true);
      SpeechService.speak(currentQ.question, () => {
        setIsAiSpeaking(false);
      });
    }
  };

  // Submit Answer & Evaluate
  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim()) {
      alert('Please provide or speak your response before submitting.');
      return;
    }

    if (isRecording) {
      SpeechService.stopListening();
      setIsRecording(false);
    }

    const currentQ = questions[currentQuestionIndex];
    setIsEvaluating(true);

    try {
      const result = await ApiService.evaluateAnswer({
        question: currentQ.question,
        candidateAnswer,
        role: initialRole,
        category: currentQ.category || initialCategory,
        difficulty: currentQ.difficulty || initialDifficulty,
      });

      const updatedAnswers = {
        ...answers,
        [currentQ.id]: candidateAnswer,
      };
      setAnswers(updatedAnswers);

      const updatedEvaluations = [...evaluations, result.evaluation];
      setEvaluations(updatedEvaluations);
      setLastEvaluation(result.evaluation);
      setIsEvaluating(false);

      // Check if more questions remain
      if (currentQuestionIndex + 1 < questions.length) {
        // Move to next question after brief review
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setCandidateAnswer('');
          setLastEvaluation(null);
        }, 1800);
      } else {
        // Finalize interview session!
        completeInterviewSession(updatedEvaluations, updatedAnswers);
      }
    } catch (e) {
      console.error('Evaluation error', e);
      setIsEvaluating(false);
    }
  };

  const completeInterviewSession = (evals: QuestionEvaluation[], ansMap: Record<string, string>) => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    const totalScore =
      evals.length > 0 ? Math.round(evals.reduce((sum, e) => sum + e.overallScore, 0) / evals.length) : 80;

    const completedSession: InterviewSession = {
      id: `session_${Date.now()}`,
      title: `${initialRole} Mock Assessment`,
      role: initialRole,
      category: initialCategory,
      difficulty: initialDifficulty,
      durationMinutes: initialDurationMinutes,
      actualDurationSeconds: elapsedSeconds,
      questionCount: questions.length,
      questions,
      answers: ansMap,
      evaluations: evals,
      overallScore: totalScore,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      summaryFeedback: {
        overallStrengths: evals.flatMap((e) => e.strengths).slice(0, 3),
        priorityImprovements: evals.flatMap((e) => e.weaknesses).slice(0, 3),
        recommendedTopics: evals.flatMap((e) => e.missingConcepts).slice(0, 4),
        suggestedNextDifficulty: totalScore >= 85 ? 'Advanced' : 'Intermediate',
      },
    };

    onComplete(completedSession);
  };

  const handleEndEarly = () => {
    if (confirm('Are you sure you want to end this interview session early? Completed answers will still be saved.')) {
      if (evaluations.length > 0) {
        completeInterviewSession(evaluations, answers);
      } else {
        onExit();
      }
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestionIndex];

  if (isLoadingQuestions) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mb-6 animate-pulse shadow-lg shadow-indigo-500/30">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-heading font-bold mb-2">Preparing Your AI Interview Room</h3>
        <p className="text-slate-400 text-sm max-w-md text-center mb-6">
          Generating customized questions tailored to {initialRole} ({initialCategory}) with difficulty calibrated to {initialDifficulty}...
        </p>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Synthesizing technical prompts via Gemini AI</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] text-slate-100 flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white leading-tight">
              {initialRole} · <span className="text-indigo-400">{initialCategory}</span>
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{initialDifficulty}</span>
              <span aria-hidden="true">·</span>
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
          </div>
        </div>

        {/* Center Timer */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 font-mono text-xs tabular-nums text-slate-200">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={isPaused ? 'Resume Session' : 'Pause Session'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={handleEndEarly}
            className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-xs font-medium transition-colors"
          >
            End Interview
          </button>
        </div>
      </header>

      {/* Main Video-Call Stage */}
      <div className="flex-1 p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Left Tile: AI Interviewer Video Feed */}
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl">
          {/* Avatar Image Background */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/ai_interviewer_avatar_1794384773089.jpg"
              alt="AI Recruiter"
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          </div>

          {/* AI State Pill Overlay */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
              <span className={`w-2 h-2 rounded-full ${isAiSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`} />
              <span className="font-semibold text-white">Sarah AI (Senior Recruiter)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAiVoiceEnabled(!aiVoiceEnabled)}
                className="p-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-slate-300 hover:text-white border border-slate-700/80 text-xs"
                title={aiVoiceEnabled ? 'Mute AI Voice' : 'Unmute AI Voice'}
              >
                {aiVoiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              <button
                onClick={handleReplayQuestion}
                className="p-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-slate-300 hover:text-white border border-slate-700/80 text-xs flex items-center gap-1"
                title="Replay Question Audio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Audio Wave Visualizer while AI is speaking */}
          {isAiSpeaking && (
            <div className="relative z-10 mx-auto mb-2 flex items-center gap-1 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-full border border-emerald-500/40">
              <span className="text-[11px] text-emerald-400 font-medium">Speaking...</span>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2 delay-75" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3.5 delay-150" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2.5 delay-100" />
              </div>
            </div>
          )}

          {/* Current Question Bubble at Bottom */}
          <div className="relative z-10 p-4 sm:p-5 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-indigo-400 mb-1 font-semibold">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-slate-400 text-[11px]">{currentQ?.category || initialCategory}</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
              "{currentQ?.question}"
            </p>
          </div>
        </div>

        {/* Right Tile: Candidate Video Feed & Answer Controls */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl">
          {/* Candidate Camera Preview Header */}
          <div className="relative flex-1 bg-slate-950 min-h-[220px] max-h-[300px] overflow-hidden flex items-center justify-center">
            {cameraEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xl mb-2">
                  {user.name.charAt(0)}
                </div>
                <p className="text-xs text-slate-400">Camera Paused</p>
              </div>
            )}

            {/* Candidate Name Banner Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="font-medium text-white">{user.name} (Candidate)</span>
            </div>

            {/* Live Recording Pulsing Indicator */}
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500/90 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold animate-pulse shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>Transcribing Voice...</span>
              </div>
            )}

            {/* Camera / Mic hardware toggles */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  cameraEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-400'
                }`}
                title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
              >
                {isRecording ? <Mic className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Candidate Live Transcription & Text Input Area */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  Your Answer (Spoken or Typed)
                </span>
                <span className="text-[11px] text-slate-500">
                  {candidateAnswer ? `${candidateAnswer.trim().split(/\s+/).length} words` : 'Speak into mic or type'}
                </span>
              </div>

              {speechError && (
                <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{speechError}</span>
                </div>
              )}

              <textarea
                rows={4}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Click the microphone button to dictate your answer or type directly here. Structure your answer using the STAR method (Situation, Task, Action, Result)..."
                className="w-full p-3 text-xs sm:text-sm bg-slate-950/80 text-white placeholder-slate-500 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Intermediate Evaluation Feedback Banner if just submitted */}
            {lastEvaluation && (
              <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-200 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Answer Evaluated! Score: <strong className="text-white font-mono">{lastEvaluation.overallScore}/100</strong>. Advancing...
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Submit Row */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                  isRecording
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Listening (Click to Stop)' : 'Dictate with Voice'}</span>
              </button>

              <button
                type="button"
                disabled={isEvaluating || !candidateAnswer.trim()}
                onClick={handleSubmitAnswer}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-500/25 transition-all"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating Answer...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentQuestionIndex + 1 === questions.length ? 'Submit & Finalize' : 'Submit Answer'}
                    </span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

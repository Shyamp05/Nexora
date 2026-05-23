import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { sampleQuizQuestions, leaderboard } from '@/data/mockData';
import {
  BrainCircuit, Code, Calculator, Atom, FlaskConical, Heart, BookOpen,
  Timer, X, CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw,
  Zap, Crown, Medal, Star, ChevronRight
} from 'lucide-react';
import type { QuizQuestion } from '@/types';

type QuizState = 'browse' | 'active' | 'results';

const subjects = [
  { name: 'Computer Science', icon: Code, color: 'from-blue-500 to-cyan-500', questions: 120, avg: 85 },
  { name: 'Mathematics', icon: Calculator, color: 'from-purple-500 to-pink-500', questions: 95, avg: 72 },
  { name: 'Physics', icon: Atom, color: 'from-cyan-500 to-teal-500', questions: 80, avg: 68 },
  { name: 'Chemistry', icon: FlaskConical, color: 'from-emerald-500 to-green-500', questions: 75, avg: 70 },
  { name: 'Biology', icon: Heart, color: 'from-rose-500 to-red-500', questions: 60, avg: 78 },
  { name: 'English', icon: BookOpen, color: 'from-amber-500 to-orange-500', questions: 50, avg: 88 },
];

export default function QuizPage() {
  const [state, setState] = useState<QuizState>('browse');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const questions: QuizQuestion[] = sampleQuizQuestions;
  const currentQ = questions[currentQuestion];

  // Timer
  useEffect(() => {
    if (state !== 'active' || showFeedback) return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
      setTotalTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [state, timeLeft, showFeedback]);

  const handleAnswer = useCallback((answerIdx: number) => {
    setSelectedAnswer(answerIdx);
    setShowFeedback(true);
    if (answerIdx === currentQ.correct_answer) {
      setScore((s) => s + 1);
    }
    setAnswers((a) => [...a, answerIdx]);
  }, [currentQ]);

  const nextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      setState('results');
    } else {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(30);
    }
  };

  const startQuiz = () => {
    setState('active');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers([]);
    setScore(0);
    setTimeLeft(30);
    setTotalTime(0);
  };

  const resetQuiz = () => {
    setState('browse');
    setShowLeaderboard(false);
  };

  const xpEarned = score * 40 + (score === questions.length ? 100 : 0);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ===== BROWSE STATE ===== */}
          {state === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <BrainCircuit className="w-8 h-8 text-indigo-400" />
                  AI-Powered Quizzes
                </h1>
                <p className="text-gray-400 mt-1">Test your knowledge with adaptive quizzes</p>
              </div>

              {/* Difficulty Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 mr-2">Difficulty:</span>
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      difficulty === d
                        ? 'gradient-primary text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>

              {/* Subject Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject, i) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    onClick={startQuiz}
                    className="card-premium rounded-2xl p-5 cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                      <subject.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{subject.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{subject.questions} questions</span>
                      <span>Avg: {subject.avg}%</span>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Quiz <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Leaderboard Preview */}
              <div className="card-premium rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" /> Leaderboard
                  </h3>
                  <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {showLeaderboard ? 'Show Less' : 'View All'}
                  </button>
                </div>
                
                {/* Top 3 */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {leaderboard.slice(0, 3).map((entry, i) => {
                    const medals = [<Crown key="g" className="w-5 h-5 text-yellow-400" />, <Medal key="s" className="w-5 h-5 text-gray-300" />, <Medal key="b" className="w-5 h-5 text-amber-600" />];
                    return (
                      <div key={entry.user_id} className={`rounded-xl p-4 text-center ${i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'}`}>
                        {medals[i]}
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center mx-auto mt-2 text-sm font-bold text-white">
                          {entry.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-sm font-medium text-white mt-2 truncate">{entry.full_name}</p>
                        <p className="text-xs text-indigo-400">{entry.xp.toLocaleString()} XP</p>
                      </div>
                    );
                  })}
                </div>

                {/* Rest of leaderboard */}
                <AnimatePresence>
                  {showLeaderboard && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {leaderboard.slice(3).map((entry) => (
                        <div
                          key={entry.user_id}
                          className={`flex items-center gap-3 p-3 rounded-xl ${entry.user_id === '1' ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-white/5'}`}
                        >
                          <span className="text-sm font-bold text-gray-500 w-6">#{entry.rank}</span>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                            {entry.full_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{entry.full_name}</p>
                          </div>
                          <span className="text-sm text-indigo-400">{entry.xp.toLocaleString()} XP</span>
                          <div className="flex items-center gap-1 text-xs text-orange-400">
                            <Zap className="w-3 h-3" />{entry.streak}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ===== ACTIVE QUIZ STATE ===== */}
          {state === 'active' && currentQ && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Question <span className="text-white font-bold">{currentQuestion + 1}</span>/{questions.length}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="w-4 h-4 text-gray-400" />
                    <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
                  </div>
                  <button onClick={resetQuiz} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>

              {/* Timer Bar */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(timeLeft / 30) * 100}%` }}
                  className={`h-full rounded-full ${timeLeft <= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                />
              </div>

              {/* Question Card */}
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-premium rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-lg md:text-xl font-semibold text-white mb-6">
                  {currentQ.question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === currentQ.correct_answer;
                    const showCorrect = showFeedback && isCorrect;
                    const showWrong = showFeedback && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={idx}
                        whileHover={!showFeedback ? { scale: 1.01 } : {}}
                        whileTap={!showFeedback ? { scale: 0.99 } : {}}
                        onClick={() => !showFeedback && handleAnswer(idx)}
                        disabled={showFeedback}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                          showCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : showWrong
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : isSelected
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                            : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          showCorrect ? 'bg-emerald-500/20' : showWrong ? 'bg-red-500/20' : 'bg-white/10'
                        }`}>
                          {showCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                           showWrong ? <XCircle className="w-4 h-4" /> :
                           String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 space-y-4"
                    >
                      {/* XP animation */}
                      {selectedAnswer === currentQ.correct_answer && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="flex items-center justify-center gap-2 text-emerald-400 font-bold"
                        >
                          <Zap className="w-5 h-5" /> +40 XP
                        </motion.div>
                      )}
                      
                      <div className="p-4 rounded-xl bg-white/5 text-sm text-gray-300">
                        <p className="font-medium text-white mb-1">Explanation:</p>
                        {currentQ.explanation}
                      </div>

                      <button
                        onClick={nextQuestion}
                        className="w-full py-3 rounded-xl gradient-primary text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-shadow"
                      >
                        {currentQuestion + 1 >= questions.length ? 'View Results' : 'Next Question'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* ===== RESULTS STATE ===== */}
          {state === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Score Card */}
              <div className="card-premium rounded-2xl p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center relative"
                >
                  <svg className="w-32 h-32 absolute" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <motion.circle
                      cx="64" cy="64" r="58" fill="none"
                      stroke="url(#scoreGrad)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${percentage * 3.64} 364`}
                      transform="rotate(-90 64 64)"
                      initial={{ strokeDasharray: '0 364' }}
                      animate={{ strokeDasharray: `${percentage * 3.64} 364` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center relative z-10">
                    <span className="text-3xl font-bold text-white">{score}/{questions.length}</span>
                    <p className="text-xs text-gray-400">{percentage}%</p>
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👍 Good Job!' : '📚 Keep Practicing!'}
                </h2>
                <p className="text-gray-400 mb-4">You answered {score} out of {questions.length} correctly</p>

                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="text-white font-bold">+{xpEarned} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-300">{Math.floor(totalTime / 60)}m {totalTime % 60}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">{percentage}% accuracy</span>
                  </div>
                </div>
              </div>

              {/* Answer Review */}
              <div className="card-premium rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Answer Review</h3>
                <div className="space-y-3">
                  {questions.map((q, i) => {
                    const userAns = answers[i];
                    const isCorrect = userAns === q.correct_answer;
                    return (
                      <div key={q.id} className={`p-4 rounded-xl ${isCorrect ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-red-500/5 border border-red-500/10'}`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">{q.question}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Your answer: <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>{userAns !== null && userAns >= 0 ? q.options[userAns] : 'No answer'}</span>
                              {!isCorrect && <> · Correct: <span className="text-emerald-400">{q.options[q.correct_answer]}</span></>}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button onClick={startQuiz} className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
                <button onClick={resetQuiz} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition">
                  Back to Quizzes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

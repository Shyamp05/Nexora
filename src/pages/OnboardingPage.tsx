import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  School,
  Award,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Rocket,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

// Step configuration types
interface StudentTypeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface SubjectOption {
  id: string;
  label: string;
  emoji: string;
}

interface StudyGoalOption {
  minutes: number;
  label: string;
}

interface LanguageOption {
  id: string;
  label: string;
  native: string;
  flag: string;
}

const studentTypes: StudentTypeOption[] = [
  { id: 'school', label: 'School Student', description: 'Grades 6–12', icon: <School className="w-6 h-6" /> },
  { id: 'college', label: 'College Student', description: 'Undergraduate / Postgrad', icon: <GraduationCap className="w-6 h-6" /> },
  { id: 'competitive', label: 'Competitive Exam', description: 'JEE, NEET, GATE, CAT', icon: <Award className="w-6 h-6" /> },
  { id: 'self-learner', label: 'Self-Learner', description: 'Learning for fun or career', icon: <BookOpen className="w-6 h-6" /> },
];

const subjects: SubjectOption[] = [
  { id: 'Mathematics', label: 'Mathematics', emoji: '📐' },
  { id: 'Physics', label: 'Physics', emoji: '⚛️' },
  { id: 'Computer Science', label: 'Computer Science', emoji: '💻' },
  { id: 'Chemistry', label: 'Chemistry', emoji: '🧪' },
  { id: 'Biology', label: 'Biology', emoji: '🧬' },
  { id: 'English', label: 'English', emoji: '📖' },
  { id: 'History', label: 'History', emoji: '🏛️' },
  { id: 'Economics', label: 'Economics', emoji: '📊' },
];

const studyGoals: StudyGoalOption[] = [
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1 hour' },
  { minutes: 120, label: '2 hours' },
  { minutes: 180, label: '3 hours' },
];

const languages: LanguageOption[] = [
  { id: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
];

const TOTAL_STEPS = 4;

// Slide animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [studentType, setStudentType] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [studyGoal, setStudyGoal] = useState(60);
  const [language, setLanguage] = useState('en');

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((s) => s !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleComplete = () => {
    completeOnboarding({
      student_type: studentType,
      subjects: selectedSubjects,
      study_goal_minutes: studyGoal,
      preferred_language: language,
    });
    navigate('/dashboard');
  };

  // Validation per step
  const isStepValid = () => {
    switch (currentStep) {
      case 0: return studentType !== '';
      case 1: return selectedSubjects.length > 0;
      case 2: return studyGoal > 0;
      case 3: return language !== '';
      default: return false;
    }
  };

  const stepTitles = [
    'I am a...',
    'Select Your Subjects',
    'Daily Study Goal',
    'Preferred Language',
  ];

  const stepDescriptions = [
    'Tell us about yourself so we can personalize your experience.',
    'Choose the subjects you want to learn. You can change these later.',
    'How much time can you dedicate to studying each day?',
    'Choose your preferred language for the learning experience.',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center gradient-mesh bg-[#06060b] px-4 py-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-4"
      >
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Nexora AI</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                  i <= currentStep
                    ? 'gradient-primary text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}
              >
                {i + 1}
              </div>
              {i < TOTAL_STEPS - 1 && (
                <div className="hidden sm:block w-16 md:w-24 h-0.5 mx-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      i < currentStep ? 'gradient-primary' : 'bg-white/10'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Card */}
      <div className="w-full max-w-lg flex-1 flex flex-col">
        <div className="glass-strong rounded-2xl p-6 md:p-8 glow-blue flex-1 flex flex-col min-h-[420px]">
          {/* Step Title */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`title-${currentStep}`}
              custom={direction}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl font-bold text-white mb-2">{stepTitles[currentStep]}</h2>
              <p className="text-gray-400 text-sm">{stepDescriptions[currentStep]}</p>
            </motion.div>
          </AnimatePresence>

          {/* Step Content */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {/* Step 1: Student Type */}
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {studentTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStudentType(type.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        studentType === type.id
                          ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                          studentType === type.id
                            ? 'gradient-primary text-white'
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {type.icon}
                      </div>
                      <p className="font-semibold text-white text-sm">{type.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{type.description}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Step 2: Subjects */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex flex-wrap gap-3 justify-center"
                >
                  {subjects.map((subject) => {
                    const isSelected = selectedSubjects.includes(subject.id);
                    return (
                      <motion.button
                        key={subject.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSubjectToggle(subject.id)}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/8'
                        }`}
                      >
                        <span>{subject.emoji}</span>
                        <span>{subject.label}</span>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"
                          >
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.span>
                        )}
                      </motion.button>
                    );
                  })}
                  <p className="w-full text-center text-gray-500 text-xs mt-2">
                    {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                  </p>
                </motion.div>
              )}

              {/* Step 3: Study Goal */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {studyGoals.map((goal) => (
                      <motion.button
                        key={goal.minutes}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStudyGoal(goal.minutes)}
                        className={`p-5 rounded-xl border text-center transition-all duration-300 ${
                          studyGoal === goal.minutes
                            ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
                        }`}
                      >
                        <p className={`text-2xl font-bold mb-1 ${
                          studyGoal === goal.minutes ? 'text-white' : 'text-gray-300'
                        }`}>
                          {goal.label}
                        </p>
                        <p className="text-gray-500 text-xs">per day</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Visual indicator */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                      <span className="text-lg">⏱️</span>
                      <span className="text-gray-300 text-sm">
                        {studyGoal >= 60
                          ? `${Math.floor(studyGoal / 60)} hour${studyGoal >= 120 ? 's' : ''}`
                          : `${studyGoal} minutes`}{' '}
                        daily
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Language */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="space-y-3"
                >
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLanguage(lang.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-4 ${
                        language === lang.id
                          ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
                      }`}
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <div>
                        <p className="font-semibold text-white">{lang.label}</p>
                        <p className="text-gray-500 text-sm">{lang.native}</p>
                      </div>
                      {language === lang.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-6 h-6 rounded-full gradient-primary flex items-center justify-center"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'btn-secondary'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < TOTAL_STEPS - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!isStepValid()}
                className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                disabled={!isStepValid()}
                className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Rocket className="w-4 h-4" />
                Start Learning
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

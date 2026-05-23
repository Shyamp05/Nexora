import type { WeeklyAnalytics, SubjectPerformance, Achievement, DailyMission, LeaderboardEntry, QuizQuestion } from '../types';

// ============================================
// MOCK DATA FOR DEMO
// ============================================

export const weeklyAnalytics: WeeklyAnalytics[] = [
  { day: 'Mon', hours: 2.5, quizzes: 3, xp: 450 },
  { day: 'Tue', hours: 3.2, quizzes: 5, xp: 680 },
  { day: 'Wed', hours: 1.8, quizzes: 2, xp: 320 },
  { day: 'Thu', hours: 4.1, quizzes: 7, xp: 920 },
  { day: 'Fri', hours: 2.9, quizzes: 4, xp: 550 },
  { day: 'Sat', hours: 5.0, quizzes: 8, xp: 1100 },
  { day: 'Sun', hours: 3.5, quizzes: 6, xp: 780 },
];

export const monthlyStudyData = [
  { week: 'W1', hours: 15, target: 14 },
  { week: 'W2', hours: 18, target: 14 },
  { week: 'W3', hours: 12, target: 14 },
  { week: 'W4', hours: 20, target: 14 },
];

export const subjectPerformance: SubjectPerformance[] = [
  { subject: 'Mathematics', score: 85, quizzes_taken: 24, study_hours: 45 },
  { subject: 'Physics', score: 72, quizzes_taken: 18, study_hours: 32 },
  { subject: 'Computer Science', score: 92, quizzes_taken: 30, study_hours: 55 },
  { subject: 'Chemistry', score: 68, quizzes_taken: 15, study_hours: 28 },
  { subject: 'English', score: 88, quizzes_taken: 12, study_hours: 20 },
];

export const achievements: Achievement[] = [
  { id: '1', badge_id: 'first_quiz', title: 'Quiz Beginner', description: 'Complete your first quiz', icon: '🎯', unlocked: true, unlocked_at: '2025-01-20T10:00:00Z', xp_reward: 50, category: 'quiz' },
  { id: '2', badge_id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: true, unlocked_at: '2025-02-01T10:00:00Z', xp_reward: 200, category: 'streak' },
  { id: '3', badge_id: 'streak_30', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '⚡', unlocked: false, xp_reward: 500, category: 'streak' },
  { id: '4', badge_id: 'study_100h', title: 'Century Scholar', description: 'Study for 100 hours', icon: '📚', unlocked: true, unlocked_at: '2025-03-01T10:00:00Z', xp_reward: 300, category: 'study' },
  { id: '5', badge_id: 'quiz_master', title: 'Quiz Master', description: 'Score 100% in 10 quizzes', icon: '👑', unlocked: false, xp_reward: 400, category: 'quiz' },
  { id: '6', badge_id: 'night_owl', title: 'Night Owl', description: 'Study past midnight 5 times', icon: '🦉', unlocked: true, unlocked_at: '2025-02-15T10:00:00Z', xp_reward: 100, category: 'special' },
  { id: '7', badge_id: 'social_butterfly', title: 'Social Butterfly', description: 'Join 5 study rooms', icon: '🦋', unlocked: false, xp_reward: 150, category: 'social' },
  { id: '8', badge_id: 'ai_explorer', title: 'AI Explorer', description: 'Have 50 AI conversations', icon: '🤖', unlocked: true, unlocked_at: '2025-03-10T10:00:00Z', xp_reward: 250, category: 'special' },
  { id: '9', badge_id: 'speed_demon', title: 'Speed Demon', description: 'Complete a quiz in under 60 seconds', icon: '⚡', unlocked: false, xp_reward: 200, category: 'quiz' },
  { id: '10', badge_id: 'perfectionist', title: 'Perfectionist', description: 'Get a perfect score 3 times in a row', icon: '💎', unlocked: false, xp_reward: 350, category: 'quiz' },
  { id: '11', badge_id: 'doc_wizard', title: 'Document Wizard', description: 'Upload and analyze 20 documents', icon: '📄', unlocked: true, unlocked_at: '2025-02-28T10:00:00Z', xp_reward: 200, category: 'study' },
  { id: '12', badge_id: 'roadmap_creator', title: 'Pathfinder', description: 'Create 5 learning roadmaps', icon: '🗺️', unlocked: false, xp_reward: 150, category: 'study' },
];

export const dailyMissions: DailyMission[] = [
  { id: '1', title: 'Complete 3 Quizzes', description: 'Take any 3 quizzes today', target: 3, progress: 2, xp_reward: 150, completed: false, type: 'quiz' },
  { id: '2', title: 'Study for 1 Hour', description: 'Spend at least 60 minutes studying', target: 60, progress: 45, xp_reward: 100, completed: false, type: 'study' },
  { id: '3', title: 'Ask AI 5 Questions', description: 'Have 5 conversations with AI Tutor', target: 5, progress: 5, xp_reward: 75, completed: true, type: 'chat' },
  { id: '4', title: 'Upload a Document', description: 'Upload and analyze a study document', target: 1, progress: 0, xp_reward: 50, completed: false, type: 'upload' },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user_id: '10', full_name: 'Arjun Mehta', avatar_url: null, xp: 12500, level: 25, streak: 45 },
  { rank: 2, user_id: '11', full_name: 'Priya Sharma', avatar_url: null, xp: 11200, level: 23, streak: 38 },
  { rank: 3, user_id: '12', full_name: 'Rahul Singh', avatar_url: null, xp: 10800, level: 22, streak: 32 },
  { rank: 4, user_id: '1', full_name: 'Shyam Patel', avatar_url: null, xp: 4850, level: 12, streak: 15 },
  { rank: 5, user_id: '13', full_name: 'Ananya Gupta', avatar_url: null, xp: 9500, level: 20, streak: 28 },
  { rank: 6, user_id: '14', full_name: 'Vikram Reddy', avatar_url: null, xp: 8900, level: 19, streak: 25 },
  { rank: 7, user_id: '15', full_name: 'Sneha Iyer', avatar_url: null, xp: 8200, level: 18, streak: 22 },
  { rank: 8, user_id: '16', full_name: 'Karan Joshi', avatar_url: null, xp: 7600, level: 17, streak: 20 },
  { rank: 9, user_id: '17', full_name: 'Neha Verma', avatar_url: null, xp: 7100, level: 16, streak: 18 },
  { rank: 10, user_id: '18', full_name: 'Aditya Kumar', avatar_url: null, xp: 6800, level: 15, streak: 15 },
];

export const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the time complexity of Binary Search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correct_answer: 1,
    explanation: 'Binary Search divides the search space in half at each step, resulting in O(log n) time complexity.',
  },
  {
    id: '2',
    question: 'Which data structure uses LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correct_answer: 1,
    explanation: 'A Stack follows LIFO — the last element pushed is the first to be popped.',
  },
  {
    id: '3',
    question: 'What is the derivative of sin(x)?',
    options: ['-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)'],
    correct_answer: 1,
    explanation: 'The derivative of sin(x) is cos(x). This is a fundamental calculus identity.',
  },
  {
    id: '4',
    question: 'Which of the following is NOT a valid HTTP method?',
    options: ['GET', 'POST', 'FETCH', 'DELETE'],
    correct_answer: 2,
    explanation: 'FETCH is not an HTTP method. The valid HTTP methods include GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, etc.',
  },
  {
    id: '5',
    question: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Language'],
    correct_answer: 0,
    explanation: 'SQL stands for Structured Query Language, used for managing and querying relational databases.',
  },
];

export const heatmapData = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(2025, 0, i + 1).toISOString().split('T')[0],
  value: Math.floor(Math.random() * 5),
}));

export const recentActivity = [
  { id: '1', type: 'quiz', title: 'Completed DSA Quiz', subject: 'Computer Science', xp: 120, time: '2 hours ago' },
  { id: '2', type: 'chat', title: 'AI Tutor: Binary Trees', subject: 'Computer Science', xp: 30, time: '3 hours ago' },
  { id: '3', type: 'study', title: 'Studied Thermodynamics', subject: 'Physics', xp: 80, time: '5 hours ago' },
  { id: '4', type: 'document', title: 'Uploaded Lecture Notes', subject: 'Mathematics', xp: 50, time: 'Yesterday' },
  { id: '5', type: 'quiz', title: 'Organic Chemistry Quiz', subject: 'Chemistry', xp: 95, time: 'Yesterday' },
  { id: '6', type: 'roadmap', title: 'Created DBMS Roadmap', subject: 'Computer Science', xp: 40, time: '2 days ago' },
];

export const motivationalQuotes = [
  "The expert in anything was once a beginner.",
  "Education is the passport to the future.",
  "The beautiful thing about learning is that nobody can take it away from you.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The more that you read, the more things you will know.",
  "Learning never exhausts the mind.",
  "The only way to do great work is to love what you learn.",
];

export const features = [
  {
    title: 'AI Tutor',
    description: 'Get instant, personalized explanations on any topic with our ChatGPT-powered AI tutor.',
    icon: 'Bot',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Smart Quizzes',
    description: 'AI-generated quizzes that adapt to your level with instant feedback and detailed explanations.',
    icon: 'BrainCircuit',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Document AI',
    description: 'Upload PDFs, notes, or images. Get AI-generated summaries, flashcards, and key insights.',
    icon: 'FileSearch',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Learning Roadmaps',
    description: 'Generate personalized day-by-day study plans for any topic in any timeframe.',
    icon: 'Map',
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Study Analytics',
    description: 'Track your progress with beautiful charts, heatmaps, and AI-powered insights.',
    icon: 'BarChart3',
    color: 'from-rose-500 to-red-500',
  },
  {
    title: 'Gamification',
    description: 'Earn XP, unlock achievements, compete on leaderboards, and maintain study streaks.',
    icon: 'Trophy',
    color: 'from-yellow-500 to-orange-500',
  },
];

export const testimonials = [
  {
    name: 'Riya Patel',
    role: 'Engineering Student',
    college: 'IIT Bombay',
    quote: 'Nexora AI completely transformed my study routine. The AI tutor explains complex topics better than most textbooks!',
    rating: 5,
    avatar: 'RP',
  },
  {
    name: 'Arjun Kumar',
    role: 'NEET Aspirant',
    college: 'Allen Kota',
    quote: 'The personalized roadmaps and adaptive quizzes helped me improve my score by 40%. This is the future of learning.',
    rating: 5,
    avatar: 'AK',
  },
  {
    name: 'Sneha Reddy',
    role: 'Computer Science Student',
    college: 'BITS Pilani',
    quote: 'Document AI saves me hours of note-taking. I just upload my lecture slides and get perfect summaries instantly.',
    rating: 5,
    avatar: 'SR',
  },
  {
    name: 'Vikram Singh',
    role: 'Gate Aspirant',
    college: 'Self-learner',
    quote: 'The gamification keeps me motivated daily. I have a 45-day streak and have climbed to the top 10 leaderboard!',
    rating: 5,
    avatar: 'VS',
  },
];

export const faqItems = [
  {
    question: 'What is Nexora AI?',
    answer: 'Nexora AI is an all-in-one AI-powered learning platform designed for school students, college students, competitive exam aspirants, and self-learners. It combines an AI tutor, smart quizzes, document analysis, personalized roadmaps, and gamification into one seamless experience.',
  },
  {
    question: 'Is Nexora AI free to use?',
    answer: 'Yes! Nexora AI offers a generous free tier with access to the AI tutor, basic quizzes, and document uploads. Premium features like unlimited AI conversations, advanced analytics, and collaboration tools are available with our Pro plan.',
  },
  {
    question: 'How does the AI Tutor work?',
    answer: 'Our AI Tutor uses advanced language models to provide personalized explanations, step-by-step solutions, code examples, and visual breakdowns. You can choose from different modes (Beginner, School, College, Interview) to get responses tailored to your level.',
  },
  {
    question: 'Can I use Nexora AI for competitive exam preparation?',
    answer: 'Absolutely! Nexora AI is specifically designed for competitive exam aspirants. Features like adaptive quizzes, timed tests, topic-wise analytics, and AI-generated practice questions make it perfect for JEE, NEET, GATE, CAT, and other competitive exams.',
  },
  {
    question: 'What file formats does Document AI support?',
    answer: 'Document AI currently supports PDFs, PowerPoint presentations (PPT/PPTX), images (JPG, PNG), and plain text files. Upload your study materials and get AI-generated summaries, flashcards, key points, and mind maps instantly.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security seriously. All data is encrypted in transit and at rest using industry-standard encryption. We use Supabase for secure authentication and data storage, and we never share your personal data with third parties.',
  },
];

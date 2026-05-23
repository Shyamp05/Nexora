import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AITutorPage = lazy(() => import('./pages/AITutorPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const DocumentAIPage = lazy(() => import('./pages/DocumentAIPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const GamificationPage = lazy(() => import('./pages/GamificationPage'));
const ProductivityPage = lazy(() => import('./pages/ProductivityPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* App Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai-tutor" element={<AITutorPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/documents" element={<DocumentAIPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;

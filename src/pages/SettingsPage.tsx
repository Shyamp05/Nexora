import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Settings, User, Globe, Bell, Accessibility, Shield, LogOut,
  Eye, Volume2, Type, Sun, Save, Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(user?.preferred_language || 'en');
  const [studyGoal, setStudyGoal] = useState((user?.study_goal_minutes || 120) / 60);
  const [notifications, setNotifications] = useState(true);
  const [tts, setTts] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      full_name: name,
      email,
      preferred_language: language as 'en' | 'hi' | 'gu',
      study_goal_minutes: studyGoal * 60,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-indigo-500' : 'bg-white/10'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-gray-400" />
            Settings
          </h1>
          <p className="text-gray-400 mt-1">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-indigo-400" /> Profile
          </h3>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-cyan-400" /> Preferences
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Language</label>
            <div className="flex gap-3">
              {([
                { code: 'en', label: 'English', flag: '🇬🇧' },
                { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
                { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
              ] as const).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    language === lang.code
                      ? 'gradient-primary text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <span>{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Daily Study Goal</label>
              <div className="flex gap-3">
                {[0.5, 1, 2, 3].map((h) => (
                  <button
                    key={h}
                    onClick={() => setStudyGoal(h)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      studyGoal === h
                        ? 'gradient-primary text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-white">Notifications</p>
                  <p className="text-xs text-gray-500">Study reminders and achievements</p>
                </div>
              </div>
              <Toggle checked={notifications} onChange={setNotifications} />
            </div>
          </div>
        </motion.div>

        {/* Accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <Accessibility className="w-5 h-5 text-emerald-400" /> Accessibility
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-white">Text-to-Speech</p>
                  <p className="text-xs text-gray-500">Read content aloud</p>
                </div>
              </div>
              <Toggle checked={tts} onChange={setTts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-white">Dyslexia-Friendly Font</p>
                  <p className="text-xs text-gray-500">OpenDyslexic typeface</p>
                </div>
              </div>
              <Toggle checked={dyslexiaMode} onChange={setDyslexiaMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-white">High Contrast Mode</p>
                  <p className="text-xs text-gray-500">Enhanced visibility</p>
                </div>
              </div>
              <Toggle checked={highContrast} onChange={setHighContrast} />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-white">Font Size</p>
              </div>
              <div className="flex gap-3">
                {(['normal', 'large', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      fontSize === size
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-yellow-400" /> Account
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition text-sm"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition text-sm">
              <Trash2 className="w-5 h-5" /> Delete Account
            </button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSave}
          className="w-full py-3 rounded-xl gradient-primary text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Save className="w-5 h-5" />
          {saved ? '✓ Saved!' : 'Save Changes'}
        </motion.button>
      </div>
    </DashboardLayout>
  );
}

# 🚀 Nexora AI — AI-Powered Learning Universe

<div align="center">

![Nexora AI](https://img.shields.io/badge/Nexora-AI-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw1IDdMMTIgMTJMMTkgN0wxMiAyWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-06b6d4?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=for-the-badge&logo=supabase)

**A futuristic AI-powered student ecosystem for school students, college students, competitive exam aspirants, and self-learners.**

[🌐 Live Demo](https://nexora-ai.vercel.app) · [📖 Documentation](#features) · [🐛 Report Bug](https://github.com/Shyamp05/Nexora/issues)

</div>

---

## ✨ Features

### 🤖 AI Tutor (ChatGPT-style)
- Real-time AI conversations powered by **Google Gemini**
- Multiple modes: Beginner, School, College, Interview Prep
- Markdown rendering with syntax highlighting
- Chat history and conversation management

### 📝 Smart Quizzes
- AI-generated adaptive quizzes
- Timed quiz engine with instant feedback
- Detailed AI explanations for each answer
- XP rewards and leaderboard

### 🗺️ AI Roadmap Generator
- Generate personalized learning roadmaps
- Daily study plans with progress tracking
- Milestone markers and resource suggestions

### 📄 Document AI
- Upload PDFs, PPTs, and images
- AI-generated summaries, flashcards, and key points
- Interactive flashcard deck with flip animations
- Mind map visualization

### 📊 Learning Analytics
- Study hours tracking with beautiful charts
- Activity heatmap (GitHub-style)
- Subject performance radar charts
- AI-powered insights and recommendations

### 🎮 Gamification
- XP system with levels and progress
- Achievement badges (unlockable)
- Study streaks with daily missions
- Global leaderboard

### ⏱️ Productivity Tools
- Pomodoro timer with SVG circular progress
- Task planner with priority management
- Focus mode with session tracking

### ⚡ More Features
- 🎨 Stunning dark UI with glassmorphism
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔐 Authentication with Supabase
- 🌍 Multi-language support (EN, HI, GU)
- ♿ Accessibility options (TTS, dyslexia mode, high contrast)
- ✨ Smooth Framer Motion animations throughout

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Routing** | React Router 7 |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **State** | Zustand |
| **Backend** | Supabase |
| **AI** | Google Gemini API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Shyamp05/Nexora.git
cd Nexora

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Gemini API credentials

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ai-tutor/     # Chat interface, messages, streaming
│   ├── common/       # Loading screen, shared components
│   ├── landing/      # Hero, features, testimonials, FAQ
│   └── layout/       # Navbar, sidebar, mobile nav
├── pages/            # Route pages (lazy-loaded)
├── stores/           # Zustand state management
├── lib/              # Supabase, Gemini AI, utilities
├── data/             # Mock data for demo
├── types/            # TypeScript definitions
└── index.css         # Design system & global styles
```

---

## 🎨 Design System

- **Theme**: Futuristic dark UI with glassmorphism
- **Colors**: Deep indigo, cyan accents, purple gradients
- **Typography**: Inter (Google Fonts)
- **Animations**: Smooth page transitions, hover effects, scroll reveals
- **Glass Effects**: Backdrop blur with subtle borders
- **Responsive**: Mobile-first with CSS Grid and Flexbox

---

## 📄 License

This project is built for hackathon demonstration purposes.

---

<div align="center">

Built with ❤️ by **Shyam Patel** | Powered by **Nexora AI**

</div>

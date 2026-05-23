import { Link } from 'react-router-dom';
import { Sparkles, ExternalLink, Mail } from 'lucide-react';

// ============================================
// Footer — Multi-column with social links
// ============================================

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const columns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'AI Tutor', href: '/ai-tutor' },
      { label: 'Smart Quizzes', href: '/quiz' },
      { label: 'Document AI', href: '/documents' },
      { label: 'Learning Roadmaps', href: '/roadmap' },
      { label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'API', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

const socials = [
  { icon: ExternalLink, href: '#', label: 'Twitter' },
  { icon: ExternalLink, href: '#', label: 'GitHub' },
  { icon: ExternalLink, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="container-nexora py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* ---- Brand column ---- */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/30">
                N
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-lg font-bold">
                <span className="gradient-text">Nexora</span>{' '}
                <span className="text-white">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
              The AI-powered learning platform that adapts to you.
              Study smarter, track progress, and unlock your full potential.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-500 hover:text-white hover:border-indigo-500/30 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ---- Link columns ---- */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Nexora AI. All rights reserved.</p>
          <p>
            Built with ❤️ for learners everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}

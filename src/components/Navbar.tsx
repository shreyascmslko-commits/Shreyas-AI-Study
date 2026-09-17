import React from 'react';
import { NavigationTab, UserProfile } from '../types';
import { ShreyasMasterLogo } from './ShreyasMasterLogo';
import {
  GraduationCap,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Award,
  FileText,
  History,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  Flame,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenAbout: () => void;
  onOpenAdmin: () => void;
  activeNotesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  profile,
  onOpenProfile,
  onOpenAbout,
  onOpenAdmin,
  activeNotesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Home', icon: <GraduationCap size={17} /> },
    { id: 'chat', label: 'Ask AI', icon: <MessageSquare size={17} /> },
    { id: 'study', label: 'Study Mode', icon: <BookOpen size={17} /> },
    { id: 'questions', label: 'Questions', icon: <HelpCircle size={17} /> },
    { id: 'exam', label: 'Exam Mode', icon: <Award size={17} /> },
    {
      id: 'notes',
      label: 'Notes',
      icon: <FileText size={17} />,
      badge: activeNotesCount > 0 ? `${activeNotesCount}` : undefined,
    },
    { id: 'history', label: 'My History', icon: <History size={17} /> },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand with custom SVG Emblem */}
        <button
          id="nav-brand-btn"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 text-left group focus:outline-hidden shrink-0"
        >
          <ShreyasMasterLogo size="sm" showText={true} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* About Button */}
          <button
            id="nav-about-btn"
            onClick={onOpenAbout}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all"
          >
            <Info size={16} />
            <span>About</span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Study Streak Pill */}
          <div
            title={`${profile.streakDays} Day Study Streak`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 shadow-xs"
          >
            <Flame size={14} className="text-amber-500 animate-bounce" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Subtle Admin Shield Button */}
          <button
            id="nav-admin-trigger-btn"
            onClick={onOpenAdmin}
            title="Admin Portal (Audit & Export)"
            className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors border border-transparent hover:border-amber-300/50"
          >
            <ShieldCheck size={17} />
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600" />}
          </button>

          {/* Student Profile Button (Anonymous/Local) */}
          <button
            id="profile-btn"
            onClick={onOpenProfile}
            title="Student Profile & Settings"
            className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all bg-slate-50/50 dark:bg-slate-800/50"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-xs overflow-hidden">
              {profile.avatarSeed.startsWith('http') ? (
                <img src={profile.avatarSeed} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{profile.avatarSeed}</span>
              )}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {profile.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                {profile.gradeLevel.split('(')[0].trim()}
              </p>
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Info size={17} />
            <span>About Shreyas Master AI</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <ShieldCheck size={17} />
            <span>Admin Telemetry & Export</span>
          </button>
        </div>
      )}
    </header>
  );
};

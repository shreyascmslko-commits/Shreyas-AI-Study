import React from 'react';
import { NavigationTab, UserProfile } from '../types';
import { PRESET_SUBJECTS } from '../data/presetSubjects';
import { ShreyasMasterLogo } from './ShreyasMasterLogo';
import {
  MessageSquare,
  BookOpen,
  HelpCircle,
  Award,
  UploadCloud,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Brain,
  Zap,
  GraduationCap,
  ShieldCheck,
  History,
  Lock,
} from 'lucide-react';

interface HomeScreenProps {
  onSelectTab: (tab: NavigationTab) => void;
  onQuickStartStudy: (subject: string, topic: string) => void;
  onQuickAskDoubt: (presetQuestion: string) => void;
  profile: UserProfile;
  activeNotesCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectTab,
  onQuickStartStudy,
  onQuickAskDoubt,
  profile,
  activeNotesCount,
}) => {
  const mainCards = [
    {
      id: 'chat' as NavigationTab,
      number: '01',
      title: 'Ask a Doubt',
      description: 'Instant conceptual clarity, step-by-step solutions, intuitive real-life analogies, and interactive follow-ups.',
      badge: 'Interactive AI Chat',
      gradient: 'from-blue-600 to-indigo-600',
      icon: <MessageSquare size={26} className="text-white" />,
      cta: 'Start Conversation',
    },
    {
      id: 'study' as NavigationTab,
      number: '02',
      title: 'Study a Topic',
      description: '7-part deep breakdown: beginner analogy, detailed theory, key points, solved examples, common traps & exam tips.',
      badge: '7-Part Mastery',
      gradient: 'from-indigo-600 to-purple-600',
      icon: <BookOpen size={26} className="text-white" />,
      cta: 'Explore Topics',
    },
    {
      id: 'questions' as NavigationTab,
      number: '03',
      title: 'Generate Questions',
      description: 'Exam-grade MCQs with instant scoring, short & long answers, HOTS, competency, and application problem-solving.',
      badge: 'Exam Grade Quizzes',
      gradient: 'from-purple-600 to-pink-600',
      icon: <HelpCircle size={26} className="text-white" />,
      cta: 'Create Practice Quiz',
    },
    {
      id: 'exam' as NavigationTab,
      number: '04',
      title: 'Exam Preparation',
      description: 'High-yield definitions, formula banks, likely question patterns, mock diagnostic & printable revision checklist.',
      badge: 'Score Booster',
      gradient: 'from-sky-600 to-blue-700',
      icon: <Award size={26} className="text-white" />,
      cta: 'Enter Exam Mode',
    },
    {
      id: 'notes' as NavigationTab,
      number: '05',
      title: 'Upload Notes',
      description: 'Upload class notes, syllabus or lecture summaries to ground all AI tutoring in your exact curriculum.',
      badge: activeNotesCount > 0 ? `${activeNotesCount} Notes Attached` : 'Syllabus Context',
      gradient: 'from-emerald-600 to-teal-700',
      icon: <UploadCloud size={26} className="text-white" />,
      cta: 'Manage Study Material',
    },
    {
      id: 'history' as NavigationTab,
      number: '06',
      title: 'My Study History',
      description: 'Instantly view, review, search, and reload previously generated notes, doubts, and exam packs stored privately.',
      badge: 'Local Session Memory',
      gradient: 'from-amber-600 to-orange-600',
      icon: <History size={26} className="text-white" />,
      cta: 'View Past Sessions',
    },
  ];

  const quickDoubts = [
    'Explain Newton’s Third Law with a sports example',
    'What is the difference between Mitosis and Meiosis?',
    'How do I find derivatives using the chain rule?',
    'Why did the Industrial Revolution start in Britain?',
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 shadow-xs">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 rounded-full bg-purple-400/10 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Welcome Tag & Privacy Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
              <Sparkles size={14} className="text-indigo-500" />
              <span>Welcome, {profile.name}! • Academic Level: {profile.gradeLevel.split('(')[0].trim()}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <Lock size={12} className="text-emerald-500" />
              <span>No Sign-in Required • Instant Access</span>
            </div>
          </div>

          {/* Centered Logo & Main Title */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-center">
              <ShreyasMasterLogo size="lg" showText={false} />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Shreyas Master AI
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Personal AI Study Partner
              </p>
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 tracking-wide pt-1">
                <span>Learn</span>
                <span className="text-indigo-500">•</span>
                <span>Ask</span>
                <span className="text-indigo-500">•</span>
                <span>Practise</span>
                <span className="text-indigo-500">•</span>
                <span>Improve</span>
              </div>
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Understand challenging concepts intuitively, clear homework doubts with step-by-step logic, practice exam-style questions, and review with high-yield study packs tailored to your syllabus.
          </p>

          {/* Quick Stats Ribbon */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
              <Flame size={15} className="text-amber-500" />
              <span>{profile.streakDays} Days Study Streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>{profile.questionsSolved} Questions Solved</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
              <ShieldCheck size={15} className="text-indigo-500" />
              <span>Autonomous Educational Intelligence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Action Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Choose How You Want to Learn
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select any specialized study mode to get started instantly
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mainCards.map((card, idx) => (
            <div
              key={card.id}
              id={`home-card-${card.id}`}
              onClick={() => onSelectTab(card.id)}
              className={`group relative cursor-pointer rounded-2xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                idx === 0
                  ? 'bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/10 border-indigo-200 dark:border-indigo-900/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header row with Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {card.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400">
                      {card.number}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>{card.cta}</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Doubts Prompt Starters */}
      <section className="rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Zap size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Have a Quick Question? Clear It Now
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickDoubts.map((doubt, index) => (
            <button
              key={index}
              id={`quick-doubt-${index}`}
              onClick={() => onQuickAskDoubt(doubt)}
              className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                "{doubt}"
              </span>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </section>

      {/* Subject Quick-Mastery Explorer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Explore Popular Subjects & Topics
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Pick any topic to jump straight into a deep breakdown or practice questions
            </p>
          </div>
          <button
            onClick={() => onSelectTab('study')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Custom Topic</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_SUBJECTS.map((subj) => (
            <div
              key={subj.id}
              className="rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${subj.color} flex items-center justify-center text-white text-xs font-bold shadow-xs`}>
                    {subj.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {subj.name}
                  </h4>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {subj.topics.slice(0, 3).map((topic, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => onQuickStartStudy(subj.name, topic)}
                    className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{topic}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

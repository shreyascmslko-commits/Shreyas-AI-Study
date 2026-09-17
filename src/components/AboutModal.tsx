import React from 'react';
import { ShreyasMasterLogo } from './ShreyasMasterLogo';
import {
  X,
  BookOpen,
  HelpCircle,
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Brain,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Hero Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border-b border-slate-800 overflow-hidden">
          {/* Subtle glow circles */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="relative flex items-center gap-4">
            <ShreyasMasterLogo size="lg" withGlow />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Shreyas Master AI
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  MASTER PLATFORM
                </span>
              </div>
              <p className="text-sm font-medium text-indigo-200">
                Your Autonomous Personal AI Study Partner
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                <span>Learn</span> • <span>Ask</span> • <span>Practise</span> • <span>Improve</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* Mission */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain size={18} className="text-indigo-500" />
              <span>Our Mission</span>
            </h3>
            <p>
              <strong>Shreyas Master AI</strong> is an independent, student-first educational AI platform created to democratize master-level conceptual tutoring for students worldwide. Traditional chatbots often dump flat answers without pedagogy; Shreyas Master AI breaks concepts down with concrete analogies, active recall questions, structured study master packs, and targeted exam score boosters.
            </p>
          </div>

          {/* Core Feature Pillars */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <span>Pedagogical Architecture</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                  <BookOpen size={15} className="text-indigo-500" />
                  <span>7-Part Mastery Framework</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every topic breakdown features intuitive beginner analogies, rigorous theory, high-yield takeaways, common student traps, and progressive practice questions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                  <HelpCircle size={15} className="text-purple-500" />
                  <span>Exam-Grade Question Engine</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant generation of MCQs with automatic scoring, Short/Long answer rubrics, HOTS (Higher Order Thinking Skills), and Competency scenarios.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                  <Award size={15} className="text-sky-500" />
                  <span>Strategic Exam Blueprinting</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Synthesizes high-frequency definitions, formula sheets with variable explanations, likely exam question patterns, and actionable revision checklists.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                  <ShieldCheck size={15} className="text-emerald-500" />
                  <span>Anonymous & Privacy First</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Zero mandatory logins or intrusive registration walls. Your study notes, generated materials, and personal history remain private on your device.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Integrity */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-start gap-3">
            <Zap size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-indigo-900 dark:text-indigo-200">
                Independent Platform Architecture
              </span>
              <p className="text-indigo-700/90 dark:text-indigo-300/90">
                Built with a high-performance React + TypeScript frontend, Express server middleware, and structured schema pipelines ensuring reliable, hallucination-resistant educational outputs.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-850">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>Shreyas Master AI v2.5 • All Systems Ready</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { StudyTopicResult, StudyNote } from '../types';
import { PRESET_SUBJECTS, GRADE_LEVELS } from '../data/presetSubjects';
import {
  BookOpen,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  MessageSquare,
  FilePlus,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface StudyModeViewProps {
  currentResult: StudyTopicResult | null;
  isLoading: boolean;
  onGenerateStudyTopic: (subject: string, topic: string, gradeLevel: string) => Promise<void>;
  onAskInChat: (prompt: string) => void;
  onSaveAsNote: (title: string, content: string, subject: string) => void;
  onGenerateQuizForTopic: (subject: string, topic: string) => void;
  activeNotes: StudyNote[];
  initialSubject?: string;
  initialTopic?: string;
}

export const StudyModeView: React.FC<StudyModeViewProps> = ({
  currentResult,
  isLoading,
  onGenerateStudyTopic,
  onAskInChat,
  onSaveAsNote,
  onGenerateQuizForTopic,
  activeNotes,
  initialSubject = '',
  initialTopic = '',
}) => {
  const [subject, setSubject] = useState(initialSubject || 'Physics');
  const [topic, setTopic] = useState(initialTopic || 'Newton\'s Laws of Motion');
  const [gradeLevel, setGradeLevel] = useState('Senior Secondary / Pre-University (Grades 11-12)');
  const [activeSection, setActiveSection] = useState<'all' | 'beginner' | 'detailed' | 'points' | 'examples' | 'mistakes' | 'tips' | 'practice'>('all');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [copiedAll, setCopiedAll] = useState(false);
  const [savedNote, setSavedNote] = useState(false);

  const handleStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    setRevealedSolutions({});
    setRevealedHints({});
    setSavedNote(false);
    await onGenerateStudyTopic(subject, topic, gradeLevel);
  };

  const toggleSolution = (idx: number) => {
    setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleHint = (idx: number) => {
    setRevealedHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyStudyPack = () => {
    if (!currentResult) return;
    const text = `# ${currentResult.topicTitle} (${currentResult.subject})
Estimated Study Time: ${currentResult.estimatedStudyTime}

## 1. Beginner Explanation
${currentResult.beginnerExplanation}

## 2. Detailed Explanation
${currentResult.detailedExplanation}

## 3. Important Points
${currentResult.importantPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## 4. Real-world Examples
${currentResult.examples.map((ex) => `### ${ex.title}\n${ex.description}`).join('\n\n')}

## 5. Common Mistakes
${currentResult.commonMistakes.map((m) => `* Mistake: ${m.mistake}\n* Correction: ${m.correction}`).join('\n\n')}

## 6. Exam Tips
${currentResult.examTips.map((tip) => `* ${tip}`).join('\n')}

## 7. Practice Questions
${currentResult.practiceQuestions.map((q, i) => `Q${i + 1} (${q.difficulty}): ${q.question}\nSolution: ${q.solution}`).join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleSaveToNotes = () => {
    if (!currentResult) return;
    const content = `Beginner Intuition:\n${currentResult.beginnerExplanation}\n\nKey Points:\n${currentResult.importantPoints.join('\n• ')}\n\nDetailed Theory:\n${currentResult.detailedExplanation}`;
    onSaveAsNote(currentResult.topicTitle, content, currentResult.subject);
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen size={16} />
            <span>7-Part Conceptual Breakdown</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Study Mode
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Master any subject topic with intuitive analogies, detailed theory, exam traps & practice questions
          </p>
        </div>

        {currentResult && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToNotes}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              {savedNote ? <Check size={14} className="text-emerald-500" /> : <FilePlus size={14} />}
              <span>{savedNote ? 'Saved to Notes!' : 'Save as Note'}</span>
            </button>
            <button
              onClick={handleCopyStudyPack}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              {copiedAll ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Control Box */}
      <div className="rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <form onSubmit={handleStudySubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics, Biology, Calculus, History"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Topic */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Topic to Study
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis & Calvin Cycle, Ohm's Law, Binomial Theorem"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isLoading || !topic.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Study Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Grade Level Selector & Quick Topics */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Target Depth:</span>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium focus:outline-hidden"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400">Try:</span>
              {[
                { s: 'Physics', t: "Newton's Laws" },
                { s: 'Biology', t: 'Photosynthesis' },
                { s: 'Mathematics', t: 'Derivatives & Chain Rule' },
                { s: 'Chemistry', t: 'Chemical Bonding' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSubject(item.s);
                    setTopic(item.t);
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-[11px] transition-colors"
                >
                  {item.t}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500">
            <Sparkles size={24} className="animate-spin" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Structuring 7-Part Master Pack for "{topic}"...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Drafting beginner analogies, rigorous theoretical mechanics, high-yield points, common exam pitfalls, and practice questions.
            </p>
          </div>
        </div>
      )}

      {/* Generated Results Presentation */}
      {!isLoading && currentResult && (
        <div className="space-y-6">
          {/* Result Banner */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-indigo-200/60 dark:border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <span>{currentResult.subject}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  Est. Study Time: {currentResult.estimatedStudyTime}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {currentResult.topicTitle}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onAskInChat(`I am studying ${currentResult.topicTitle} in ${currentResult.subject}. Can you give me a deeper breakdown of key mechanisms?`)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <MessageSquare size={14} />
                <span>Ask Doubts in Chat</span>
              </button>
              <button
                onClick={() => onGenerateQuizForTopic(currentResult.subject, currentResult.topicTitle)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <HelpCircle size={14} />
                <span>Test with Quiz</span>
              </button>
            </div>
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All 7 Sections' },
              { id: 'beginner', label: '1. Beginner Intuition' },
              { id: 'detailed', label: '2. Detailed Theory' },
              { id: 'points', label: '3. Important Points' },
              { id: 'examples', label: '4. Examples' },
              { id: 'mistakes', label: '5. Common Mistakes' },
              { id: 'tips', label: '6. Exam Tips' },
              { id: 'practice', label: '7. Practice Questions' },
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  activeSection === sec.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* 1. Beginner Explanation */}
          {(activeSection === 'all' || activeSection === 'beginner') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-blue-200 dark:border-blue-950/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Lightbulb size={20} />
                <h4 className="font-bold text-base">
                  1. Beginner Explanation (Intuitive Analogy)
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 shadow-xs">
                "{currentResult.beginnerExplanation}"
              </p>
            </div>
          )}

          {/* 2. Detailed Explanation */}
          {(activeSection === 'all' || activeSection === 'detailed') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <BookOpen size={20} />
                <h4 className="font-bold text-base">
                  2. Detailed Conceptual Theory & Mechanics
                </h4>
              </div>
              <div className="markdown-body text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <Markdown>{currentResult.detailedExplanation}</Markdown>
              </div>
            </div>
          )}

          {/* 3. Important Points */}
          {(activeSection === 'all' || activeSection === 'points') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <CheckCircle2 size={20} />
                <h4 className="font-bold text-base">
                  3. Key Points & High-Yield Takeaways
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentResult.importantPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Examples */}
          {(activeSection === 'all' || activeSection === 'examples') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Zap size={20} />
                <h4 className="font-bold text-base">
                  4. Practical Examples & Solved Scenarios
                </h4>
              </div>
              <div className="space-y-3">
                {currentResult.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5"
                  >
                    <h5 className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-900 text-[11px]">
                        Example {idx + 1}
                      </span>
                      <span>{ex.title}</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                      {ex.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Common Mistakes */}
          {(activeSection === 'all' || activeSection === 'mistakes') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle size={20} />
                <h4 className="font-bold text-base">
                  5. Common Student Mistakes & Misconceptions
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentResult.commonMistakes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2.5"
                  >
                    <div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        <AlertTriangle size={12} />
                        Common Trap
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-200 mt-0.5">
                        "{item.mistake}"
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/60">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={12} />
                        Accurate Correction
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-0.5">
                        {item.correction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Exam Tips */}
          {(activeSection === 'all' || activeSection === 'tips') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-amber-200/80 dark:border-amber-950/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Award size={20} />
                <h4 className="font-bold text-base">
                  6. Exam Tips & High-Scoring Secrets
                </h4>
              </div>
              <div className="space-y-2.5">
                {currentResult.examTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-900/60 flex items-start gap-3"
                  >
                    <span className="p-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                      <Award size={14} />
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Practice Questions */}
          {(activeSection === 'all' || activeSection === 'practice') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <HelpCircle size={20} />
                  <h4 className="font-bold text-base">
                    7. Practice Questions (Self-Assessment)
                  </h4>
                </div>
                <button
                  onClick={() => onGenerateQuizForTopic(currentResult.subject, currentResult.topicTitle)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>More in Question Generator</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="space-y-4">
                {currentResult.practiceQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Question {idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                      {q.question}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => toggleHint(idx)}
                        className="px-3 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        {revealedHints[idx] ? 'Hide Hint' : '💡 Show Hint'}
                      </button>
                      <button
                        onClick={() => toggleSolution(idx)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                      >
                        {revealedSolutions[idx] ? 'Hide Solution' : 'Reveal Solution'}
                      </button>
                    </div>

                    {revealedHints[idx] && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                        <strong>Hint:</strong> {q.hint}
                      </div>
                    )}

                    {revealedSolutions[idx] && (
                      <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1">
                        <strong className="text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                          Step-by-step Solution:
                        </strong>
                        <p className="leading-relaxed whitespace-pre-wrap">{q.solution}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

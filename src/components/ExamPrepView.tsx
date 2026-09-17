import React, { useState } from 'react';
import { ExamPrepResult, RevisionChecklistItem, StudyNote } from '../types';
import {
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  RotateCcw,
  Copy,
  Check,
  Zap,
  BookmarkCheck,
  Printer,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

interface ExamPrepViewProps {
  currentExamPrep: ExamPrepResult | null;
  isLoading: boolean;
  onGenerateExamPrep: (syllabusOrTopic: string, subject: string, examType: string) => Promise<void>;
  onAskInChat: (prompt: string) => void;
  activeNotes: StudyNote[];
  initialSubject?: string;
  initialTopic?: string;
}

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({
  currentExamPrep,
  isLoading,
  onGenerateExamPrep,
  onAskInChat,
  activeNotes,
  initialSubject = '',
  initialTopic = '',
}) => {
  const [subject, setSubject] = useState(initialSubject || 'Physics');
  const [syllabus, setSyllabus] = useState(
    initialTopic || 'Electromagnetism, Faraday\'s Laws, AC Circuits & Optics'
  );
  const [examType, setExamType] = useState('Final Board / University Examination');
  const [checklist, setChecklist] = useState<RevisionChecklistItem[]>([]);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'concepts' | 'definitions' | 'formulas' | 'patterns' | 'test' | 'checklist'>('all');

  // Sync checklist from prop
  React.useEffect(() => {
    if (currentExamPrep?.revisionChecklist) {
      setChecklist(currentExamPrep.revisionChecklist.map((c) => ({ ...c, completed: false })));
      setRevealedSolutions({});
    }
  }, [currentExamPrep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabus.trim() || isLoading) return;
    await onGenerateExamPrep(syllabus, subject, examType);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const toggleSolution = (qNum: number) => {
    setRevealedSolutions((prev) => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const handleCopyExamGuide = () => {
    if (!currentExamPrep) return;
    const text = `# Exam Readiness Guide: ${currentExamPrep.syllabusTitle}
Subject: ${currentExamPrep.subject} | Target: ${currentExamPrep.targetExam}

## 1. Important Concepts
${currentExamPrep.importantConcepts.map((c) => `* ${c.title} (${c.weightage}): ${c.summary}`).join('\n')}

## 2. Key Definitions
${currentExamPrep.importantDefinitions.map((d) => `* **${d.term}**: ${d.definition}\n  Key Keywords: ${d.keyKeywords}`).join('\n\n')}

## 3. Formulas & Equations
${currentExamPrep.formulas.map((f) => `* **${f.name}**: ${f.formula}\n  ${f.explanation} (Tip: ${f.applicationTips})`).join('\n\n')}

## 4. Likely Question Patterns
${currentExamPrep.likelyQuestionTypes.map((p) => `* ${p.pattern} [${p.marksRange} Marks, ${p.likelihood} Probability]: ${p.recommendation}`).join('\n\n')}

## 5. Practice Diagnostic Test
${currentExamPrep.practiceTest.map((t) => `Q${t.questionNumber} (${t.marks} Marks): ${t.questionText}\nSolution:\n${t.solution}`).join('\n\n')}

## 6. Revision Checklist
${checklist.map((c) => `[${c.completed ? 'X' : ' '}] (${c.priority} Priority) ${c.task}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
            <Award size={16} />
            <span>High-Yield Strategic Revision</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Exam Mode
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Formulas, definitions, high-frequency question patterns, mock test & interactive revision checklist
          </p>
        </div>

        {currentExamPrep && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyExamGuide}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              {copiedAll ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copiedAll ? 'Copied' : 'Copy All'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5 hidden sm:flex"
            >
              <Printer size={14} />
              <span>Print Guide</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="e.g. Physics, Chemistry, Economics"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            {/* Target Exam */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Exam Type / Target
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value="Final Board / University Examination">Final Board / University Exam</option>
                <option value="Mid-Term / Semester Exam">Mid-Term / Semester Exam</option>
                <option value="SAT / AP Advanced Placement">SAT / AP Advanced Placement</option>
                <option value="Competitive Entrance Exam">Competitive Entrance Exam</option>
                <option value="Class Unit Test">Class Unit Test</option>
              </select>
            </div>

            {/* Syllabus or Topic */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Syllabus Topics to Cover
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="e.g. Thermodynamics, Kinetic Theory of Gases, Heat Engines, Entropy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isLoading || !syllabus.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>{isLoading ? 'Preparing Plan...' : 'Generate Exam Prep'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-500">
            <Sparkles size={24} className="animate-spin" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Assembling Exam Strategy & High-Yield Blueprint...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Extracting crucial formulas, strict definitions, high-frequency question archetypes, and diagnostic test items.
            </p>
          </div>
        </div>
      )}

      {/* Exam Prep Presentation */}
      {!isLoading && currentExamPrep && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-sky-600/10 via-blue-600/10 to-indigo-600/10 border border-sky-200/60 dark:border-sky-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                <span>{currentExamPrep.subject}</span>
                <span>•</span>
                <span>{currentExamPrep.targetExam}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {currentExamPrep.syllabusTitle}
              </h3>
            </div>

            {/* Checklist Progress Ring/Bar */}
            {checklist.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-800/80 space-y-1.5 sm:min-w-48">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
                  <span>Revision Readiness</span>
                  <span className="text-sky-600 dark:text-sky-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {completedCount} of {checklist.length} checklist items mastered
                </p>
              </div>
            )}
          </div>

          {/* Section Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'Complete Study Guide' },
              { id: 'concepts', label: 'Important Concepts' },
              { id: 'definitions', label: 'Key Definitions' },
              { id: 'formulas', label: 'Formulas & Laws' },
              { id: 'patterns', label: 'Question Types' },
              { id: 'test', label: 'Practice Test' },
              { id: 'checklist', label: `Revision Checklist (${completedCount}/${checklist.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. Important Concepts */}
          {(activeTab === 'all' || activeTab === 'concepts') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-base">
                <BookmarkCheck size={20} />
                <h4>1. High-Yield Core Concepts</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentExamPrep.importantConcepts.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-sky-50/40 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                        {c.title}
                      </h5>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                        {c.weightage}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {c.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Important Definitions */}
          {(activeTab === 'all' || activeTab === 'definitions') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
                <BookOpen size={20} />
                <h4>2. Exact Academic Definitions & Essential Keywords</h4>
              </div>
              <div className="space-y-3">
                {currentExamPrep.importantDefinitions.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-indigo-900 dark:text-indigo-300">
                        {d.term}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      "{d.definition}"
                    </p>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                      Must-Include Keywords: <span className="underline decoration-indigo-300">{d.keyKeywords}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Formulas & Equations */}
          {(activeTab === 'all' || activeTab === 'formulas') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-base">
                <Zap size={20} />
                <h4>3. Formulas, Equations & Laws Cheat-Sheet</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentExamPrep.formulas.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2"
                  >
                    <h5 className="font-bold text-xs sm:text-sm text-purple-900 dark:text-purple-300">
                      {f.name}
                    </h5>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-purple-200/60 dark:border-purple-800/60 font-mono font-bold text-sm text-purple-700 dark:text-purple-300 text-center shadow-xs">
                      {f.formula}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {f.explanation}
                    </p>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200/40">
                      <strong>Exam Application Tip:</strong> {f.applicationTips}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Likely Question Types */}
          {(activeTab === 'all' || activeTab === 'patterns') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                <BarChart3 size={20} />
                <h4>4. Likely Question Types & Strategic Advice</h4>
              </div>
              <div className="space-y-3">
                {currentExamPrep.likelyQuestionTypes.map((pat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                          {pat.pattern}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                          {pat.likelihood} Probability
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {pat.recommendation}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {pat.marksRange} Marks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Practice Diagnostic Test */}
          {(activeTab === 'all' || activeTab === 'test') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base">
                  <FileCheck size={20} />
                  <h4>5. Practice Diagnostic Mock Test</h4>
                </div>
              </div>
              <div className="space-y-4">
                {currentExamPrep.practiceTest.map((item) => (
                  <div
                    key={item.questionNumber}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Question {item.questionNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {item.marks} Marks
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                      {item.questionText}
                    </p>

                    <button
                      onClick={() => toggleSolution(item.questionNumber)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                    >
                      {revealedSolutions[item.questionNumber] ? 'Hide Model Solution' : 'Reveal Model Solution'}
                    </button>

                    {revealedSolutions[item.questionNumber] && (
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        <strong className="text-blue-600 dark:text-blue-400 block mb-1">
                          Marking Scheme Solution:
                        </strong>
                        {item.solution}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Interactive Revision Checklist */}
          {(activeTab === 'all' || activeTab === 'checklist') && (
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  <CheckCircle2 size={20} />
                  <h4>6. Interactive Revision Checklist</h4>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {completedCount} / {checklist.length} Completed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tick off each item as you finish revising to track your progress and build confidence before the exam.
              </p>

              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      item.completed
                        ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-sky-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-transparent'
                        }`}
                      >
                        {item.completed && <Check size={13} />}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          item.completed ? 'line-through opacity-80' : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {item.task}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      {item.priority}
                    </span>
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

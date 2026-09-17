import React, { useState } from 'react';
import { QuestionGeneratorResult, GeneratedQuestion, StudyNote } from '../types';
import { QUESTION_TYPES_CONFIG } from '../data/presetSubjects';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Target,
  FileCheck,
  Printer,
  ArrowRight,
} from 'lucide-react';

interface QuestionGeneratorViewProps {
  currentQuiz: QuestionGeneratorResult | null;
  isLoading: boolean;
  onGenerateQuestions: (
    subject: string,
    topic: string,
    difficulty: string,
    count: number,
    questionTypes: string[]
  ) => Promise<void>;
  onRecordQuestionAttempt: (correct: boolean) => void;
  onAskInChat: (prompt: string) => void;
  activeNotes: StudyNote[];
  initialSubject?: string;
  initialTopic?: string;
}

export const QuestionGeneratorView: React.FC<QuestionGeneratorViewProps> = ({
  currentQuiz,
  isLoading,
  onGenerateQuestions,
  onRecordQuestionAttempt,
  onAskInChat,
  activeNotes,
  initialSubject = '',
  initialTopic = '',
}) => {
  const [subject, setSubject] = useState(initialSubject || 'Mathematics');
  const [topic, setTopic] = useState(initialTopic || 'Calculus: Derivatives & Integrals');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(6);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'mcq',
    'short',
    'hots',
    'competency',
    'application',
  ]);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [copiedQuiz, setCopiedQuiz] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const toggleQuestionType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? (prev.length > 1 ? prev.filter((t) => t !== typeId) : prev) : [...prev, typeId]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    setSelectedAnswers({});
    setRevealedAnswers({});
    await onGenerateQuestions(subject, topic, difficulty, count, selectedTypes);
  };

  const handleSelectOption = (questionId: string, optionIdx: number, correctIdx: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    onRecordQuestionAttempt(optionIdx === correctIdx);
  };

  const toggleRevealAnswer = (qId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const calculateScore = () => {
    if (!currentQuiz) return { attempted: 0, correct: 0, totalMCQs: 0 };
    const mcqs = currentQuiz.questions.filter((q) => q.type === 'mcq');
    let correct = 0;
    let attempted = 0;
    mcqs.forEach((q) => {
      if (selectedAnswers[q.id] !== undefined) {
        attempted++;
        if (selectedAnswers[q.id] === q.correctOptionIndex) {
          correct++;
        }
      }
    });
    return { attempted, correct, totalMCQs: mcqs.length };
  };

  const handleCopyQuiz = () => {
    if (!currentQuiz) return;
    const text = `# Practice Questions: ${currentQuiz.topic} (${currentQuiz.subject})
Difficulty: ${currentQuiz.difficulty} | Total: ${currentQuiz.totalQuestions} Questions

${currentQuiz.questions
  .map(
    (q, idx) => `### Q${idx + 1} [${q.typeLabel.toUpperCase()}] (${q.marks} Marks)
${q.question}
${
  q.type === 'mcq' && q.options
    ? q.options.map((opt, oIdx) => `  ${String.fromCharCode(65 + oIdx)}) ${opt}`).join('\n') +
      `\nCorrect Answer: ${String.fromCharCode(65 + q.correctOptionIndex)}`
    : ''
}

Explanation / Key Points:
${q.explanation}
${q.keyPoints ? `Key Points: ${q.keyPoints.join(', ')}` : ''}`
  )
  .join('\n\n---\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedQuiz(true);
    setTimeout(() => setCopiedQuiz(false), 2000);
  };

  const scoreData = calculateScore();

  const filteredQuestions = currentQuiz
    ? currentQuiz.questions.filter((q) => (activeFilter === 'all' ? true : q.type === activeFilter))
    : [];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
            <HelpCircle size={16} />
            <span>Targeted Practice & Quizzes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Question Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Generate exam-aligned MCQs, HOTS, competency, and structured questions with instant grading
          </p>
        </div>

        {currentQuiz && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyQuiz}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              {copiedQuiz ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copiedQuiz ? 'Copied' : 'Copy All'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5 hidden sm:flex"
            >
              <Printer size={14} />
              <span>Print Worksheet</span>
            </button>
          </div>
        )}
      </div>

      {/* Generator Configuration Form */}
      <div className="rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics, Chemistry"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Integration by parts, Organic nomenclature"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              >
                <option value="Easy (Concept Foundation)">Easy (Concept Foundation)</option>
                <option value="Medium (Standard Exam)">Medium (Standard Exam)</option>
                <option value="Hard (Analytical)">Hard (Analytical)</option>
                <option value="Competitive Exam / Olympiad">Competitive Exam / Olympiad</option>
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Number of Questions
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              >
                <option value={3}>3 Questions (Quick check)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={8}>8 Questions (In-depth)</option>
                <option value={12}>12 Questions (Comprehensive)</option>
              </select>
            </div>
          </div>

          {/* Question Formats to Include */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Question Formats to Include:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {QUESTION_TYPES_CONFIG.map((type) => {
                const isChecked = selectedTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleQuestionType(type.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isChecked
                        ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-1 ring-purple-400/50'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{type.label.split('(')[0]}</span>
                      {isChecked && <CheckCircle2 size={13} className="text-purple-600 dark:text-purple-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>{isLoading ? 'Generating Questions...' : 'Generate Practice Set'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-500">
            <Sparkles size={24} className="animate-spin" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Generating High-Quality Questions for "{topic}"...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Creating MCQs with detailed explanations, application-based problem scenarios, and HOTS questions.
            </p>
          </div>
        </div>
      )}

      {/* Generated Quiz Container */}
      {!isLoading && currentQuiz && (
        <div className="space-y-6">
          {/* Quiz Stats Ribbon */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 border border-purple-200/60 dark:border-purple-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                <span>{currentQuiz.subject}</span>
                <span>•</span>
                <span>{currentQuiz.difficulty}</span>
                <span>•</span>
                <span>{currentQuiz.totalQuestions} Questions</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {currentQuiz.topic}
              </h3>
            </div>

            {scoreData.totalMCQs > 0 && (
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Award size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-extrabold text-base text-slate-900 dark:text-white">
                    <span>{scoreData.correct}</span>
                    <span className="text-xs text-slate-400">/ {scoreData.totalMCQs} Correct</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {scoreData.attempted}/{scoreData.totalMCQs} MCQs Attempted
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({currentQuiz.questions.length})
            </button>
            {['mcq', 'short', 'long', 'hots', 'competency', 'application'].map((ft) => {
              const countOfType = currentQuiz.questions.filter((q) => q.type === ft).length;
              if (countOfType === 0) return null;
              return (
                <button
                  key={ft}
                  onClick={() => setActiveFilter(ft)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors capitalize ${
                    activeFilter === ft
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {ft} ({countOfType})
                </button>
              );
            })}
          </div>

          {/* Questions List */}
          <div className="space-y-5">
            {filteredQuestions.map((q, idx) => {
              const isMCQ = q.type === 'mcq';
              const userAnswer = selectedAnswers[q.id];
              const isAnswered = userAnswer !== undefined;
              const isRevealed = revealedAnswers[q.id];

              return (
                <div
                  key={q.id || idx}
                  className="rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
                >
                  {/* Top Bar of Question */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                        {q.typeLabel || q.type}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Scenario if competency or application */}
                  {q.applicationScenario && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed italic">
                      <strong>Scenario:</strong> {q.applicationScenario}
                    </div>
                  )}

                  {/* Question Text */}
                  <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                    {q.question}
                  </p>

                  {/* MCQ Options with Interactive Selection */}
                  {isMCQ && q.options && q.options.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isOptionSelected = userAnswer === oIdx;
                        const isCorrectOption = q.correctOptionIndex === oIdx;

                        let optionStyle =
                          'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200';

                        if (isAnswered) {
                          if (isCorrectOption) {
                            optionStyle =
                              'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/40';
                          } else if (isOptionSelected && !isCorrectOption) {
                            optionStyle =
                              'border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 ring-2 ring-rose-400/40';
                          } else {
                            optionStyle =
                              'opacity-50 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(q.id, oIdx, q.correctOptionIndex)}
                            className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {isAnswered && (
                              <div>
                                {isCorrectOption && (
                                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                                )}
                                {isOptionSelected && !isCorrectOption && (
                                  <XCircle size={18} className="text-rose-600 dark:text-rose-400" />
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Non-MCQ: Reveal Answer & Rubrics Toggle */}
                  {!isMCQ && (
                    <div className="pt-2">
                      <button
                        onClick={() => toggleRevealAnswer(q.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                      >
                        <span>{isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer & Rubric'}</span>
                        {isRevealed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  )}

                  {/* Explanation & Key Points Box (shown automatically for answered MCQs, or when toggled for open questions) */}
                  {(isAnswered || isRevealed) && (
                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <strong className="text-indigo-900 dark:text-indigo-300 font-bold flex items-center gap-1.5">
                          <Brain size={15} />
                          <span>Detailed Explanation & Academic Rubric</span>
                        </strong>
                        <button
                          onClick={() =>
                            onAskInChat(`Can you explain why the answer to this question is what it is? Question: "${q.question}"`)
                          }
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Ask in Chat →
                        </button>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {q.explanation}
                      </p>

                      {q.keyPoints && q.keyPoints.length > 0 && (
                        <div className="pt-2 border-t border-indigo-200/50 dark:border-indigo-900/50">
                          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Essential Keywords for Full Marks:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {q.keyPoints.map((pt, pIdx) => (
                              <span
                                key={pIdx}
                                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 text-[11px] border border-indigo-200 dark:border-indigo-800"
                              >
                                ✓ {pt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

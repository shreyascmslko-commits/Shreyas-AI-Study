import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  ChatMessage,
  StudyTopicResult,
  QuestionGeneratorResult,
  ExamPrepResult,
  StudyNote,
  UserProfile,
  HistoryItem,
} from './types';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { ChatView } from './components/ChatView';
import { StudyModeView } from './components/StudyModeView';
import { QuestionGeneratorView } from './components/QuestionGeneratorView';
import { ExamPrepView } from './components/ExamPrepView';
import { NotesView } from './components/NotesView';
import { HistoryView } from './components/HistoryView';
import { ProfileModal } from './components/ProfileModal';
import { AdminModal } from './components/AdminModal';
import { AboutModal } from './components/AboutModal';
import { AlertCircle, X } from 'lucide-react';
import {
  getOrCreateSessionId,
  saveHistoryItem,
  getLocalHistory,
  deleteLocalHistoryItem,
  clearLocalHistory,
} from './utils/session';

const INITIAL_NOTE: StudyNote = {
  id: 'sample-note-1',
  title: 'Physics: Laws of Motion & Momentum Master Notes',
  subject: 'Physics',
  dateAdded: Date.now() - 86400000,
  isActiveForContext: true,
  content: `Key Topics & Equations:
1. Newton's First Law (Law of Inertia): An object remains at rest or in uniform straight-line motion unless acted upon by a net external force.
2. Newton's Second Law: F_net = m * a (Rate of change of momentum is directly proportional to applied force, dp/dt = F).
3. Newton's Third Law: For every action, there is an equal and opposite reaction acting on different bodies simultaneously (F_AB = -F_BA).
4. Conservation of Linear Momentum: In an isolated system (no external forces), total initial momentum = total final momentum (m1*u1 + m2*u2 = m1*v1 + m2*v2).
5. Impulse: J = F * delta_t = delta_p (Change in momentum). High time of contact reduces force (e.g., catching a cricket ball, car crumple zones).
Common Exam Traps:
- Action-reaction pairs NEVER cancel each other because they act on TWO DIFFERENT objects.
- Normal force does not always equal mg (e.g., in elevators accelerating upwards N = m(g + a), inclined planes N = mg*cos(theta)).`,
  summary:
    'Comprehensive core formulas and principles for Newton’s three laws of motion, momentum conservation, and impulse with key exam pitfalls regarding action-reaction pairs.',
  flashcards: [
    {
      question: 'Why don’t action and reaction forces cancel each other out?',
      answer: 'Because they act on two completely different objects, never on the same body.',
    },
    {
      question: 'What is the physical significance of impulse J = F * delta_t?',
      answer: 'It represents the total change in momentum. Increasing contact time reduces impact force.',
    },
    {
      question: 'What is the apparent weight in an elevator accelerating upward at acceleration a?',
      answer: 'N = m(g + a), so apparent weight increases.',
    },
  ],
};

const INITIAL_PROFILE: UserProfile = {
  name: 'Alex',
  avatarSeed: '🎓',
  gradeLevel: 'Senior High (Grades 11-12)',
  favoriteSubject: 'Physics & Mathematics',
  streakDays: 4,
  questionsSolved: 28,
  topicsMastered: 9,
};

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    content: `👋 Hello! I am **Shreyas Master AI**, your dedicated academic study partner and cognitive tutor.

How would you like to learn today?
- **Clear a doubt** on homework, formulas, or tricky theories
- **Study a topic** with simple analogies and 7-part deep breakdowns
- **Generate practice questions** (MCQs, HOTS, and application problems)
- **Prepare for your exam** with revision checklists and key definitions

Feel free to ask me anything or upload your study notes!`,
    timestamp: Date.now(),
  },
];

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('smai_theme') || localStorage.getItem('studymate_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');

  // Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('smai_profile') || localStorage.getItem('studymate_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // History items state
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => getLocalHistory());

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('smai_messages') || localStorage.getItem('studymate_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CHAT_MESSAGES;
      }
    }
    return INITIAL_CHAT_MESSAGES;
  });
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');

  // Study Mode state
  const [studyResult, setStudyResult] = useState<StudyTopicResult | null>(null);
  const [studyLoading, setStudyLoading] = useState(false);
  const [studySubjectPrefill, setStudySubjectPrefill] = useState('');
  const [studyTopicPrefill, setStudyTopicPrefill] = useState('');

  // Question Generator state
  const [quizResult, setQuizResult] = useState<QuestionGeneratorResult | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSubjectPrefill, setQuizSubjectPrefill] = useState('');
  const [quizTopicPrefill, setQuizTopicPrefill] = useState('');

  // Exam Prep state
  const [examPrepResult, setExamPrepResult] = useState<ExamPrepResult | null>(null);
  const [examLoading, setExamLoading] = useState(false);
  const [examSubjectPrefill, setExamSubjectPrefill] = useState('');
  const [examTopicPrefill, setExamTopicPrefill] = useState('');

  // Notes state
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('smai_notes') || localStorage.getItem('studymate_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [INITIAL_NOTE];
      }
    }
    return [INITIAL_NOTE];
  });
  const [isSummarizingNote, setIsSummarizingNote] = useState(false);

  // Global error banner
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Persist theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smai_theme', 'light');
    }
  }, [isDark]);

  // Persist profile
  useEffect(() => {
    localStorage.setItem('smai_profile', JSON.stringify(profile));
  }, [profile]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem('smai_messages', JSON.stringify(messages));
  }, [messages]);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('smai_notes', JSON.stringify(notes));
  }, [notes]);

  // Helper to compile active context notes string
  const getActiveNotesContext = () => {
    const active = notes.filter((n) => n.isActiveForContext);
    if (active.length === 0) return '';
    return active.map((n) => `--- Note: ${n.title} (${n.subject}) ---\n${n.content}`).join('\n\n');
  };

  // Chat action
  const handleSendMessage = async (text: string, quickAction?: string) => {
    if (!text.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setChatLoading(true);
    setErrorMessage(null);

    const sessionId = getOrCreateSessionId();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.slice(-8),
          contextNotes: getActiveNotesContext(),
          quickAction,
          sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save to student local history
      saveHistoryItem({
        sessionId,
        feature: 'chat',
        subject: notes.find((n) => n.isActiveForContext)?.subject || 'General',
        prompt: text,
        responseSnippet: data.reply,
      });
      setHistoryItems(getLocalHistory());
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'An error occurred connecting to Shreyas Master AI.');
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `⚠️ **Notice:** I encountered an issue connecting to the AI engine: ${err.message || 'Network error'}. Please try again.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Study topic action
  const handleGenerateStudyTopic = async (subject: string, topic: string, gradeLevel: string) => {
    setStudyLoading(true);
    setErrorMessage(null);
    const sessionId = getOrCreateSessionId();
    try {
      const res = await fetch('/api/study-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          gradeLevel,
          contextNotes: getActiveNotesContext(),
          sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate study pack');
      setStudyResult(data);

      // Increment mastered count in profile
      setProfile((prev) => ({
        ...prev,
        topicsMastered: prev.topicsMastered + 1,
      }));

      // Save to personal history
      saveHistoryItem({
        sessionId,
        feature: 'study',
        subject,
        topic,
        prompt: `Study Topic: ${topic} (${gradeLevel})`,
        responseSnippet: data.beginnerExplanation || data.detailedExplanation?.slice(0, 300) || '7-Part study breakdown created.',
      });
      setHistoryItems(getLocalHistory());
    } catch (err: any) {
      console.error('Study mode error:', err);
      setErrorMessage(err.message || 'Could not generate topic breakdown.');
    } finally {
      setStudyLoading(false);
    }
  };

  // Question generator action
  const handleGenerateQuestions = async (
    subject: string,
    topic: string,
    difficulty: string,
    count: number,
    questionTypes: string[]
  ) => {
    setQuizLoading(true);
    setErrorMessage(null);
    const sessionId = getOrCreateSessionId();
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          count,
          questionTypes,
          contextNotes: getActiveNotesContext(),
          sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate questions');
      setQuizResult(data);

      // Save to personal history
      saveHistoryItem({
        sessionId,
        feature: 'questions',
        subject,
        topic,
        prompt: `Practice Quiz: ${topic} (${difficulty}, ${count} Qs)`,
        responseSnippet: `Generated ${data.questions?.length || 0} practice questions on ${topic}`,
      });
      setHistoryItems(getLocalHistory());
    } catch (err: any) {
      console.error('Question generator error:', err);
      setErrorMessage(err.message || 'Could not generate questions.');
    } finally {
      setQuizLoading(false);
    }
  };

  // Record question attempt
  const handleRecordQuestionAttempt = (_correct: boolean) => {
    setProfile((prev) => ({
      ...prev,
      questionsSolved: prev.questionsSolved + 1,
    }));
  };

  // Exam Prep action
  const handleGenerateExamPrep = async (syllabusOrTopic: string, subject: string, examType: string) => {
    setExamLoading(true);
    setErrorMessage(null);
    const sessionId = getOrCreateSessionId();
    try {
      const res = await fetch('/api/exam-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusOrTopic,
          subject,
          examType,
          contextNotes: getActiveNotesContext(),
          sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate exam prep guide');
      setExamPrepResult(data);

      // Save to personal history
      saveHistoryItem({
        sessionId,
        feature: 'exam',
        subject,
        prompt: `Exam Prep: ${syllabusOrTopic} (${examType})`,
        responseSnippet: `Generated exam study guide with ${data.importantConcepts?.length || 0} concepts and ${data.practiceTest?.length || 0} practice test questions`,
      });
      setHistoryItems(getLocalHistory());
    } catch (err: any) {
      console.error('Exam prep error:', err);
      setErrorMessage(err.message || 'Could not assemble exam preparation.');
    } finally {
      setExamLoading(false);
    }
  };

  // Summarize notes action
  const handleSummarizeNote = async (noteId: string, title: string, content: string) => {
    setIsSummarizingNote(true);
    setErrorMessage(null);
    const sessionId = getOrCreateSessionId();
    try {
      const res = await fetch('/api/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteTitle: title, noteContent: content, sessionId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to summarize notes');

      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? {
                ...n,
                summary: data.summary,
                keyConcepts: data.keyConcepts,
                flashcards: data.flashcards,
              }
            : n
        )
      );

      // Save to personal history
      saveHistoryItem({
        sessionId,
        feature: 'notes',
        subject: 'Notes Analysis',
        prompt: `Note Summarization: ${title}`,
        responseSnippet: data.summary?.slice(0, 300) || 'Note summary processed',
      });
      setHistoryItems(getLocalHistory());
    } catch (err: any) {
      console.error('Notes summarization error:', err);
      setErrorMessage(err.message || 'Failed to process note.');
    } finally {
      setIsSummarizingNote(false);
    }
  };

  // Notes operations
  const handleAddNote = (newNote: StudyNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleToggleActiveNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isActiveForContext: !n.isActiveForContext } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // History operations
  const handleDeleteHistoryItem = (id: string) => {
    deleteLocalHistoryItem(id);
    setHistoryItems(getLocalHistory());
  };

  const handleClearHistory = () => {
    clearLocalHistory();
    setHistoryItems([]);
  };

  const handleReopenFromHistory = (
    tab: NavigationTab,
    prefill?: { subject?: string; topic?: string; prompt?: string }
  ) => {
    if (prefill?.prompt && tab === 'chat') {
      setChatInitialPrompt(prefill.prompt);
    }
    if (prefill?.subject && tab === 'study') {
      setStudySubjectPrefill(prefill.subject);
    }
    if (prefill?.topic && tab === 'study') {
      setStudyTopicPrefill(prefill.topic);
    }
    if (prefill?.subject && tab === 'questions') {
      setQuizSubjectPrefill(prefill.subject);
    }
    if (prefill?.topic && tab === 'questions') {
      setQuizTopicPrefill(prefill.topic);
    }
    if (prefill?.subject && tab === 'exam') {
      setExamSubjectPrefill(prefill.subject);
    }
    if (prefill?.topic && tab === 'exam') {
      setExamTopicPrefill(prefill.topic);
    }
    setCurrentTab(tab);
  };

  // Cross-Navigation shortcuts
  const handleQuickStartStudy = (subject: string, topic: string) => {
    setStudySubjectPrefill(subject);
    setStudyTopicPrefill(topic);
    setCurrentTab('study');
    handleGenerateStudyTopic(subject, topic, profile.gradeLevel);
  };

  const handleQuickAskDoubt = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setCurrentTab('chat');
  };

  const handleQuizForTopic = (subject: string, topic: string) => {
    setQuizSubjectPrefill(subject);
    setQuizTopicPrefill(topic);
    setCurrentTab('questions');
    handleGenerateQuestions(subject, topic, 'Medium', 6, ['mcq', 'short', 'hots', 'competency']);
  };

  const handleAskInChat = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setCurrentTab('chat');
  };

  const handleSaveAsNote = (title: string, content: string, subject: string) => {
    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      subject,
      dateAdded: Date.now(),
      isActiveForContext: true,
    };
    handleAddNote(newNote);
  };

  const activeNotesList = notes.filter((n) => n.isActiveForContext);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        activeNotesCount={activeNotesList.length}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-md text-rose-500 hover:text-rose-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'home' && (
          <HomeScreen
            onSelectTab={setCurrentTab}
            onQuickStartStudy={handleQuickStartStudy}
            onQuickAskDoubt={handleQuickAskDoubt}
            profile={profile}
            activeNotesCount={activeNotesList.length}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={chatLoading}
            onClearChat={() => setMessages(INITIAL_CHAT_MESSAGES)}
            activeNotes={activeNotesList}
            onSelectTab={setCurrentTab}
            defaultInputPrompt={chatInitialPrompt}
            onClearDefaultPrompt={() => setChatInitialPrompt('')}
          />
        )}

        {currentTab === 'study' && (
          <StudyModeView
            currentResult={studyResult}
            isLoading={studyLoading}
            onGenerateStudyTopic={handleGenerateStudyTopic}
            onAskInChat={handleAskInChat}
            onSaveAsNote={handleSaveAsNote}
            onGenerateQuizForTopic={handleQuizForTopic}
            activeNotes={activeNotesList}
            initialSubject={studySubjectPrefill}
            initialTopic={studyTopicPrefill}
          />
        )}

        {currentTab === 'questions' && (
          <QuestionGeneratorView
            currentQuiz={quizResult}
            isLoading={quizLoading}
            onGenerateQuestions={handleGenerateQuestions}
            onRecordQuestionAttempt={handleRecordQuestionAttempt}
            onAskInChat={handleAskInChat}
            activeNotes={activeNotesList}
            initialSubject={quizSubjectPrefill}
            initialTopic={quizTopicPrefill}
          />
        )}

        {currentTab === 'exam' && (
          <ExamPrepView
            currentExamPrep={examPrepResult}
            isLoading={examLoading}
            onGenerateExamPrep={handleGenerateExamPrep}
            onAskInChat={handleAskInChat}
            activeNotes={activeNotesList}
            initialSubject={examSubjectPrefill}
            initialTopic={examTopicPrefill}
          />
        )}

        {currentTab === 'notes' && (
          <NotesView
            notes={notes}
            onAddNote={handleAddNote}
            onToggleActiveNote={handleToggleActiveNote}
            onDeleteNote={handleDeleteNote}
            onSummarizeNote={handleSummarizeNote}
            isSummarizing={isSummarizingNote}
            onAskAboutNotesInChat={(title) =>
              handleAskInChat(`Can you summarize the core points of the note "${title}" and quiz me on it?`)
            }
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            historyItems={historyItems}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
            onReopenFeature={handleReopenFromHistory}
          />
        )}
      </main>

      {/* Profile & Customization Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
        isDark={isDark}
      />

      {/* About Platform Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Admin Telemetry & Export Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

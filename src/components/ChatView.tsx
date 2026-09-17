import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { ChatMessage, StudyNote } from '../types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  FileText,
  Lightbulb,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, quickAction?: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  activeNotes: StudyNote[];
  onSelectTab: (tab: any) => void;
  defaultInputPrompt?: string;
  onClearDefaultPrompt?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  activeNotes,
  onSelectTab,
  defaultInputPrompt,
  onClearDefaultPrompt,
}) => {
  const [input, setInput] = useState(defaultInputPrompt || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (defaultInputPrompt) {
      setInput(defaultInputPrompt);
      if (onClearDefaultPrompt) onClearDefaultPrompt();
      inputRef.current?.focus();
    }
  }, [defaultInputPrompt, onClearDefaultPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Stop speech if unmounted
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  const handleQuickAction = async (promptText: string, actionLabel: string) => {
    if (isLoading) return;
    await onSendMessage(promptText, actionLabel);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown characters for cleaner audio
    const cleanText = text.replace(/[#*_`\[\]]/g, '').slice(0, 1000);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const starterPrompts = [
    { label: 'Explain Quantum Superposition simply', text: 'Can you explain Quantum Superposition using a simple real-world analogy?' },
    { label: 'Difference between Mitosis and Meiosis', text: 'What is the fundamental difference between Mitosis and Meiosis? Please include a comparison table.' },
    { label: 'How to solve Quadratic Equations', text: 'Explain the 3 main ways to solve quadratic equations with clear step-by-step examples.' },
    { label: 'Key causes of World War 1', text: 'What were the main causes of World War 1? Can you use the M-A-I-N acronym to break it down?' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-h-[860px] rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Chat Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                AI Study Tutor Chat
              </h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {activeNotes.length > 0
                ? `Context Active: Grounded in ${activeNotes.length} uploaded note${activeNotes.length > 1 ? 's' : ''}`
                : 'Ready to clear doubts, give examples & test your understanding'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeNotes.length > 0 && (
            <button
              onClick={() => onSelectTab('notes')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
              title="View attached notes"
            >
              <FileText size={12} />
              <span>{activeNotes.length} Notes Linked</span>
            </button>
          )}

          {messages.length > 1 && (
            <button
              onClick={onClearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
              title="Clear conversation history"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <Sparkles size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                How can Shreyas Master AI help you today?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Ask any doubt, request step-by-step derivations, simplify difficult textbook topics, or ask for practice questions.
              </p>
            </div>

            <div className="w-full space-y-2 text-left">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center mb-1">
                Suggested Doubts to Try
              </p>
              {starterPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(p.text)}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all flex items-center justify-between group"
                >
                  <span>{p.label}</span>
                  <Sparkles size={13} className="text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot size={17} />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm ${
                    isUser
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md rounded-tr-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  ) : (
                    <div className="markdown-body space-y-2 leading-relaxed">
                      <Markdown>{message.content}</Markdown>
                    </div>
                  )}

                  {/* Actions for assistant messages */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
                      {/* Follow-up Quick Action Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => handleQuickAction('Can you give 2 real-world concrete examples of this?', 'Examples')}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <Lightbulb size={11} />
                          <span>Examples</span>
                        </button>
                        <button
                          onClick={() => handleQuickAction('Can you summarize this into 4 high-yield bullet points for quick revision?', 'Summary')}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <FileText size={11} />
                          <span>Summarize</span>
                        </button>
                        <button
                          onClick={() => handleQuickAction('Give me 2 practice questions with solutions to test my understanding.', 'Practice')}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <HelpCircle size={11} />
                          <span>Practice</span>
                        </button>
                        <button
                          onClick={() => handleQuickAction('What are the most common exam questions and student traps for this topic?', 'Exam Prep')}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <BookOpen size={11} />
                          <span>Exam Tips</span>
                        </button>
                      </div>

                      {/* Tool Buttons: Copy & Audio */}
                      <div className="flex items-center gap-1 text-slate-400">
                        <button
                          onClick={() => handleToggleSpeak(message.id, message.content)}
                          className={`p-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${
                            speakingId === message.id ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50' : ''
                          }`}
                          title={speakingId === message.id ? 'Stop reading' : 'Read aloud'}
                        >
                          {speakingId === message.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopy(message.id, message.content)}
                          className="p-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                          title="Copy explanation"
                        >
                          {copiedId === message.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <User size={17} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot size={17} />
            </div>
            <div className="rounded-2xl rounded-tl-xs p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                StudyMate AI is formulating your explanation...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Area */}
      <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask any study doubt or question... (Press Enter to send)"
            className="w-full resize-none py-3 pl-4 pr-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all max-h-32"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
          <span>Shift + Enter for new line • Backed by Gemini</span>
          {activeNotes.length > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Referencing your uploaded notes
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

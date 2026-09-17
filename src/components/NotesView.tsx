import React, { useState } from 'react';
import { StudyNote } from '../types';
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  BookOpen,
  HelpCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

interface NotesViewProps {
  notes: StudyNote[];
  onAddNote: (note: StudyNote) => void;
  onToggleActiveNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onSummarizeNote: (noteId: string, title: string, content: string) => Promise<void>;
  isSummarizing: boolean;
  onAskAboutNotesInChat: (noteTitle: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onAddNote,
  onToggleActiveNote,
  onDeleteNote,
  onSummarizeNote,
  isSummarizing,
  onAskAboutNotesInChat,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newContent, setNewContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [revealedFlashcards, setRevealedFlashcards] = useState<Record<string, boolean>>({});

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onAddNote({
          id: `note-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          subject: newSubject,
          content: text,
          dateAdded: Date.now(),
          isActiveForContext: true,
        });
        setShowAddModal(false);
        setNewTitle('');
        setNewContent('');
      }
    };

    reader.readAsText(file);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddNote({
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject.trim() || 'General',
      content: newContent.trim(),
      dateAdded: Date.now(),
      isActiveForContext: true,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const activeNotesCount = notes.filter((n) => n.isActiveForContext).length;

  const toggleFlashcard = (fKey: string) => {
    setRevealedFlashcards((prev) => ({ ...prev, [fKey]: !prev[fKey] }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <UploadCloud size={16} />
            <span>Curriculum Grounding & AI Context</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Study Notes & Syllabus
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload notes, lecture excerpts or course outlines. Enabled notes are directly used by the AI when clearing doubts and creating quizzes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Upload or Add Notes</span>
        </button>
      </div>

      {/* Active Context Banner */}
      <div className="rounded-3xl p-5 border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {activeNotesCount}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {activeNotesCount > 0
                ? `${activeNotesCount} Note${activeNotesCount > 1 ? 's' : ''} Active in AI Memory`
                : 'No notes currently attached to AI context'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeNotesCount > 0
                ? 'Your AI tutor is using these uploaded documents to give personalized, syllabus-accurate answers.'
                : 'Toggle on any note below to provide curriculum grounding for chat and quizzes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Drag & Drop Quick Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
            : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-emerald-400'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UploadCloud size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Drag and drop your study notes or syllabus text files here
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports .txt, .md, pasted lecture transcripts, or textbook chapters
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs">
              Browse File from Computer
              <input
                type="file"
                accept=".txt,.md,.text,.json"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </label>
            <span className="text-xs text-slate-400">or</span>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
            >
              Paste Text Directly
            </button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Your Study Materials ({notes.length})
        </h3>

        {notes.length === 0 ? (
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
            No study materials added yet. Upload your syllabus or notes above to begin.
          </div>
        ) : (
          notes.map((note) => {
            const isExpanded = expandedNoteId === note.id;
            return (
              <div
                key={note.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all"
              >
                {/* Note Header / Bar */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {note.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {note.subject}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Added {new Date(note.dateAdded).toLocaleDateString()} • {note.content.length} characters
                      </p>
                    </div>
                  </div>

                  {/* Note Action Toggles */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Active Context Toggle */}
                    <button
                      onClick={() => onToggleActiveNote(note.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        note.isActiveForContext
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                      title="Include as context for AI Tutor"
                    >
                      <CheckCircle2 size={13} />
                      <span>{note.isActiveForContext ? 'Context Active' : 'Enable Context'}</span>
                    </button>

                    {/* AI Summarize & Flashcards */}
                    <button
                      disabled={isSummarizing}
                      onClick={() => onSummarizeNote(note.id, note.title, note.content)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                      title="Extract summary & flashcards using AI"
                    >
                      <Sparkles size={13} />
                      <span>{isSummarizing ? 'Analyzing...' : 'AI Summary & Flashcards'}</span>
                    </button>

                    {/* Expand/Collapse */}
                    <button
                      onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Note Content & AI Insights */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-6">
                    {/* AI Summary and Flashcards if available */}
                    {note.summary && (
                      <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                            <Sparkles size={16} />
                            <span>AI Generated Executive Summary</span>
                          </div>
                          <button
                            onClick={() => onAskAboutNotesInChat(note.title)}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <span>Chat about this note</span>
                            <span>→</span>
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {note.summary}
                        </p>

                        {/* Flashcards */}
                        {note.flashcards && note.flashcards.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-indigo-200/50 dark:border-indigo-900/50">
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                              Quick Recall Flashcards (Click to flip):
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {note.flashcards.map((fc, fIdx) => {
                                const fKey = `${note.id}-fc-${fIdx}`;
                                const isFlipped = revealedFlashcards[fKey];
                                return (
                                  <div
                                    key={fIdx}
                                    onClick={() => toggleFlashcard(fKey)}
                                    className="p-3.5 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 bg-white dark:bg-slate-800 cursor-pointer hover:shadow-xs transition-all space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                      <span>Q{fIdx + 1}</span>
                                      <span className="text-[10px] text-slate-400">Click to flip</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                      {fc.question}
                                    </p>
                                    {isFlipped ? (
                                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-700">
                                        Answer: {fc.answer}
                                      </p>
                                    ) : (
                                      <p className="text-[11px] text-slate-400 italic">
                                        [ Tap to see answer ]
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Raw Note Content Preview */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Document Content Preview
                      </h5>
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Manual Add / Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl p-6 shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold">Add Study Notes or Syllabus</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note / Topic Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chapter 4: Photosynthesis & Light Reactions"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Biology, History, Computer Science"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paste Study Notes / Syllabus Text
                </label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste lecture notes, definitions, textbook summaries, or formulas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

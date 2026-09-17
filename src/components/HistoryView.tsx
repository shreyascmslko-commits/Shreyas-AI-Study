import React, { useState, useMemo } from 'react';
import { HistoryItem, NavigationTab } from '../types';
import {
  History,
  Search,
  Trash2,
  Download,
  ExternalLink,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Award,
  FileText,
  Clock,
  ChevronRight,
  X,
  Copy,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { exportHistoryToCsv } from '../utils/session';

interface HistoryViewProps {
  historyItems: HistoryItem[];
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onReopenFeature: (tab: NavigationTab, prefill?: { subject?: string; topic?: string; prompt?: string }) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyItems,
  onDeleteHistoryItem,
  onClearHistory,
  onReopenFeature,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);
  const [copied, setCopied] = useState(false);

  const filterTabs = [
    { id: 'all', label: 'All Activities' },
    { id: 'chat', label: 'Ask AI', icon: <MessageSquare size={14} /> },
    { id: 'study', label: 'Study Topics', icon: <BookOpen size={14} /> },
    { id: 'questions', label: 'Practice Quizzes', icon: <HelpCircle size={14} /> },
    { id: 'exam', label: 'Exam Prep', icon: <Award size={14} /> },
    { id: 'notes', label: 'Notes Summary', icon: <FileText size={14} /> },
  ];

  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      const matchesFilter = selectedFilter === 'all' || item.feature === selectedFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.prompt.toLowerCase().includes(q) ||
        (item.subject && item.subject.toLowerCase().includes(q)) ||
        (item.topic && item.topic.toLowerCase().includes(q)) ||
        item.responseSummary.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [historyItems, selectedFilter, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'chat':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'study':
        return <BookOpen size={16} className="text-indigo-500" />;
      case 'questions':
        return <HelpCircle size={16} className="text-purple-500" />;
      case 'exam':
        return <Award size={16} className="text-sky-500" />;
      case 'notes':
        return <FileText size={16} className="text-teal-500" />;
      default:
        return <History size={16} className="text-indigo-500" />;
    }
  };

  const getFeatureBadgeColor = (feature: string) => {
    switch (feature) {
      case 'chat':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60';
      case 'study':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60';
      case 'questions':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60';
      case 'exam':
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/60';
      case 'notes':
        return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            <History size={14} />
            <span>Anonymous Personal Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Study History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All your AI queries, study packs, generated quizzes, and exam prep sessions are saved privately on your device.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          {historyItems.length > 0 && (
            <>
              <button
                id="export-history-btn"
                onClick={() => exportHistoryToCsv(historyItems)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-xs"
              >
                <Download size={15} />
                <span>Export CSV</span>
              </button>
              <button
                id="clear-history-btn"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your local study history?')) {
                    onClearHistory();
                  }
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border border-red-200/60 dark:border-red-900/60 transition-all"
                title="Clear all saved history"
              >
                <Trash2 size={15} />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="history-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past prompts, subjects, topics, or explanations..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? historyItems.length
                : historyItems.filter((i) => i.feature === tab.id).length;
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-${tab.id}`}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* History Items Grid / List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
            <History size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            No Study Activities Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? 'No historical queries matched your search filter. Try clearing the search term.'
              : 'As you chat with Shreyas Master AI, study topics, or generate practice tests, your full sessions will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const date = new Date(item.timestamp);
            const dateStr = date.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });
            const timeStr = date.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="group relative p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top metadata badge row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getFeatureBadgeColor(
                          item.feature
                        )}`}
                      >
                        {getFeatureIcon(item.feature)}
                        <span>{item.featureLabel || item.feature.toUpperCase()}</span>
                      </span>
                      {item.subject && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.subject}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <Clock size={12} />
                      <span>
                        {dateStr}, {timeStr}
                      </span>
                    </div>
                  </div>

                  {/* Prompt Title */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.prompt}
                  </h3>

                  {/* Summary Snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {item.responseSummary}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setActiveItem(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        onReopenFeature(item.feature as NavigationTab, {
                          subject: item.subject,
                          topic: item.topic || item.prompt,
                          prompt: item.prompt,
                        })
                      }
                      title="Reopen in active tool"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      title="Delete this record"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getFeatureBadgeColor(
                      activeItem.feature
                    )}`}
                  >
                    {getFeatureIcon(activeItem.feature)}
                    <span>{activeItem.featureLabel || activeItem.feature}</span>
                  </span>
                  {activeItem.subject && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {activeItem.subject}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(activeItem.timestamp).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeItem.prompt}
                </h2>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 markdown-body">
              <ReactMarkdown>{activeItem.responseSummary}</ReactMarkdown>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <button
                onClick={() => handleCopy(activeItem.responseSummary)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Response'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const item = activeItem;
                    setActiveItem(null);
                    onReopenFeature(item.feature as NavigationTab, {
                      subject: item.subject,
                      topic: item.topic || item.prompt,
                      prompt: item.prompt,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Open in {activeItem.featureLabel || 'Feature'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

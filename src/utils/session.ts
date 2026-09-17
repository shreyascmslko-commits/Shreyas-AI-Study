import { HistoryItem } from '../types';

const SESSION_STORAGE_KEY = 'smai_session_id';
const HISTORY_STORAGE_KEY = 'smai_user_history';

/**
 * Retrieves the persistent anonymous session ID or generates a new one.
 * Users can use the application immediately without creating an account or logging in.
 */
export function getOrCreateSessionId(): string {
  try {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      const randomStr = Math.random().toString(36).substring(2, 10);
      const timestamp = Date.now().toString(36);
      sessionId = `smai_${timestamp}_${randomStr}`;
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch (e) {
    return 'smai_temp_' + Math.random().toString(36).substring(2, 8);
  }
}

const FEATURE_LABELS: Record<string, string> = {
  chat: 'Ask AI Tutor',
  study: '7-Part Study Topic',
  questions: 'Practice Quiz',
  exam: 'Exam Prep Booster',
  notes: 'Notes Analysis',
};

/**
 * Saves a new activity item to the student's personal local history.
 */
export function saveHistoryItem(
  item: Omit<HistoryItem, 'id' | 'timestamp'> & { fullData?: any }
): HistoryItem {
  const sessionId = item.sessionId || getOrCreateSessionId();
  const summaryText = item.responseSummary || item.responseSnippet || '';

  const newItem: HistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sessionId,
    timestamp: Date.now(),
    featureLabel: item.featureLabel || FEATURE_LABELS[item.feature] || item.feature,
    responseSummary: summaryText,
    responseSnippet: summaryText,
  };

  try {
    const existing = getHistoryItems();
    // Keep up to 200 most recent items
    const updated = [newItem, ...existing].slice(0, 200);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history item locally:', e);
  }

  return newItem;
}

/**
 * Returns all saved local history items.
 */
export function getHistoryItems(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch (e) {
    console.error('Failed to load history items:', e);
    return [];
  }
}

/**
 * Deletes a specific history item by ID.
 */
export function deleteHistoryItem(id: string): void {
  try {
    const existing = getHistoryItems();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete history item:', e);
  }
}

/**
 * Clears all personal history items.
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

// Aliases for clean importing
export const getLocalHistory = getHistoryItems;
export const deleteLocalHistoryItem = deleteHistoryItem;
export const clearLocalHistory = clearAllHistory;

/**
 * Exports history to a downloadable CSV file.
 */
export function exportHistoryToCsv(items: HistoryItem[]): void {
  const headers = ['Date', 'Time', 'Feature', 'Subject', 'Topic', 'Prompt / Question', 'Response Summary'];
  const rows = items.map((i) => {
    const d = new Date(i.timestamp);
    const dateStr = d.toLocaleDateString();
    const timeStr = d.toLocaleTimeString();
    return [
      escapeCsvField(dateStr),
      escapeCsvField(timeStr),
      escapeCsvField(i.featureLabel || i.feature),
      escapeCsvField(i.subject || 'General'),
      escapeCsvField(i.topic || 'N/A'),
      escapeCsvField(i.prompt),
      escapeCsvField(i.responseSummary || i.responseSnippet || ''),
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `shreyas_master_ai_history_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeCsvField(field: string): string {
  if (field === null || field === undefined) return '""';
  const clean = String(field).replace(/"/g, '""').replace(/\n/g, ' ');
  return `"${clean}"`;
}

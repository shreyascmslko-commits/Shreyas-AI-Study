import React, { useState, useEffect } from 'react';
import { AdminUsageLog, AdminStats } from '../types';
import {
  ShieldAlert,
  Download,
  Search,
  RefreshCw,
  Lock,
  KeyRound,
  X,
  Database,
  Users,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<AdminUsageLog[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [featureFilter, setFeatureFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AdminUsageLog | null>(null);

  useEffect(() => {
    // If opened and previously authenticated in this session, reload
    const savedToken = sessionStorage.getItem('smai_admin_token');
    if (isOpen && savedToken) {
      setIsAuthenticated(true);
      fetchAdminData(savedToken);
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;

    setLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      setIsAuthenticated(true);
      sessionStorage.setItem('smai_admin_token', passkey);
      fetchAdminData(passkey);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async (token: string) => {
    setLoading(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'x-admin-key': token },
        }),
        fetch('/api/admin/logs', {
          headers: { 'x-admin-key': token },
        }),
      ]);

      if (statsRes.ok && logsRes.ok) {
        const statsData = await statsRes.json();
        const logsData = await logsRes.json();
        setStats(statsData);
        setLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    const token = sessionStorage.getItem('smai_admin_token') || passkey;
    window.open(`/api/admin/export-csv?token=${encodeURIComponent(token)}`, '_blank');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('smai_admin_token');
    setPasskey('');
    setStats(null);
    setLogs([]);
  };

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesFeature = featureFilter === 'all' || log.feature.toLowerCase() === featureFilter.toLowerCase();
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.sessionId.toLowerCase().includes(q) ||
      log.prompt.toLowerCase().includes(q) ||
      log.subject.toLowerCase().includes(q) ||
      log.responseSnippet.toLowerCase().includes(q);
    return matchesFeature && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Shreyas Master AI Admin Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
                  SYSTEM LOGS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Usage telemetry, query audit database & Excel/CSV reporting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!isAuthenticated ? (
          /* Authentication Form */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-xs">
              <KeyRound size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your administrative key to view student usage telemetry and export datasets.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Admin Passkey
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter admin secret..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                    autoFocus
                  />
                </div>
                {authError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 pt-1">
                    <AlertCircle size={14} />
                    <span>{authError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Passkey is managed securely via <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">ADMIN_SECRET</code> in environment configuration.
            </p>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
                <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
                  <span className="text-xs font-bold">Total AI Queries</span>
                  <Database size={16} />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalQueries ?? logs.length}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Across all study modules
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                  <span className="text-xs font-bold">Unique Sessions</span>
                  <Users size={16} />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.uniqueSessions ?? new Set(logs.map((l) => l.sessionId)).size}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Anonymous student devices
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60">
                <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
                  <span className="text-xs font-bold">Today's Queries</span>
                  <Calendar size={16} />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.todayCount ?? logs.filter(l => l.date === new Date().toISOString().slice(0, 10)).length}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Logged in last 24h
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60">
                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
                  <span className="text-xs font-bold">Top Feature</span>
                  <BarChart3 size={16} />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
                  {stats?.featureBreakdown
                    ? Object.entries(stats.featureBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0]?.toUpperCase() || 'CHAT'
                    : 'CHAT'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Most engaged mode
                </div>
              </div>
            </div>

            {/* Controls Bar: Search, Filter, Refresh, Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by session, subject, prompt..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <select
                  value={featureFilter}
                  onChange={(e) => setFeatureFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <option value="all">All Features</option>
                  <option value="chat">Chat</option>
                  <option value="study">Study Mode</option>
                  <option value="questions">Questions</option>
                  <option value="exam">Exam Prep</option>
                  <option value="notes">Notes</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const token = sessionStorage.getItem('smai_admin_token') || passkey;
                    fetchAdminData(token);
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Refresh logs"
                >
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                </button>

                <button
                  id="admin-export-csv-btn"
                  onClick={handleExportCsv}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                >
                  <Download size={14} />
                  <span>Export to Excel / CSV</span>
                </button>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700 z-10">
                    <tr>
                      <th className="py-3 px-4">Session ID</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Feature</th>
                      <th className="py-3 px-4">Prompt / Query</th>
                      <th className="py-3 px-4">Response Snippet</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No audit records found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-850 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {log.sessionId.length > 14
                              ? `${log.sessionId.slice(0, 12)}...`
                              : log.sessionId}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                            {log.date} {log.time}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                            {log.subject || 'General'}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {log.feature.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-800 dark:text-slate-100">
                            {log.prompt}
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                            {log.responseSnippet}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inspect Detail Drawer / Overlay */}
        {selectedLog && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Audit Record Details
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-500">Session ID:</span>{' '}
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.sessionId}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Date / Time:</span>{' '}
                  <span className="text-slate-800 dark:text-slate-200">{selectedLog.date} at {selectedLog.time}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Subject / Feature:</span>{' '}
                  <span className="text-slate-800 dark:text-slate-200">{selectedLog.subject} • {selectedLog.feature}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">User Prompt:</span>
                  <div className="mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-sans text-xs whitespace-pre-wrap">
                    {selectedLog.prompt}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Response Snippet:</span>
                  <div className="mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-sans text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {selectedLog.responseSnippet}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

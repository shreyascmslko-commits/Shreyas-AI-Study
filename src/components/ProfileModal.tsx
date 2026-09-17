import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, User, Sparkles, Check, Flame, Award, BookOpen } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  isDark: boolean;
}

const AVATAR_PRESETS = [
  '🎓', '🚀', '🧠', '🔬', '📚', '⚡', '🌟', '🎨', '💡', '🦁', '🦉', '🦊'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  isDark,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [gradeLevel, setGradeLevel] = useState(profile.gradeLevel);
  const [favoriteSubject, setFavoriteSubject] = useState(profile.favoriteSubject);
  const [avatarSeed, setAvatarSeed] = useState(profile.avatarSeed);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(profile.avatarSeed.startsWith('http'));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim() || 'Alex',
      gradeLevel,
      favoriteSubject,
      avatarSeed: useCustomImage && customAvatarUrl.trim() ? customAvatarUrl.trim() : avatarSeed,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all border ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
              <User size={18} />
            </div>
            <h2 className="text-lg font-bold">Student Profile & Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Choose Avatar or Icon
            </label>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-2xl flex items-center justify-center shadow-md overflow-hidden ring-2 ring-indigo-400/40">
                {useCustomImage && customAvatarUrl ? (
                  <img
                    src={customAvatarUrl}
                    alt="Custom Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setUseCustomImage(false)}
                  />
                ) : (
                  <span>{avatarSeed}</span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <p className="font-semibold text-slate-700 dark:text-slate-200">Study Identity</p>
                <p>Personalize your study companion profile</p>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setAvatarSeed(emoji);
                    setUseCustomImage(false);
                  }}
                  className={`h-10 text-xl rounded-xl flex items-center justify-center border transition-all ${
                    !useCustomImage && avatarSeed === emoji
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-400/40 scale-105'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <span>Or use custom image URL</span>
              </label>
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  if (e.target.value) setUseCustomImage(true);
                }}
                placeholder="https://example.com/photo.jpg"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya, Jordan, Rohan"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Grade / Study Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Academic Level / Grade
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="Middle School (Grades 6-8)">Middle School (Grades 6-8)</option>
              <option value="High School (Grades 9-10)">High School (Grades 9-10)</option>
              <option value="Senior High (Grades 11-12)">Senior High (Grades 11-12)</option>
              <option value="Undergraduate / University">Undergraduate / University</option>
              <option value="Competitive Exam Aspirant">Competitive Exam Aspirant</option>
              <option value="Self-Learner">Self-Learner</option>
            </select>
          </div>

          {/* Favorite Subject */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Primary Focus Subject
            </label>
            <input
              type="text"
              value={favoriteSubject}
              onChange={(e) => setFavoriteSubject(e.target.value)}
              placeholder="e.g. Physics, Mathematics, Organic Chemistry"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Study Badges / Stats Preview */}
          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-around text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-base">
                <Flame size={16} />
                <span>{profile.streakDays} Days</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Study Streak</p>
            </div>
            <div className="w-px h-8 bg-indigo-200/50 dark:bg-indigo-800/50" />
            <div>
              <div className="flex items-center justify-center gap-1 text-indigo-500 font-bold text-base">
                <Award size={16} />
                <span>{profile.questionsSolved}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Questions Practiced</p>
            </div>
            <div className="w-px h-8 bg-indigo-200/50 dark:bg-indigo-800/50" />
            <div>
              <div className="flex items-center justify-center gap-1 text-emerald-500 font-bold text-base">
                <BookOpen size={16} />
                <span>{profile.topicsMastered}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Topics Mastered</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Check size={14} />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

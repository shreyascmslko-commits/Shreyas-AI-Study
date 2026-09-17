import React from 'react';

interface ShreyasMasterLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withGlow?: boolean;
  className?: string;
}

export const ShreyasMasterLogo: React.FC<ShreyasMasterLogoProps> = ({
  size = 'md',
  showText = false,
  withGlow = false,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const svgDimensions = {
    xs: 28,
    sm: 36,
    md: 44,
    lg: 64,
    xl: 96,
  };

  const dim = svgDimensions[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${sizeMap[size]} shrink-0 rounded-2xl flex items-center justify-center transition-all group select-none ${
          withGlow
            ? 'shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/35 hover:shadow-indigo-500/40'
            : ''
        }`}
      >
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform group-hover:scale-105 duration-300"
        >
          <defs>
            {/* Background Gradient */}
            <linearGradient id="smai-bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="45%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Gold Accent Gradient */}
            <linearGradient id="smai-gold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            {/* Indigo/Violet Glow Ring */}
            <linearGradient id="smai-ring" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Letter 'S' Gradient */}
            <linearGradient id="smai-s" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>

            <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base rounded shield / medallion */}
          <rect x="3" y="3" width="94" height="94" rx="26" fill="url(#smai-bg)" stroke="url(#smai-ring)" strokeWidth="2.5" />

          {/* Inner concentric fine decorative golden ring */}
          <circle cx="50" cy="50" r="41" stroke="url(#smai-gold)" strokeWidth="1" strokeDasharray="3 2" opacity="0.65" />

          {/* Royal Crown on Top */}
          <g filter="url(#gold-glow)">
            <path
              d="M37 25 L41 33 L50 22 L59 33 L63 25 L61 36 L39 36 Z"
              fill="url(#smai-gold)"
            />
            {/* Crown jewels / dots */}
            <circle cx="37" cy="24" r="1.8" fill="#ffffff" />
            <circle cx="50" cy="21" r="2.2" fill="#ffffff" />
            <circle cx="63" cy="24" r="1.8" fill="#ffffff" />
          </g>

          {/* Stylized Master 'S' Monogram */}
          <path
            d="M61 43 C59 39 55 37 49 37 C42 37 37 40 37 45.5 C37 51 42 53.5 50 55.5 C59 58 64 61.5 64 67.5 C64 74 58 78 49 78 C40 78 35 73.5 34 68 L41.5 66.5 C42.2 69.5 45 71.5 49 71.5 C53.5 71.5 56.5 69.5 56.5 66.5 C56.5 63 53 61 45 59 C37 57 30 53.5 30 46 C30 39.5 36 34.5 48 34.5 C57 34.5 62 38 64 42.5 Z"
            fill="url(#smai-s)"
            stroke="#1e1b4b"
            strokeWidth="0.8"
          />

          {/* Academic Laurels / Wings on flanks */}
          <g stroke="url(#smai-gold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
            {/* Left Laurel Leaves */}
            <path d="M18 45 C16 48 16 52 19 55" />
            <path d="M17 55 C16 59 18 63 22 66" />
            <path d="M21 66 C23 70 27 73 32 75" />

            {/* Right Laurel Leaves */}
            <path d="M82 45 C84 48 84 52 81 55" />
            <path d="M83 55 C84 59 82 63 78 66" />
            <path d="M79 66 C77 70 73 73 68 75" />
          </g>

          {/* Bottom Academic Star Badge */}
          <polygon
            points="50,81 52,85 56,86 53,89 54,93 50,91 46,93 47,89 44,86 48,85"
            fill="url(#smai-gold)"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              Shreyas Master AI
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
              MASTER
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Your Personal AI Study Partner
          </span>
        </div>
      )}
    </div>
  );
};

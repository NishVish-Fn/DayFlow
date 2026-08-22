import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  variant?: 'dark' | 'light';
}

export const CorporateGlobeLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = '',
  variant = 'dark',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Precision Geometric Global Nexus Mark */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="corpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Clean Rounded Base Shield */}
          <rect width="48" height="48" rx="12" fill="url(#corpGrad)" />

          {/* Precision Latitudinal & Longitudinal Global Wireframe */}
          <circle cx="24" cy="24" r="14" stroke="#ffffff" strokeWidth="1.75" strokeOpacity="0.9" />
          <ellipse cx="24" cy="24" rx="7" ry="14" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.75" />
          <line x1="10" y1="24" x2="38" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.75" />
          <line x1="24" y1="10" x2="24" y2="38" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.75" />

          {/* Center Nexus Core Node */}
          <circle cx="24" cy="24" r="2.5" fill="#38bdf8" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div
            className={`font-black tracking-tight font-display flex items-center gap-1.5 leading-none ${
              variant === 'light' ? 'text-white' : 'text-slate-900'
            } ${currentSize.text} ${textClassName}`}
          >
            <span>DAYFLOW</span>
            <span className="text-blue-600 font-extrabold">HRMS</span>
          </div>
          <span
            className={`font-bold tracking-wider uppercase mt-1 ${
              variant === 'light' ? 'text-slate-400' : 'text-slate-500'
            } ${currentSize.sub}`}
          >
            Workforce Operating System
          </span>
        </div>
      )}
    </div>
  );
};

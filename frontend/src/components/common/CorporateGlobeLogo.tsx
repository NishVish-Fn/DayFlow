import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export const CorporateGlobeLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-sm font-semibold', sub: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-base font-semibold', sub: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-xl font-bold', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-2xl font-bold', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none tracking-tight">
      {/* Apple & Google Precision Geometric Globe */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="appleGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0071e3" />
              <stop offset="40%" stopColor="#4285f4" />
              <stop offset="80%" stopColor="#34a853" />
              <stop offset="100%" stopColor="#fbbc04" />
            </linearGradient>
            <linearGradient id="appleCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0071e3" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {/* Outer Ring */}
          <circle cx="20" cy="20" r="17" stroke="url(#appleGlobeGrad)" strokeWidth="2" strokeLinecap="round" />

          {/* Geodesic Orthogonal Arcs */}
          <ellipse cx="20" cy="20" rx="7.5" ry="17" stroke="url(#appleGlobeGrad)" strokeWidth="1.2" strokeOpacity="0.8" />
          <line x1="3" y1="20" x2="37" y2="20" stroke="url(#appleGlobeGrad)" strokeWidth="1.2" strokeOpacity="0.8" />
          <ellipse cx="20" cy="20" rx="17" ry="7.5" stroke="url(#appleGlobeGrad)" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 2" />

          {/* Center Nexus Active Node */}
          <circle cx="20" cy="20" r="2.5" fill="url(#appleCore)" />
        </svg>
      </div>

      {/* Modern Wordmark */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`flex items-center gap-0.5 text-slate-900 dark:text-white ${currentSize.text} ${textClassName}`}>
            <span className="font-bold tracking-tight">Work</span>
            <span className="font-extrabold text-[#0071e3] dark:text-[#2997ff] tracking-tight">Nest</span>
          </div>
          <span className={`text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase ${currentSize.sub}`}>
            Enterprise Workspace
          </span>
        </div>
      )}
    </div>
  );
};

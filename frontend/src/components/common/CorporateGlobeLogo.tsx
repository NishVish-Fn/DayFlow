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
    sm: { icon: 'w-6 h-6', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Google-World Wireframe Globe with Purple-Blue Glow */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Outer Boundary Circle */}
          <circle cx="24" cy="24" r="20" stroke="url(#globeGrad)" strokeWidth="1.75" />

          {/* Longitude Ellipses (Google-World Grid) */}
          <ellipse cx="24" cy="24" rx="9" ry="20" stroke="url(#globeGrad)" strokeWidth="1.25" strokeOpacity="0.85" />
          <ellipse cx="24" cy="24" rx="16" ry="20" stroke="url(#globeGrad)" strokeWidth="0.9" strokeOpacity="0.4" strokeDasharray="3 2" />

          {/* Latitude Lines */}
          <line x1="4" y1="24" x2="44" y2="24" stroke="url(#globeGrad)" strokeWidth="1.25" strokeOpacity="0.85" />
          <ellipse cx="24" cy="24" rx="20" ry="9" stroke="url(#globeGrad)" strokeWidth="1" strokeOpacity="0.6" />

          {/* Center Nexus Data Node */}
          <circle cx="24" cy="24" r="2.5" fill="#a855f7" />
        </svg>
      </div>

      {/* Brand Typography: WorkNest */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight font-display flex items-center gap-0.5 leading-none text-white ${currentSize.text} ${textClassName}`}>
            <span>Work</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 font-extrabold">
              Nest
            </span>
          </div>
          <span className={`font-mono font-bold tracking-wider uppercase text-purple-300/80 mt-0.5 ${currentSize.sub}`}>
            Enterprise Workspace
          </span>
        </div>
      )}
    </div>
  );
};

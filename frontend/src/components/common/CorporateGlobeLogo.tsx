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
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Glowing Celestial Constellation Sphere */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-indigo-500/20 to-orange-500/20 blur-md pointer-events-none" />

        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="sphereGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#0c192e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Outer Boundary Circle */}
          <circle cx="50" cy="50" r="44" fill="url(#sphereGrad)" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.6" />

          {/* Wireframe Meridian Longitudes */}
          <ellipse cx="50" cy="50" rx="20" ry="44" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />
          <ellipse cx="50" cy="50" rx="34" ry="44" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="3 2" />

          {/* Wireframe Latitudes */}
          <ellipse cx="50" cy="50" rx="44" ry="18" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />
          <ellipse cx="50" cy="50" rx="44" ry="32" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="3 2" />

          {/* Interconnecting Constellation Lines */}
          <path d="M30 35 L70 30 L55 68 L30 35" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" />
          <path d="M70 30 L80 55 L55 68" stroke="#ffffff" strokeWidth="0.7" strokeOpacity="0.5" strokeDasharray="2 1" />
          <path d="M30 35 L20 60 L55 68" stroke="#ffffff" strokeWidth="0.7" strokeOpacity="0.5" strokeDasharray="2 1" />

          {/* Glowing Constellation Nodes (Cyan & Vibrant Orange matching images) */}
          <circle cx="30" cy="35" r="3.5" fill="#38bdf8" />
          <circle cx="70" cy="30" r="4" fill="#f97316" />
          <circle cx="55" cy="68" r="3.5" fill="#fbbf24" />
          <circle cx="20" cy="60" r="2.5" fill="#38bdf8" />
          <circle cx="80" cy="55" r="3" fill="#f97316" />
          <circle cx="50" cy="20" r="2" fill="#ffffff" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight font-display flex items-center gap-1 leading-none text-white ${currentSize.text} ${textClassName}`}>
            <span>dayflow</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 font-extrabold">
              .ai
            </span>
          </div>
          <span className={`font-bold tracking-wider uppercase text-cyan-400/80 mt-0.5 ${currentSize.sub}`}>
            AI Workforce OS
          </span>
        </div>
      )}
    </div>
  );
};

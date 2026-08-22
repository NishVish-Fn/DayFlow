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
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* 3D Interconnected Corporate World Globe Icon */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
        {/* Glowing Aura Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 blur-[8px] opacity-70 animate-pulse" />

        {/* Outer Orbit Ring */}
        <div className="absolute -inset-1 rounded-full border border-cyan-400/40 animate-[spin_12s_linear_infinite]" />
        
        {/* Core Sphere */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-[0_4px_12px_rgba(79,70,229,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Globe Radial Gradient Sphere */}
          <defs>
            <radialGradient id="globeGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="35%" stopColor="#4f46e5" />
              <stop offset="85%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Planet Body */}
          <circle cx="50" cy="50" r="42" fill="url(#globeGrad)" stroke="#6366f1" strokeWidth="1.5" />

          {/* Latitude Lines */}
          <ellipse cx="50" cy="50" rx="42" ry="16" stroke="#93c5fd" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" />
          <ellipse cx="50" cy="50" rx="42" ry="28" stroke="#93c5fd" strokeWidth="1" strokeOpacity="0.4" />
          
          {/* Longitude Meridian Lines */}
          <ellipse cx="50" cy="50" rx="18" ry="42" stroke="#a5b4fc" strokeWidth="1.2" strokeOpacity="0.7" />
          <ellipse cx="50" cy="50" rx="32" ry="42" stroke="#a5b4fc" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="50" y1="8" x2="50" y2="92" stroke="#c7d2fe" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="8" y1="50" x2="92" y2="50" stroke="#c7d2fe" strokeWidth="1.5" strokeOpacity="0.8" />

          {/* Corporate Network Workforce Nodes (Glowing Dots) */}
          <circle cx="34" cy="38" r="3.5" fill="#38bdf8" filter="url(#glow)" />
          <circle cx="68" cy="34" r="3.5" fill="#4ade80" filter="url(#glow)" />
          <circle cx="50" cy="62" r="4" fill="#fbbf24" filter="url(#glow)" />
          <circle cx="30" cy="68" r="3" fill="#f43f5e" filter="url(#glow)" />
          <circle cx="72" cy="66" r="3.5" fill="#c084fc" filter="url(#glow)" />

          {/* Interconnecting Corporate Data Links */}
          <path d="M34 38 L68 34 L50 62 L34 38" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
          <path d="M50 62 L30 68" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 1" />
          <path d="M50 62 L72 66" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 1" />

          {/* Equatorial Orbiting Halo Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="48"
            ry="20"
            transform="rotate(-25 50 50)"
            stroke="url(#ringGrad)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* Corporate Typography Brand */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight font-display text-slate-900 ${currentSize.text} leading-none flex items-center gap-1.5 ${textClassName}`}>
            <span>DAYFLOW</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-extrabold">
              HRMS
            </span>
          </div>
          <span className={`font-bold tracking-widest uppercase text-blue-600 mt-0.5 ${currentSize.sub}`}>
            Global Workforce OS
          </span>
        </div>
      )}
    </div>
  );
};

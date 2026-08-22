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
    lg: { icon: 'w-11 h-11', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Google 4-Color Segmented World Globe */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 4 Google Colors on Latitude & Longitude Geometries */}
          {/* Google Blue Segment */}
          <path
            d="M24 4 A20 20 0 0 1 44 24"
            stroke="#4285F4"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Google Red Segment */}
          <path
            d="M44 24 A20 20 0 0 1 24 44"
            stroke="#EA4335"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Google Yellow Segment */}
          <path
            d="M24 44 A20 20 0 0 1 4 24"
            stroke="#FBBC04"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Google Green Segment */}
          <path
            d="M4 24 A20 20 0 0 1 24 4"
            stroke="#34A853"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Internal Grid Lines */}
          <ellipse cx="24" cy="24" rx="8" ry="18" stroke="#4285F4" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="6" y1="24" x2="42" y2="24" stroke="#34A853" strokeWidth="1.5" strokeOpacity="0.7" />
          
          {/* Center Nexus Node */}
          <circle cx="24" cy="24" r="3" fill="#4285F4" />
        </svg>
      </div>

      {/* Brand Typography: Google Workspace style WorkNest */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-extrabold tracking-tight font-sans flex items-center leading-none text-slate-800 dark:text-white ${currentSize.text} ${textClassName}`}>
            <span className="text-[#4285F4]">W</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC04]">r</span>
            <span className="text-[#4285F4]">k</span>
            <span className="text-[#34A853]">N</span>
            <span className="text-[#EA4335]">e</span>
            <span className="text-[#4285F4]">s</span>
            <span className="text-[#FBBC04]">t</span>
          </div>
          <span className={`font-medium tracking-wide text-slate-500 dark:text-slate-400 mt-0.5 ${currentSize.sub}`}>
            Google Workspace HRMS
          </span>
        </div>
      )}
    </div>
  );
};

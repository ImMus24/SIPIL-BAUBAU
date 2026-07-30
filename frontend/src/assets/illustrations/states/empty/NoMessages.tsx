import React from 'react';
import type { IllustrationProps } from '../types';

export const NoMessages: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak ada pesan">
      <defs>
        <linearGradient id="nmBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blueLight} stopOpacity="0.3" />
          <stop offset="100%" stopColor={blueLight} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="nmBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#nmBg)" />
      {/* Chat bubble */}
      <g transform="translate(55, 55)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <rect x="0" y="0" width="90" height="70" rx="10" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
        {/* Chat tail */}
        <path d="M20 70l10 14 14-14" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
        {/* Dashed lines indicating no content */}
        <line x1="20" y1="22" x2="70" y2="22" stroke={slate} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="20" y1="35" x2="60" y2="35" stroke={slate} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.2" strokeLinecap="round" />
        <line x1="20" y1="48" x2="65" y2="48" stroke={slate} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.15" strokeLinecap="round" />
      </g>
      {/* Small question mark */}
      <g transform="translate(130, 50)">
        <circle cx="0" cy="0" r="14" fill={card} stroke={gold} strokeWidth="1.5" strokeOpacity="0.4" />
        <text x="-3" y="5" fontSize="12" fontWeight="700" fill={gold} opacity="0.6" fontFamily="Inter, sans-serif">?</text>
      </g>
    </svg>
  );
};

export default NoMessages;

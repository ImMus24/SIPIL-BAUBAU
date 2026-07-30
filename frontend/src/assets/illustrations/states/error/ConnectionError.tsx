import React from 'react';
import type { IllustrationProps } from '../types';

export const ConnectionError: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const danger = isDark ? '#ef4444' : '#dc2626';
  const dangerBg = isDark ? '#450a0a' : '#fef2f2';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Koneksi terputus">
      <defs>
        <linearGradient id="ceBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dangerBg} stopOpacity="0.5" />
          <stop offset="100%" stopColor={dangerBg} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#ceBg)" />
      {/* Globe / network arcs */}
      <g transform="translate(58, 55)">
        <circle cx="42" cy="42" r="38" fill="none" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
        <ellipse cx="42" cy="42" rx="20" ry="38" fill="none" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
        <line x1="10" y1="25" x2="74" y2="25" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" />
        <line x1="10" y1="59" x2="74" y2="59" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" />
        {/* Signal bars */}
        <rect x="60" y="30" width="4" height="8" rx="1" fill={slate} opacity="0.3" />
        <rect x="67" y="25" width="4" height="13" rx="1" fill={slate} opacity="0.3" />
        <rect x="74" y="20" width="4" height="18" rx="1" fill={slate} opacity="0.3" />
        {/* X mark over bars */}
        <g className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '4s' } : {}}>
          <line x1="60" y1="20" x2="76" y2="38" stroke={danger} strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="20" x2="60" y2="38" stroke={danger} strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Broken chain */}
        <g transform="translate(0, 70)" opacity="0.4">
          <path d="M10 10l5-5" stroke={danger} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 0l-5 5" stroke={danger} strokeWidth="2" strokeLinecap="round" />
          <rect x="10" y="10" width="10" height="4" rx="2" fill={danger} />
          <rect x="10" y="-4" width="10" height="4" rx="2" fill={danger} />
        </g>
      </g>
    </svg>
  );
};

export default ConnectionError;

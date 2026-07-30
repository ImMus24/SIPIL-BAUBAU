import React from 'react';
import type { IllustrationProps } from '../types';

export const PermissionDenied: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const gold = '#facc15';
  const danger = isDark ? '#ef4444' : '#dc2626';
  const dangerBg = isDark ? '#450a0a' : '#fef2f2';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Izin ditolak">
      <defs>
        <linearGradient id="pdBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dangerBg} stopOpacity="0.5" />
          <stop offset="100%" stopColor={dangerBg} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#pdBg)" />
      {/* Locked door */}
      <g transform="translate(68, 55)">
        {/* Door frame */}
        <rect x="0" y="0" width="64" height="90" rx="6" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
        {/* Door panel */}
        <rect x="6" y="6" width="52" height="78" rx="4" fill={slate} opacity="0.06" />
        {/* Door handle area */}
        <circle cx="48" cy="48" r="4" fill={slate} opacity="0.15" />
        {/* Lock */}
        <g
          className={animated ? 'animate-float' : ''}
          style={animated ? { animationDuration: '6s' } : {}}
          transform="translate(15, 30)"
        >
          <circle cx="17" cy="15" r="17" fill={danger} opacity="0.1" />
          <rect x="8" y="12" width="18" height="15" rx="3" fill={danger} opacity="0.8" />
          <path d="M11 12V8a6 6 0 0112 0v4" stroke={card} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="17" cy="19" r="2.5" fill={card} />
        </g>
        {/* Keyhole line through */}
        <line x1="17" y1="19" x2="17" y2="25" stroke={card} strokeWidth="1.5" opacity="0.6" />
        {/* Slash circle */}
        <g transform="translate(55, 68)" opacity="0.5">
          <circle cx="0" cy="0" r="12" fill="none" stroke={danger} strokeWidth="2" />
          <line x1="-6" y1="-6" x2="6" y2="6" stroke={danger} strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
      {/* Small key */}
      <g transform="translate(50, 120)" opacity="0.3">
        <circle cx="0" cy="0" r="6" fill="none" stroke={gold} strokeWidth="1.5" />
        <rect x="6" y="-1.5" width="12" height="3" rx="1.5" fill={gold} />
        <rect x="15" y="1.5" width="2" height="4" rx="1" fill={gold} />
      </g>
    </svg>
  );
};

export default PermissionDenied;

import React from 'react';
import type { IllustrationProps } from '../types';

export const UploadFailed: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const danger = isDark ? '#ef4444' : '#dc2626';
  const dangerBg = isDark ? '#450a0a' : '#fef2f2';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Unggah gagal">
      <defs>
        <linearGradient id="ufBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dangerBg} stopOpacity="0.5" />
          <stop offset="100%" stopColor={dangerBg} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#ufBg)" />
      {/* Cloud */}
      <g transform="translate(55, 55)">
        <path
          d="M30 40a18 18 0 010-36c2-10 14-18 26-14a22 22 0 0140 2c12 2 18 12 14 24 6 4 6 14 0 18"
          fill={card}
          stroke={slate}
          strokeWidth="1.2"
          strokeOpacity="0.3"
        />
        {/* Up arrow */}
        <g transform="translate(45, 10)">
          <circle cx="10" cy="15" r="14" fill={danger} opacity="0.15" />
          <line x1="10" y1="22" x2="10" y2="8" stroke={danger} strokeWidth="2" strokeLinecap="round" />
          <path d="M5 13l5-6 5 6" stroke={danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* X mark */}
          <g className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '4s' } : {}}>
            <line x1="6" y1="6" x2="14" y2="14" stroke={danger} strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="6" x2="6" y2="14" stroke={danger} strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default UploadFailed;

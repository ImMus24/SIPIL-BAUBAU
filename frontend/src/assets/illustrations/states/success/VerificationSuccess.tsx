import React from 'react';
import type { IllustrationProps } from '../types';

export const VerificationSuccess: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const gold = '#facc15';
  const emerald = '#10b981';
  const emeraldBg = isDark ? '#052e16' : '#f0fdf4';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Verifikasi berhasil">
      <defs>
        <linearGradient id="vsBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={emeraldBg} stopOpacity="0.5" />
          <stop offset="100%" stopColor={emeraldBg} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#vsBg)" />
      {/* Badge / star shape */}
      <g transform="translate(100, 95)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        {/* Badge circle */}
        <circle cx="0" cy="0" r="34" fill={card} stroke={blue} strokeWidth="1.5" strokeOpacity="0.3" />
        <circle cx="0" cy="0" r="26" fill={blue} opacity="0.06" />
        {/* Star */}
        <polygon
          points="0,-18 5,-7 17,-7 8,1 11,13 0,6 -11,13 -8,1 -17,-7 -5,-7"
          fill={gold}
          opacity="0.8"
        />
        {/* Checkmark circle */}
        <circle cx="0" cy="40" r="12" fill={emerald} opacity="0.15" />
        <circle cx="0" cy="40" r="8" fill={emerald} />
        <path d="M-4 40l2 2 5-5" stroke={card} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default VerificationSuccess;

import React from 'react';
import type { IllustrationProps } from '../../types';

export const Analytics: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Analitik data">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Bar chart */}
      <g transform="translate(55, 110)">
        <line x1="0" y1="40" x2="0" y2="0" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
        <line x1="0" y1="40" x2="90" y2="40" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
        <rect x="8" y="20" width="14" height="20" rx="2" fill={blue} opacity="0.6" />
        <rect x="28" y="10" width="14" height="30" rx="2" fill={emerald} opacity="0.6" />
        <rect x="48" y="14" width="14" height="26" rx="2" fill={gold} opacity="0.6" />
        <rect x="68" y="22" width="14" height="18" rx="2" fill={slate} opacity="0.3" />
      </g>
      {/* Trend line */}
      <path d="M55 140l20-30 20-10 20-20 30 40" stroke={blue} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <circle cx="55" cy="140" r="2" fill={blue} opacity="0.5" />
      <circle cx="75" cy="110" r="2" fill={blue} opacity="0.5" />
      <circle cx="95" cy="100" r="2" fill={blue} opacity="0.5" />
      <circle cx="115" cy="80" r="2" fill={blue} opacity="0.5" />
      <circle cx="145" cy="120" r="2" fill={blue} opacity="0.5" />
    </svg>
  );
};

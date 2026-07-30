import React from 'react';
import type { IllustrationProps } from '../../types';

export const TaskCompletion: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const emerald = '#10b981';
  const emeraldBg = isDark ? '#052e16' : '#f0fdf4';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Penyelesaian tugas">
      <circle cx="100" cy="100" r="80" fill={emeraldBg} opacity="0.5" />
      {/* Flag at top */}
      <g transform="translate(100, 55)">
        <line x1="0" y1="0" x2="0" y2="40" stroke={slate} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <path d="M0 2l18 6-18 6" stroke={emerald} strokeWidth="2" strokeLinejoin="round" fill={emerald} fillOpacity="0.3" />
      </g>
      {/* Checkmark circle */}
      <circle cx="100" cy="115" r="18" fill="none" stroke={emerald} strokeWidth="1.5" opacity="0.3" />
      <path d="M92 115l5 5 8-8" stroke={emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Completion spark */}
      <circle cx="145" cy="70" r="2" fill={emerald} opacity="0.25" />
      <circle cx="55" cy="65" r="1.5" fill={emerald} opacity="0.2" />
    </svg>
  );
};

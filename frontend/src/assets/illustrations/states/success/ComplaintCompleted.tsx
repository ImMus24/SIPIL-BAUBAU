import React from 'react';
import type { IllustrationProps } from '../../types';

export const ComplaintCompleted: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const emerald = '#10b981';
  const emeraldBg = isDark ? '#052e16' : '#f0fdf4';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';
  const blue = isDark ? '#3b82f6' : '#004ac6';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Laporan selesai">
      <circle cx="100" cy="100" r="80" fill={emeraldBg} opacity="0.6" />
      {/* Completed flag / ribbon */}
      <g transform="translate(100, 90)">
        <circle cx="0" cy="0" r="30" fill="none" stroke={emerald} strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
        <path d="M-12 -8v24M-12 -8l24 8-24 8" stroke={emerald} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      </g>
      {/* Stars */}
      <polygon points="145,75 148,83 156,83 150,88 152,96 145,91 138,96 140,88 134,83 142,83" fill={emerald} opacity="0.2" />
      <circle cx="60" cy="125" r="2" fill={emerald} opacity="0.25" />
      <circle cx="55" cy="65" r="1.5" fill={emerald} opacity="0.2" />
      {/* Thumbs up */}
      <path d="M82 115v-15a3 3 0 016 0v15" stroke={slate} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <rect x="80" y="112" width="10" height="10" rx="2" fill={slate} opacity="0.15" />
    </svg>
  );
};

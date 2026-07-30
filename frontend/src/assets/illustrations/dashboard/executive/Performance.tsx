import React from 'react';
import type { IllustrationProps } from '../../types';

export const Performance: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kinerja">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Speed / Gauge */}
      <g transform="translate(100, 115)">
        <path d="M-40 0a40 40 0 0180 0" fill="none" stroke={slate} strokeWidth="2" strokeOpacity="0.15" />
        <path d="M-30 0a30 30 0 0160 0" fill="none" stroke={slate} strokeWidth="1.5" strokeOpacity="0.1" strokeDasharray="3 3" />
        {/* Needle pointing high */}
        <line x1="0" y1="0" x2="20" y2="-25" stroke={emerald} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="4" fill={slate} opacity="0.3" />
        {/* Green arc showing good performance */}
        <path d="M-25 0a25 25 0 0145-8" fill="none" stroke={emerald} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </g>
      {/* Upward arrow */}
      <g transform="translate(55, 60)">
        <line x1="0" y1="12" x2="0" y2="0" stroke={emerald} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M-4 4L0 0l4 4" stroke={emerald} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </g>
      {/* Percentage */}
      <text x="125" y="70" fontSize="14" fontWeight="700" fill={emerald} opacity="0.3" fontFamily="Poppins, sans-serif">98%</text>
    </svg>
  );
};

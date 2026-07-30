import React from 'react';
import type { IllustrationProps } from '../../types';

export const RepairProcess: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const emerald = '#10b981';
  const emeraldBg = isDark ? '#052e16' : '#f0fdf4';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';
  const gold = '#facc15';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Proses perbaikan">
      <circle cx="100" cy="100" r="80" fill={emeraldBg} opacity="0.5" />
      {/* Wrench and gear */}
      <g transform="translate(100, 95)">
        <circle cx="-6" cy="0" r="16" fill="none" stroke={slate} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.3" />
        <circle cx="-6" cy="0" r="6" fill={slate} opacity="0.15" />
        <rect x="12" y="-3" width="18" height="6" rx="2" fill={emerald} opacity="0.5" />
        <path d="M30 0l6-6M30 0l6 6" stroke={emerald} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </g>
      {/* Progress indicator */}
      <circle cx="100" cy="135" r="15" fill="none" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" />
      <circle cx="100" cy="135" r="15" fill="none" stroke={emerald} strokeWidth="1.5" strokeDasharray="70 24" strokeOpacity="0.6" transform="rotate(-90 100 135)" />
      <circle cx="100" cy="135" r="4" fill={emerald} opacity="0.5" />
      <text x="66" y="50" fontSize="8" fontWeight="700" fill={slate} opacity="0.25" fontFamily="Inter, sans-serif">REPAIR</text>
    </svg>
  );
};

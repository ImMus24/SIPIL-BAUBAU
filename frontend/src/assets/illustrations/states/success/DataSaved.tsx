import React from 'react';
import type { IllustrationProps } from '../types';

export const DataSaved: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const emeraldBg = isDark ? '#052e16' : '#f0fdf4';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Data berhasil disimpan">
      <defs>
        <linearGradient id="dsBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={emeraldBg} stopOpacity="0.5" />
          <stop offset="100%" stopColor={emeraldBg} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#dsBg)" />
      {/* Database cylinder */}
      <g transform="translate(58, 65)">
        <ellipse cx="42" cy="15" rx="42" ry="12" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
        <rect x="0" y="15" width="84" height="45" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
        <ellipse cx="42" cy="60" rx="42" ry="12" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
        {/* Database rings */}
        <ellipse cx="42" cy="25" rx="42" ry="12" fill="none" stroke={blue} strokeWidth="0.8" opacity="0.2" />
        <ellipse cx="42" cy="40" rx="42" ry="12" fill="none" stroke={blue} strokeWidth="0.8" opacity="0.2" />
        {/* Checkmark */}
        <g className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s' } : {}}>
          <circle cx="42" cy="37" r="16" fill={emerald} opacity="0.15" />
          <path d="M35 37l5 5 9-9" stroke={emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
};

export default DataSaved;

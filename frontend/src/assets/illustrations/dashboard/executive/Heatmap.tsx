import React from 'react';
import type { IllustrationProps } from '../../types';

export const Heatmap: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const danger = '#ef4444';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Peta panas">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Grid base */}
      <rect x="50" y="55" width="100" height="85" rx="4" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
      {/* Heat dots */}
      <circle cx="75" cy="80" r="8" fill={danger} opacity="0.5" />
      <circle cx="82" cy="78" r="5" fill={danger} opacity="0.35" />
      <circle cx="95" cy="90" r="12" fill={gold} opacity="0.4" />
      <circle cx="105" cy="85" r="6" fill={gold} opacity="0.3" />
      <circle cx="120" cy="75" r="10" fill={blue} opacity="0.4" />
      <circle cx="115" cy="95" r="7" fill={emerald} opacity="0.35" />
      <circle cx="130" cy="90" r="4" fill={emerald} opacity="0.25" />
      <circle cx="70" cy="105" r="6" fill={gold} opacity="0.2" />
      <circle cx="90" cy="110" r="5" fill={danger} opacity="0.2" />
      <circle cx="110" cy="115" r="4" fill={blue} opacity="0.2" />
      {/* Legend */}
      <rect x="68" y="148" width="64" height="6" rx="3" fill="url(#heatLegend)" opacity="0.5" />
      <defs>
        <linearGradient id="heatLegend" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={blue} />
          <stop offset="50%" stopColor={gold} />
          <stop offset="100%" stopColor={danger} />
        </linearGradient>
      </defs>
    </svg>
  );
};

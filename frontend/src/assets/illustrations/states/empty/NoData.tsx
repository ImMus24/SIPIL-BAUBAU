import React from 'react';
import type { IllustrationProps } from '../../types';

export const NoData: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak ada data">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Database cylinder */}
      <ellipse cx="100" cy="65" rx="35" ry="10" fill="none" stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
      <rect x="65" y="65" width="70" height="50" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
      <ellipse cx="100" cy="115" rx="35" ry="10" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
      {/* Lines indicating "no data" */}
      <line x1="80" y1="85" x2="120" y2="85" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="85" y1="95" x2="115" y2="95" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="90" y1="105" x2="110" y2="105" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      {/* Slash */}
      <line x1="72" y1="58" x2="128" y2="58" stroke={slate} strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
    </svg>
  );
};

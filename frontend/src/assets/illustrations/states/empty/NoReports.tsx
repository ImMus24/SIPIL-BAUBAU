import React from 'react';
import type { IllustrationProps } from '../../types';

export const NoReports: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak ada laporan">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      <rect x="55" y="60" width="90" height="65" rx="6" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="70" y1="80" x2="130" y2="80" stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="70" y1="92" x2="115" y2="92" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />
      <line x1="70" y1="104" x2="120" y2="104" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />
      <circle cx="100" cy="142" r="3" fill={slate} opacity="0.2" />
      <circle cx="100" cy="142" r="8" fill="none" stroke={blue} strokeWidth="1.2" strokeDasharray="3 2" />
      <path d="M96 142l3 2 5-4" stroke={blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
    </svg>
  );
};

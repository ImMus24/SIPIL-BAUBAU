import React from 'react';
import type { IllustrationProps } from '../../types';

export const ComplaintVerified: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Laporan terverifikasi">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.5" />
      {/* Document with verification badge */}
      <rect x="72" y="55" width="56" height="70" rx="6" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
      <rect x="72" y="55" width="56" height="16" rx="6" fill={blue} opacity="0.8" />
      <line x1="82" y1="82" x2="118" y2="82" stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" strokeLinecap="round" />
      <line x1="82" y1="92" x2="110" y2="92" stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" strokeLinecap="round" />
      <line x1="82" y1="102" x2="105" y2="102" stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" strokeLinecap="round" />
      {/* Gold verification badge */}
      <circle cx="130" cy="65" r="18" fill={gold} opacity="0.2" />
      <circle cx="130" cy="65" r="13" fill={gold} opacity="0.35" />
      <circle cx="130" cy="65" r="9" fill={gold} />
      <path d="M125 65l3 3 5-5" stroke={card} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkles */}
      <circle cx="148" cy="48" r="2" fill={gold} opacity="0.4" />
      <circle cx="58" cy="55" r="2" fill={gold} opacity="0.3" />
    </svg>
  );
};

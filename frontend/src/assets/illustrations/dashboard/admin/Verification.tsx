import React from 'react';
import type { IllustrationProps } from '../../types';

export const Verification: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Verifikasi laporan">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Document stack */}
      <rect x="65" y="45" width="55" height="65" rx="5" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
      <rect x="72" y="55" width="55" height="65" rx="5" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" />
      <rect x="79" y="65" width="55" height="65" rx="5" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.15" />
      {/* Checkmark on top */}
      <circle cx="120" cy="90" r="14" fill={emerald} opacity="0.9" />
      <path d="M114 90l4 4 6-7" stroke={card} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Magnifier */}
      <path d="M155 150l-15-15" stroke={slate} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <circle cx="145" cy="135" r="10" fill="none" stroke={slate} strokeWidth="1.5" opacity="0.25" />
      <line x1="82" y1="78" x2="115" y2="78" stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
      <line x1="82" y1="88" x2="110" y2="88" stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
      <line x1="82" y1="98" x2="105" y2="98" stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
    </svg>
  );
};

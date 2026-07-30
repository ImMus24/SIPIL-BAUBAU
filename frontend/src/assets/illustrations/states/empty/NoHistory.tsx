import React from 'react';
import type { IllustrationProps } from '../../types';

export const NoHistory: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';
  const gold = '#facc15';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak ada riwayat">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Clock */}
      <circle cx="100" cy="95" r="28" fill="none" stroke={slate} strokeWidth="2" strokeOpacity="0.3" />
      <circle cx="100" cy="95" r="5" fill={slate} opacity="0.15" />
      {/* Clock hands */}
      <line x1="100" y1="95" x2="100" y2="80" stroke={slate} strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="100" y1="95" x2="112" y2="95" stroke={slate} strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
          {/* Arrow curved for "history" */}
      <path d="M125 90a28 28 0 11-22-12" stroke={gold} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      <path d="M108 78l5-5-8-2" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
};

import React from 'react';
import type { IllustrationProps } from '../../types';

export const NoAssignments: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak ada penugasan">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Folder */}
      <path d="M60 65h40l10 12h35v50a4 4 0 01-4 4H64a4 4 0 01-4-4V69a4 4 0 014-4z" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
      {/* Down arrow indicating "assign" */}
      <line x1="100" y1="95" x2="100" y2="120" stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
      <path d="M92 112l8 8 8-8" stroke={slate} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
      {/* Small person icon */}
      <circle cx="100" cy="80" r="4" fill={slate} opacity="0.15" />
    </svg>
  );
};

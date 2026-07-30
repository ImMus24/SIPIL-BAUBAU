import React from 'react';
import type { IllustrationProps } from '../../types';

export const HelpIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bantuan">
      <circle cx="50" cy="50" r="38" fill={blueLight} opacity="0.4" />
      {/* Question mark in chat bubble */}
      <rect x="28" y="32" width="44" height="36" rx="8" fill={card} stroke={blue} strokeWidth="1.2" opacity="0.5" />
      <path d="M38 68l-4 6 8-4" fill={card} stroke={blue} strokeWidth="1" opacity="0.5" />
      <text x="44" y="55" fontSize="16" fontWeight="bold" fill={blue} opacity="0.5" fontFamily="Inter, sans-serif">?</text>
    </svg>
  );
};

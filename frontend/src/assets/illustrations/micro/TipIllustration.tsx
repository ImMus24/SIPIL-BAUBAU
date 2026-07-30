import React from 'react';
import type { IllustrationProps } from '../../types';

export const TipIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tips">
      <circle cx="50" cy="50" r="38" fill={blueLight} opacity="0.4" />
      {/* Lightbulb */}
      <circle cx="50" cy="46" r="16" fill={card} stroke={gold} strokeWidth="1.5" opacity="0.6" />
      <path d="M42 52h16" stroke={gold} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M46 56h8" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d="M44 52a8 8 0 0112 0" stroke={gold} strokeWidth="1" opacity="0.3" />
      <circle cx="50" cy="42" r="3" fill={gold} opacity="0.2" />
      {/* Light rays */}
      <line x1="50" y1="25" x2="50" y2="28" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <line x1="34" y1="40" x2="37" y2="42" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <line x1="66" y1="40" x2="63" y2="42" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
};

import React from 'react';
import type { IllustrationProps } from '../../types';

export const TooltipIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Informasi">
      <circle cx="50" cy="50" r="38" fill={blueLight} opacity="0.4" />
      {/* Info bubble */}
      <circle cx="50" cy="48" r="16" fill="none" stroke={blue} strokeWidth="1.5" opacity="0.5" />
      <line x1="50" y1="44" x2="50" y2="54" stroke={blue} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="50" cy="39" r="1.5" fill={blue} opacity="0.6" />
      {/* Small dots around */}
      <circle cx="72" cy="40" r="2" fill={slate} opacity="0.2" />
      <circle cx="30" cy="65" r="1.5" fill={slate} opacity="0.15" />
    </svg>
  );
};

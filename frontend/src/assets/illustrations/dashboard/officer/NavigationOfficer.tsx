import React from 'react';
import type { IllustrationProps } from '../../types';

export const NavigationOfficer: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Navigasi">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Compass */}
      <circle cx="100" cy="90" r="28" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
      <circle cx="100" cy="90" r="24" fill="none" stroke={slate} strokeWidth="0.8" strokeOpacity="0.1" />
      <polygon points="100,64 106,86 100,90 94,86" fill={blue} opacity="0.6" />
      <polygon points="100,116 94,94 100,90 106,94" fill={emerald} opacity="0.6" />
      <circle cx="100" cy="90" r="3" fill={slate} opacity="0.3" />
      {/* Map pin */}
      <circle cx="130" cy="115" r="3" fill={emerald} opacity="0.5" />
      <path d="M130 115l-1 4" stroke={emerald} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
};

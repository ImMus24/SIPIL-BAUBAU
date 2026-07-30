import React from 'react';
import type { IllustrationProps } from '../../types';

export const Error401: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const gold = '#facc15';
  const goldBg = isDark ? '#422006' : '#fefce8';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak terautentikasi (401)">
      <circle cx="100" cy="100" r="80" fill={goldBg} opacity="0.4" />
      {/* Key icon */}
      <circle cx="100" cy="90" r="20" fill={card} stroke={gold} strokeWidth="2" strokeOpacity="0.5" />
      <circle cx="100" cy="90" r="8" fill="none" stroke={gold} strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Key head */}
      <rect x="109" y="106" width="8" height="14" rx="2" fill={gold} opacity="0.4" />
      <rect x="109" y="106" width="8" height="4" rx="1" fill={gold} opacity="0.6" />
      <rect x="109" y="115" width="8" height="4" rx="1" fill={gold} opacity="0.6" />
      {/* Lock icon outline */}
      <path d="M80 140a4 4 0 01-4-4v-2h48v2a4 4 0 01-4 4H80z" fill={gold} opacity="0.15" />
      <text x="85" y="175" fontSize="12" fontWeight="700" fill={slate} opacity="0.3" fontFamily="Inter, sans-serif">UNAUTHORIZED</text>
    </svg>
  );
};

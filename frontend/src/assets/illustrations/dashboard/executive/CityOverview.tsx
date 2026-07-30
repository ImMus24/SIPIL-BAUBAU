import React from 'react';
import type { IllustrationProps } from '../../types';

export const CityOverview: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gambaran umum kota">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Buildings - city skyline */}
      <rect x="55" y="105" width="14" height="30" rx="2" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.3" />
      <rect x="55" y="105" width="14" height="8" rx="2" fill={slate} opacity="0.1" />
      <rect x="75" y="95" width="18" height="40" rx="2" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.3" />
      <rect x="75" y="95" width="18" height="10" rx="2" fill={blue} opacity="0.6" />
      <rect x="98" y="100" width="20" height="35" rx="2" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.3" />
      <rect x="98" y="100" width="20" height="8" rx="2" fill={emerald} opacity="0.6" />
      <rect x="123" y="108" width="14" height="27" rx="2" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.3" />
      {/* Sun */}
      <circle cx="150" cy="65" r="12" fill={gold} opacity="0.2" />
      <circle cx="150" cy="65" r="8" fill={gold} opacity="0.35" />
      {/* Trees */}
      <circle cx="48" cy="118" r="5" fill={emerald} opacity="0.3" />
      <circle cx="52" cy="115" r="4" fill={emerald} opacity="0.25" />
      <rect x="50" y="120" width="2" height="8" fill={slate} opacity="0.15" />
      {/* Label */}
      <text x="68" y="170" fontSize="8" fontWeight="700" fill={slate} opacity="0.25" fontFamily="Inter, sans-serif">BAUBAU</text>
    </svg>
  );
};

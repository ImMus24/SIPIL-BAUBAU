import React from 'react';
import type { IllustrationProps } from '../../types';

export const NoSearchResults: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pencarian tidak ditemukan">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Magnifying glass */}
      <circle cx="90" cy="90" r="22" fill="none" stroke={slate} strokeWidth="2.5" strokeOpacity="0.4" />
      <line x1="106" y1="106" x2="122" y2="122" stroke={slate} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.4" />
      {/* Question mark inside */}
      <text x="83" y="97" fontSize="22" fontWeight="bold" fill={slate} opacity="0.3" fontFamily="Inter, sans-serif">?</text>
      {/* Small dots */}
      <circle cx="145" cy="65" r="2" fill={slate} opacity="0.2" />
      <circle cx="155" cy="75" r="1.5" fill={slate} opacity="0.15" />
      <circle cx="50" cy="135" r="2" fill={slate} opacity="0.2" />
    </svg>
  );
};

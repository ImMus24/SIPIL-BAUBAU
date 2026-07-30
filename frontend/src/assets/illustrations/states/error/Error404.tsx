import React from 'react';
import type { IllustrationProps } from '../../types';

export const Error404: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Halaman tidak ditemukan (404)">
      <defs>
        <linearGradient id="e404" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blueLight} stopOpacity="0.5" />
          <stop offset="100%" stopColor={blueLight} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#e404)" />
      {/* 4-0-4 numbers */}
      <text x="48" y="125" fontSize="62" fontWeight="900" fill={slate} opacity="0.15" fontFamily="Poppins, sans-serif">4</text>
      <circle cx="113" cy="100" r="18" fill={card} stroke={slate} strokeWidth="2" strokeOpacity="0.3" />
      <text x="100" y="108" fontSize="22" fontWeight="900" fill={slate} opacity="0.2" fontFamily="Poppins, sans-serif">0</text>
      <text x="142" y="125" fontSize="62" fontWeight="900" fill={slate} opacity="0.15" fontFamily="Poppins, sans-serif">4</text>
      {/* Map pin */}
      <path d="M152 160a3 3 0 11-6 0 3 3 0 016 0z" fill={blue} opacity="0.5" />
      <path d="M149 160l-2 6" stroke={blue} strokeWidth="1.5" opacity="0.4" />
      {/* Dots */}
      <circle cx="35" cy="65" r="2" fill={slate} opacity="0.2" />
      <circle cx="58" cy="42" r="1.5" fill={gold} opacity="0.3" />
      <circle cx="165" cy="70" r="2.5" fill={gold} opacity="0.2" />
    </svg>
  );
};

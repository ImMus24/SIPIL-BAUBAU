import React from 'react';
import type { IllustrationProps } from '../../types';

export const NoInternet: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const gold = '#facc15';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak ada koneksi internet">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Wi-Fi arcs */}
      <path d="M60 85a45 45 0 0180 0" stroke={slate} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.3" />
      <path d="M72 100a30 30 0 0156 0" stroke={slate} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.25" />
      <path d="M84 115a15 15 0 0132 0" stroke={slate} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.2" />
      {/* Slash through */}
      <line x1="55" y1="55" x2="145" y2="145" stroke={gold} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      {/* Wi-Fi dot base */}
      <circle cx="100" cy="135" r="4" fill={slate} opacity="0.4" />
      {/* Small signal dots */}
      <circle cx="155" cy="50" r="2" fill={slate} opacity="0.15" />
      <circle cx="50" cy="150" r="1.5" fill={slate} opacity="0.15" />
    </svg>
  );
};

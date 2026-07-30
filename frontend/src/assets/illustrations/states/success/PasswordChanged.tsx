import React from 'react';
import type { IllustrationProps } from '../../types';

export const PasswordChanged: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const emerald = '#10b981';
  const emeraldBg = isDark ? '#052e16' : '#f0fdf4';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kata sandi berhasil diubah">
      <circle cx="100" cy="100" r="80" fill={emeraldBg} opacity="0.6" />
      {/* Lock with check */}
      <path d="M85 95v-8a15 15 0 0130 0v8" stroke={slate} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
      <rect x="82" y="95" width="36" height="24" rx="5" fill={card} stroke={emerald} strokeWidth="1.5" opacity="0.6" />
      <path d="M90 105l4 4 8-8" stroke={emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Spinning/cycling arrows */}
      <g transform="translate(100, 148)">
        <path d="M-12 0a12 12 0 0119-8" stroke={emerald} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <polygon points="10,-8 15,-6 12,-2" fill={emerald} opacity="0.4" />
      </g>
      <circle cx="60" cy="60" r="2" fill={emerald} opacity="0.3" />
      <circle cx="140" cy="145" r="1.5" fill={emerald} opacity="0.2" />
    </svg>
  );
};

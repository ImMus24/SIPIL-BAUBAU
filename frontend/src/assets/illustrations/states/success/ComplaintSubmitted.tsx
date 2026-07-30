import React from 'react';
import type { IllustrationProps } from '../../types';

export const ComplaintSubmitted: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const emerald = '#10b981';
  const emeraldBg = isDark ? '#052e16' : '#f0fdf4';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';
  const blue = isDark ? '#3b82f6' : '#004ac6';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Laporan berhasil dikirim">
      <circle cx="100" cy="100" r="80" fill={emeraldBg} opacity="0.6" />
      <circle cx="100" cy="100" r="55" fill={emeraldBg} />
      {/* Success checkmark */}
      <circle cx="100" cy="95" r="32" fill={emerald} opacity="0.15" />
      <circle cx="100" cy="95" r="22" fill={emerald} opacity="0.2" />
      <circle cx="100" cy="95" r="15" fill={emerald} />
      <path d="M92 95l5 5 8-10" stroke={card} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkle dots */}
      <circle cx="135" cy="70" r="3" fill={emerald} opacity="0.3" />
      <circle cx="145" cy="60" r="2" fill={emerald} opacity="0.2" />
      <circle cx="65" cy="135" r="2.5" fill={emerald} opacity="0.25" />
      {/* Paper plane */}
      <path d="M68 68l-8 2 10-8-2 6z" fill={blue} opacity="0.2" />
    </svg>
  );
};

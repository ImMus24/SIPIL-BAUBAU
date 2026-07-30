import React from 'react';
import type { IllustrationProps } from '../../types';

export const Error403: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const danger = '#ef4444';
  const dangerBg = isDark ? '#450a0a' : '#fef2f2';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Akses ditolak (403)">
      <circle cx="100" cy="100" r="80" fill={dangerBg} opacity="0.4" />
      {/* Shield with lock */}
      <path d="M100 45l40 15v20a45 45 0 01-40 35 45 45 0 01-40-35V60l40-15z" fill={card} stroke={danger} strokeWidth="1.8" strokeOpacity="0.5" />
      <path d="M88 95v-8a12 12 0 0124 0v8" stroke={danger} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <rect x="88" y="95" width="24" height="16" rx="3" stroke={danger} strokeWidth="1.5" opacity="0.6" />
      <circle cx="100" cy="103" r="2.5" fill={danger} opacity="0.6" />
      <line x1="100" y1="103" x2="100" y2="108" stroke={danger} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Small X marks */}
      <line x1="55" y1="55" x2="68" y2="68" stroke={danger} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <line x1="68" y1="55" x2="55" y2="68" stroke={danger} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
};

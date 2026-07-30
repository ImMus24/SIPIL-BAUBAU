import React from 'react';
import type { IllustrationProps } from '../../types';

export const Error500: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const danger = '#ef4444';
  const dangerBg = isDark ? '#450a0a' : '#fef2f2';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kesalahan server (500)">
      <circle cx="100" cy="100" r="80" fill={dangerBg} opacity="0.4" />
      {/* Server / Database */}
      <rect x="65" y="55" width="70" height="55" rx="6" fill={card} stroke={danger} strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Blinking lights */}
      <circle cx="80" cy="72" r="4" fill={danger} opacity="0.4" />
      <circle cx="95" cy="72" r="4" fill={danger} opacity="0.2" />
      <circle cx="110" cy="72" r="4" fill={slate} opacity="0.2" />
      {/* Server lines */}
      <line x1="76" y1="86" x2="124" y2="86" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="76" y1="96" x2="115" y2="96" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="76" y1="106" x2="120" y2="106" stroke={slate} strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      {/* Warning triangle */}
      <path d="M100 135l-10-15h20l-10 15z" fill={danger} opacity="0.3" />
      <line x1="100" y1="125" x2="100" y2="131" stroke={danger} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="100" cy="135" r="1" fill={danger} opacity="0.6" />
      {/* Small dots */}
      <circle cx="55" cy="50" r="2" fill={danger} opacity="0.2" />
      <circle cx="145" cy="60" r="1.5" fill={danger} opacity="0.15" />
    </svg>
  );
};

import React from 'react';
import type { IllustrationProps } from '../../types';

export const Offline: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Offline">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Plug/disconnect */}
      <g transform="translate(100, 95)">
        <rect x="-5" y="-20" width="10" height="15" rx="2" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
        <rect x="-2" y="-28" width="4" height="8" rx="1" fill={slate} opacity="0.2" />
        <line x1="-5" y1="-12" x2="-5" y2="-5" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
        <line x1="5" y1="-12" x2="5" y2="-5" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
        <rect x="-8" y="-5" width="16" height="8" rx="3" fill={gold} opacity="0.2" />
        <line x1="12" y1="-2" x2="18" y2="2" stroke={gold} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </g>
      {/* Broken connection dots */}
      <circle cx="60" cy="140" r="2" fill={slate} opacity="0.2" />
      <circle cx="140" cy="140" r="2" fill={slate} opacity="0.2" />
      <text x="78" y="165" fontSize="11" fontWeight="700" fill={slate} opacity="0.25" fontFamily="Inter, sans-serif">OFFLINE</text>
    </svg>
  );
};

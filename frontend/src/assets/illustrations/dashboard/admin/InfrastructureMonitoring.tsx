import React from 'react';
import type { IllustrationProps } from '../../types';

export const InfrastructureMonitoring: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pemantauan infrastruktur">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Radar / Satellite dish */}
      <g transform="translate(100, 115)">
        <path d="M-30 0a35 35 0 0160 0" fill="none" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
        <path d="M-20 0a25 25 0 0140 0" fill="none" stroke={slate} strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3" />
        <path d="M-10 0a15 15 0 0120 0" fill="none" stroke={emerald} strokeWidth="1.5" strokeOpacity="0.4" />
      </g>
      {/* Antenna */}
      <line x1="100" y1="115" x2="100" y2="65" stroke={slate} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="65" x2="85" y2="50" stroke={slate} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="65" x2="115" y2="50" stroke={slate} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <circle cx="100" cy="115" r="4" fill={blue} opacity="0.5" />
      {/* Signal waves */}
      <path d="M135 55a30 30 0 00-52 0" stroke={blue} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M145 45a45 45 0 00-78 0" stroke={blue} strokeWidth="1" strokeLinecap="round" opacity="0.2" />
      {/* Small buildings */}
      <rect x="52" y="120" width="12" height="18" rx="2" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
      <rect x="135" y="125" width="15" height="13" rx="2" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
    </svg>
  );
};

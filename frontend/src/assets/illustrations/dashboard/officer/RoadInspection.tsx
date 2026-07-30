import React from 'react';
import type { IllustrationProps } from '../../types';

export const RoadInspection: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Inspeksi jalan">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Road */}
      <rect x="35" y="130" width="130" height="12" rx="4" fill={slate} opacity="0.15" />
      <rect x="40" y="133" width="55" height="4" rx="2" fill={card} stroke={slate} strokeWidth="0.5" strokeOpacity="0.2" />
      {/* Crack on road */}
      <path d="M60 130l8-5 4-10" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Officer */}
      <rect x="90" y="90" width="20" height="30" rx="6" fill={blue} opacity="0.7" />
      <circle cx="100" cy="80" r="8" fill={slate} />
      {/* Clipboard */}
      <rect x="112" y="95" width="12" height="18" rx="2" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.3" />
      <line x1="115" y1="101" x2="121" y2="101" stroke={slate} strokeWidth="0.8" strokeOpacity="0.2" />
      <line x1="115" y1="105" x2="121" y2="105" stroke={slate} strokeWidth="0.8" strokeOpacity="0.2" />
      {/* Cone */}
      <path d="M45 140l6-18h-12l6 18z" fill={gold} opacity="0.4" />
      <rect x="43" y="140" width="16" height="4" rx="1" fill={gold} opacity="0.3" />
    </svg>
  );
};

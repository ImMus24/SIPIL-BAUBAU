import React from 'react';
import type { IllustrationProps } from '../../types';

export const Maintenance: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pemeliharaan sistem">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Gear / Cog */}
      <g transform="translate(100, 92)">
        <circle cx="0" cy="0" r="18" fill="none" stroke={slate} strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.4" />
        <circle cx="0" cy="0" r="8" fill={card} stroke={blue} strokeWidth="1.5" strokeOpacity="0.5" />
        <circle cx="0" cy="0" r="3" fill={blue} opacity="0.3" />
        {/* Spokes */}
        {[0, 60, 120, 180, 240, 300].map(angle => (
          <line
            key={angle}
            x1="0" y1="-8"
            x2="0" y2="-22"
            stroke={slate}
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.3"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
      {/* Wrench */}
      <g transform="translate(120, 115) rotate(30)">
        <rect x="0" y="0" width="4" height="22" rx="2" fill={slate} opacity="0.25" />
        <circle cx="2" cy="0" r="6" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.4" />
      </g>
      <text x="70" y="165" fontSize="10" fontWeight="600" fill={slate} opacity="0.3" fontFamily="Inter, sans-serif">MAINTENANCE</text>
    </svg>
  );
};

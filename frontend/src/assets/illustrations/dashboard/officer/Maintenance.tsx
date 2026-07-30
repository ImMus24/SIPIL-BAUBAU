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
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pemeliharaan infrastruktur">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Bridge / arch */}
      <path d="M50 140q25-40 50-5t50 5" fill="none" stroke={slate} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.2" />
      <line x1="55" y1="140" x2="55" y2="150" stroke={slate} strokeWidth="2" opacity="0.2" />
      <line x1="145" y1="140" x2="145" y2="150" stroke={slate} strokeWidth="2" opacity="0.2" />
      {/* Gear */}
      <g transform="translate(100, 90)">
        <circle cx="0" cy="0" r="15" fill="none" stroke={gold} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
        <circle cx="0" cy="0" r="5" fill={gold} opacity="0.2" />
        {[0, 60, 120, 180, 240, 300].map(angle => (
          <line key={angle} x1="0" y1="-5" x2="0" y2="-18" stroke={gold} strokeWidth="2" strokeLinecap="round" opacity="0.3" transform={`rotate(${angle})`} />
        ))}
      </g>
      <text x="76" y="175" fontSize="8" fontWeight="700" fill={slate} opacity="0.25" fontFamily="Inter, sans-serif">MAINTENANCE</text>
    </svg>
  );
};

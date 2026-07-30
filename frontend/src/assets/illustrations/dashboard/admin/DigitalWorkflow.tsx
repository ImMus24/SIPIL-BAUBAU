import React from 'react';
import type { IllustrationProps } from '../../types';

export const DigitalWorkflow: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Alur kerja digital">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Nodes connected */}
      <g transform="translate(60, 90)">
        <circle cx="0" cy="0" r="10" fill={card} stroke={blue} strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4" fill={blue} opacity="0.5" />
      </g>
      <g transform="translate(100, 65)">
        <circle cx="0" cy="0" r="10" fill={card} stroke={emerald} strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4" fill={emerald} opacity="0.5" />
      </g>
      <g transform="translate(135, 95)">
        <circle cx="0" cy="0" r="10" fill={card} stroke={gold} strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4" fill={gold} opacity="0.5" />
      </g>
      <g transform="translate(100, 125)">
        <circle cx="0" cy="0" r="10" fill={card} stroke={slate} strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4" fill={slate} opacity="0.3" />
      </g>
      {/* Connecting lines */}
      <line x1="70" y1="90" x2="90" y2="75" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
      <line x1="110" y1="75" x2="125" y2="95" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
      <line x1="125" y1="105" x2="110" y2="115" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
      <line x1="100" y1="115" x2="100" y2="125" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
      <line x1="70" y1="100" x2="100" y2="115" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
      {/* Arrowheads */}
      <polygon points="88,76 86,72 92,74" fill={slate} opacity="0.2" />
      <polygon points="123,96 126,94 124,100" fill={slate} opacity="0.2" />
      <polygon points="108,116 111,114 109,120" fill={slate} opacity="0.2" />
      <text x="66" y="175" fontSize="8" fontWeight="700" fill={slate} opacity="0.25" fontFamily="Inter, sans-serif">WORKFLOW</text>
    </svg>
  );
};

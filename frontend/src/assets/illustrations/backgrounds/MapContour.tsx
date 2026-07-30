import React from 'react';
import type { IllustrationProps } from '../../types';

export const MapContour: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const slate = isDark ? '#94a3b8' : '#64748b';

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
    >
      <path
        d="M0 200 Q 80 120 160 180 T 320 160 T 400 200"
        fill="none"
        stroke={slate}
        strokeWidth="1"
        opacity="0.06"
      />
      <path
        d="M0 180 Q 60 100 140 160 T 300 140 T 400 180"
        fill="none"
        stroke={slate}
        strokeWidth="0.8"
        opacity="0.05"
      />
      <path
        d="M0 220 Q 100 150 180 200 T 340 190 T 400 230"
        fill="none"
        stroke={slate}
        strokeWidth="1.2"
        opacity="0.04"
      />
      <circle cx="200" cy="150" r="30" fill="none" stroke={slate} strokeWidth="0.5" opacity="0.04" />
      <circle cx="200" cy="150" r="50" fill="none" stroke={slate} strokeWidth="0.5" opacity="0.03" />
      <circle cx="200" cy="150" r="70" fill="none" stroke={slate} strokeWidth="0.5" opacity="0.02" />
    </svg>
  );
};
